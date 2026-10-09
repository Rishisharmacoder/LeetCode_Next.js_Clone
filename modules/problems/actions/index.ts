"use server";

import { UserRole } from "@/app/generated/prisma/enums";
import { db } from "@/lib/db";
import { pollBatchResults, submitBatch } from "@/lib/judge0";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const getAllProblems = async () => {
  try {
    const user = await currentUser();

    const data = user?.id
      ? await db.user.findUnique({
          where: {
            clerkId: user.id,
          },
          select: {
            id: true,
          },
        })
      : null;

    const solvedProblems = data?.id
      ? await db.$queryRaw<Array<{ problemId: string }>>`
          SELECT "problemId"
          FROM "ProblemSolved"
          WHERE "userId" = ${data.id}
        `
      : [];

    const solvedProblemIds = new Set(
      solvedProblems.map(({ problemId }) => problemId),
    );

    const problems = await db.problem.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      Success: true,
      data: problems.map((problem) => ({
        ...problem,
        solvedBy: solvedProblemIds.has(problem.id)
          ? [{}]
          : [],
      })),
    };
  } catch (error) {
    console.log("❌ Error fetching problems:", error);

    return {
      Success: false,
      error: "Failed to fetch problems",
    };
  }
};

export const getProblemById = async (id: string) => {
  try {
    const problem = await db.problem.findUnique({
      where: {
        id: id,
      },
    });

    return {
      Success: true,
      data: problem,
    };
  } catch (error) {
    console.log("❌ Error fetching problems:", error);

    return {
      Success: false,
      error: "Failed to fetch problems",
    };
  }
};

// export const getAllSubmissionByCurrentUserForProblem = async (
//   problemId: string,
// ) => {
//   try {
//     const user = await currentUser();

//     if (!user) {
//       return {
//         success: false,
//         error: "Unauthorized",
//       };
//     }

//     const dbUser = await db.user.findUnique({
//       where: {
//         clerkId: user.id,
//       },
//       select: {
//         id: true,
//       },
//     });

//     if (!dbUser) {
//       return {
//         success: false,
//         error: "User not found",
//       };
//     }

//     const submissions = await db.submission.findMany({
//       where: {
//         userId: dbUser.id,
//         problemId,
//       },
//       include: {
//         testCases: true,
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     return {
//       success: true,
//       data: submissions,
//     };
//   } catch (error) {
//     console.error(
//       "Error fetching user submissions:",
//       error,
//     );

//     return {
//       success: false,
//       error:
//         error instanceof Error
//           ? error.message
//           : "Failed to fetch submissions",
//     };
//   }
// };

const getLanguageName = (
  languageId: number | string | undefined,
) => {
  const normalized = Number(languageId);

  const languageMap: Record<number, string> = {
    50: "C",
    54: "C++",
    60: "Go",
    62: "Java",
    63: "JavaScript",
    71: "Python",
  };

  return languageMap[normalized] ?? "Unknown";
};

export const deleteProblem = async (
  problemId: string,
) => {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    // verify if user is admin
    const dbUser = await db.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        role: true,
      },
    });

    if (dbUser?.role !== UserRole.ADMIN) {
      throw new Error("Only admin can delet Problems");
    }

    await db.problem.delete({
      where: {
        id: problemId,
      },
    });

    revalidatePath("/problems");

    return {
      Success: true,
      message: "Problem deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting problem:", error);

    return {
      Success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete problem",
    };
  }
};

export const executeCode = async (
  source_code: string,
  language_id: number | undefined,
  stdin: string[],
  expected_outputs: string[],
  problem_id: string,
) => {
  try {
    const user = await currentUser();

    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const dbUser = await db.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    if (!dbUser) {
      return {
        success: false,
        error: "User not found",
      };
    }

    if (typeof language_id !== "number") {
      return {
        success: false,
        error: "Unsupported language",
      };
    }

    if (
      !source_code?.trim() ||
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return {
        success: false,
        error: "Invalid code or test cases",
      };
    }

    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
      base64_encoded: false,
      wait: false,
    }));

    const submitResponse = await submitBatch(
      submissions,
    );

    const tokens = submitResponse.map(
      (res) => res.token,
    );

    const results = await pollBatchResults(tokens);

    let allPassed = true;

    const detailedResults = results.map(
      (result, i) => {
        const stdout =
          result.stdout?.trim() || null;

        const expected_output =
          expected_outputs[i]?.trim();

        const passed =
          stdout === expected_output;

        if (!passed) {
          allPassed = false;
        }

        return {
          testCase: i + 1,
          passed,
          stdout,
          expected: expected_output,
          stderr: result.stderr || null,
          compile_output:
            result.compile_output || null,
          status:
            typeof result?.status?.description ===
            "string"
              ? result.status.description
              : "Unknown",
          memory: result.memory
            ? `${result.memory} KB`
            : undefined,
          time: result.time
            ? `${result.time} s`
            : undefined,
        };
      },
    );

    const submission =
      await db.submission.create({
        data: {
          userId: dbUser.id,
          problemId: problem_id,
          sourceCode: source_code,
          language: getLanguageName(language_id),
          stdin: stdin.join("\n"),
          stdout: JSON.stringify(
            detailedResults.map(
              (r) => r.stdout,
            ),
          ),
          stderr: detailedResults.some(
            (r) => r.stderr,
          )
            ? JSON.stringify(
                detailedResults.map(
                  (r) => r.stderr,
                ),
              )
            : null,
          compileOutput: detailedResults.some(
            (r) => r.compile_output,
          )
            ? JSON.stringify(
                detailedResults.map(
                  (r) => r.compile_output,
                ),
              )
            : null,
          status: allPassed
            ? "Accepted"
            : "Wrong Answer",
          memory: detailedResults.some(
            (r) => r.memory,
          )
            ? JSON.stringify(
                detailedResults.map(
                  (r) => r.memory,
                ),
              )
            : null,
          time: detailedResults.some(
            (r) => r.time,
          )
            ? JSON.stringify(
                detailedResults.map(
                  (r) => r.time,
                ),
              )
            : null,
        },
      });

    if (allPassed) {
      await db.problemSolved.upsert({
        where: {
          userId_problemId: {
            userId: dbUser.id,
            problemId: problem_id,
          },
        },
        update: {},
        create: {
          userId: dbUser.id,
          problemId: problem_id,
        },
      });
    }

    const testCaseResults = detailedResults.map(
      (result) => ({
        submissionId: submission.id,
        testCase: result.testCase,
        passed: result.passed,
        stdout: result.stdout,
        expected: result.expected,
        stderr: result.stderr,
        compileOutput: result.compile_output,
        status: result.status,
        memory: result.memory,
        time: result.time,
      }),
    );

    await db.testCaseResult.createMany({
      data: testCaseResults,
    });

    const submissionWithTestCases =
      await db.submission.findUnique({
        where: {
          id: submission.id,
        },
        include: {
          testCases: true,
        },
      });

    return {
      success: true,
      submission: submissionWithTestCases,
    };
  } catch (error) {
    console.error(
      "Error executing code:",
      error,
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to execute code",
    };
  }
};


export const getAllSubmissionByCurrentUserForProblem = async (
  problemId: string,
) => {
  try {
    const user = await currentUser();

    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const dbUser = await db.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        id: true,
      },
    });

    if (!dbUser) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const submissions = await db.submission.findMany({
      where: {
        userId: dbUser.id,
        problemId,
      },
      include: {
        testCases: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: submissions,
    };
  } catch (error) {
    console.error(
      "Error fetching user submissions:",
      error,
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch submissions",
    };
  }
};
