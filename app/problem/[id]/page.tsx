"use client";

import { useTheme } from "next-themes";

import Editor from "@monaco-editor/react";

import React, { use, useState, useEffect } from "react";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Play,
  Send,
  Code,
  FileText,
  Lightbulb,
  Trophy,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { ModeToggle } from "@/components/ui/mode-toggle";

import { getJudge0LanguageId } from "@/lib/judge0-languages";

import { toast } from "sonner";

import Link from "next/link";

import {
  executeCode,
  getAllSubmissionByCurrentUserForProblem,
  getProblemById,
} from "@/modules/problems/actions";

import { SubmissionDetails } from "@/modules/problems/components/submission-details";

import { TestCaseTable } from "@/modules/problems/components/test-case-table";

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "EASY":
      return "bg-green-100 text-green-800 border-green-200";

    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";

    case "HARD":
      return "bg-red-100 text-red-800 border-red-200";

    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const ProblemIdPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = use(params);
  const [problem, setProblem] = useState<any>(null);

  const [selectedLanguage, setSelectedLanguage] =
    useState("JAVASCRIPT");

  const [code, setCode] = useState("");

  const [output, setOutput] = useState("");

  const [isRunning, setIsRunning] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submissionHistory, setSubmissionHistory] =
    useState<any[]>([]);

  const [executionResponse, setExecutionResponse] =
    useState<any>(null);

  const { theme } = useTheme();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const problemData = await getProblemById(id);

        console.log(problemData);

        if (problemData.Success && problemData.data) {
          setProblem(problemData.data);
        }
      } catch (error) {
        console.error("Error fetching problem:", error);
      }
    };

    fetchProblem();
  }, [id]);

  useEffect(() => {
    const fetchSubmissionHistory = async () => {
      try {
        const submissionHistory =
          await getAllSubmissionByCurrentUserForProblem(
            id,
          );

        console.log(submissionHistory);

        if (submissionHistory.success) {
          setSubmissionHistory(
            submissionHistory.data ?? [],
          );
        }
      } catch (error) {
        console.error("Error fetching problem:", error);
      }
    };

    fetchSubmissionHistory();
  }, [id]);

  useEffect(() => {
    const codeSnippets = problem?.codeSnippets;
    const snippet =
      codeSnippets !== null &&
      typeof codeSnippets === "object" &&
      !Array.isArray(codeSnippets)
        ? codeSnippets[selectedLanguage]
        : undefined;

    setCode(typeof snippet === "string" ? snippet : "");
  }, [selectedLanguage, problem]);

  const handleRun = async () => {
    try {
      setIsRunning(true);

      const language_id =
        getJudge0LanguageId(selectedLanguage);

      const stdin = problem.testCases.map(
        (tc: any) => tc.input,
      );

      const expected_outputs = problem.testCases.map(
        (tc: any) => tc.output,
      );

      const res = await executeCode(
        code,
        language_id,
        stdin,
        expected_outputs,
        problem.id,
      );

      setExecutionResponse(res);

      if (res.success) {
        toast.success("Code executed successfully");
      } else {
        toast.error(
          res.error || "Code execution failed",
        );
      }
    } catch (error) {
      console.log("Error executing code", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Error executing code",
      );
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = () => {
    toast.success("TODO: Coming Soon🔥");
  };

  if (!problem) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="animate-spin size-5 text-amber-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl p-3 sm:p-6">
        {/* Header */}

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-4 flex min-w-0 flex-wrap items-center gap-2 sm:gap-4">
              <Link href="/">
                <Button
                  variant="outline"
                  size="icon"
                >
                  <ArrowLeft className="size-4" />
                </Button>
              </Link>

              <h1 className="min-w-0 break-words text-2xl font-bold sm:text-3xl">
                {problem?.title}
              </h1>

              <Badge
                className={cn(
                  "font-medium",
                  getDifficultyColor(
                    problem?.difficulty,
                  ),
                )}
              >
                {problem?.difficulty}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              {problem?.tags.map(
                (tag: string) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-sm"
                  >
                    {tag}
                  </Badge>
                ),
              )}
            </div>
          </div>

          <div className="self-end sm:self-auto">
            <ModeToggle />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Panel - Problem Description */}

          <div className="min-w-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />

                  Problem Description
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  <p className="text-foreground leading-relaxed">
                    <span className="break-words">{problem?.description}</span>
                  </p>

                  {/* Examples */}

                  <div>
                    <h3 className="font-semibold text-lg mb-3">
                      Example:
                    </h3>

                    {problem?.examples[
                      selectedLanguage
                    ] && (
                      <div className="bg-muted p-4 rounded-lg space-y-2">
                        <div>
                          <span className="font-medium text-amber-400">
                            Input:{" "}
                          </span>

                          <code className="break-words rounded bg-zinc-200 px-2 py-1 text-sm text-zinc-900 dark:bg-zinc-900 dark:text-zinc-200">
                            {
                              problem?.examples[
                                selectedLanguage
                              ].input
                            }
                          </code>
                        </div>

                        <div>
                          <span className="font-medium text-amber-400">
                            Output:{" "}
                          </span>

                          <code className="break-words rounded bg-zinc-200 px-2 py-1 text-sm text-zinc-900 dark:bg-zinc-900 dark:text-zinc-200">
                            {
                              problem?.examples[
                                selectedLanguage
                              ].output
                            }
                          </code>
                        </div>

                        <div>
                          <span className="font-medium">
                            Explanation:{" "}
                          </span>

                          <span className="text-sm">
                            {
                              problem?.examples[
                                selectedLanguage
                              ]?.explanation
                            }
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Constraints */}

                  <div>
                    <h3 className="font-semibold text-lg mb-3">
                      Constraints:
                    </h3>

                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {problem?.constraints}
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for Submissions, Editorial, Hints */}

            <Card>
              <CardContent className="p-3">
                <Tabs
                  defaultValue="submissions"
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger
                      value="submissions"
                      className="min-w-0 justify-center gap-1 px-1 text-[11px] leading-tight sm:gap-2 sm:px-2 sm:text-sm"
                    >
                      <Trophy className="hidden size-4 shrink-0 sm:block" />
                      Submissions
                    </TabsTrigger>

                    <TabsTrigger
                      value="editorial"
                      className="min-w-0 justify-center gap-1 px-1 text-[11px] leading-tight sm:gap-2 sm:px-2 sm:text-sm"
                    >
                      <FileText className="hidden size-4 shrink-0 sm:block" />
                      Editorial
                    </TabsTrigger>

                    <TabsTrigger
                      value="hints"
                      className="min-w-0 justify-center gap-1 px-1 text-[11px] leading-tight sm:gap-2 sm:px-2 sm:text-sm"
                    >
                      <Lightbulb className="hidden size-4 shrink-0 sm:block" />
                      Hints
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="submissions" className="p-3 sm:p-6">
                    {/* Submission history */}
                  </TabsContent>

                  <TabsContent value="editorial" className="p-3 sm:p-6">
                    <div className="text-center py-8 text-muted-foreground">
                      {problem.editorial
                        ? problem.editorial
                        : "Editorial not available yet."}
                    </div>
                  </TabsContent>

                  <TabsContent value="hints" className="p-3 sm:p-6">
                    <div className="text-center py-8 text-muted-foreground">
                      {problem.hints
                        ? problem.hints
                        : "No hints available for this problem."}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Code Editor and Test Cases */}

          <div className="min-w-0 space-y-6">
            {/* Code Editor */}

            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="flex min-w-0 items-center gap-2 text-base sm:text-lg">
                    <Code className="h-5 w-5" />

                    Code Editor
                  </CardTitle>

                  <Select
                    value={selectedLanguage}
                    onValueChange={(value) => {
                      if (value !== null) {
                        setSelectedLanguage(value);
                      }
                    }}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="JAVASCRIPT">
                        JavaScript
                      </SelectItem>

                      <SelectItem value="PYTHON">
                        Python
                      </SelectItem>

                      <SelectItem value="JAVA">
                        Java
                      </SelectItem>

                      {/* Added C */}

                      <SelectItem value="C">
                        C
                      </SelectItem>

                      {/* Added C++ */}

                      <SelectItem value="CPP">
                        C++
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>

              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Editor
                    height="400px"
                    language={
                      selectedLanguage.toLowerCase() ===
                      "javascript"
                        ? "javascript"
                        : selectedLanguage.toLowerCase() ===
                            "cpp"
                          ? "cpp"
                          : selectedLanguage.toLowerCase()
                    }
                    value={code}
                    onChange={(value) =>
                      setCode(value || "")
                    }
                    theme={
                      theme === "dark"
                        ? "vs-dark"
                        : "light"
                    }
                    options={{
                      minimap: {
                        enabled: false,
                      },
                      fontSize: 16,
                      lineNumbers: "on",
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      wordWrap: "on",
                    }}
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    onClick={handleRun}
                    disabled={isRunning}
                    variant="outline"
                    className="min-h-11 flex-1 items-center gap-2 sm:flex-none"
                  >
                    <Play className="h-4 w-4" />

                    {isRunning
                      ? "Running..."
                      : "Run"}
                  </Button>

                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="min-h-11 flex-1 items-center gap-2 sm:flex-none"
                  >
                    <Send className="h-4 w-4" />

                    {isSubmitting
                      ? "Submitting..."
                      : "Submit"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Test Cases */}

            <Card>
              <CardHeader>
                <CardTitle>Test Cases</CardTitle>

                <CardDescription>
                  Run your code against these test cases
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-4">
                    {problem.testCases.map(
                      (
                        testCase: any,
                        index: number,
                      ) => (
                        <div
                          key={index}
                          className="border rounded-lg p-3"
                        >
                          <div className="text-sm font-medium mb-2">
                            Test Case{" "}
                            {index + 1}
                          </div>

                          <div className="space-y-1 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                Input:{" "}
                              </span>

                              <code className="bg-muted px-2 py-1 rounded text-xs">
                                {testCase.input}
                              </code>
                            </div>

                            <div>
                              <span className="text-muted-foreground">
                                Expected:{" "}
                              </span>

                              <code className="bg-muted px-2 py-1 rounded text-xs">
                                {testCase.output}
                              </code>
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Test Results and Submission Details */}

            {executionResponse &&
              executionResponse.submission && (
                <div className="space-y-4 mt-4">
                  <SubmissionDetails
                    submission={
                      executionResponse.submission
                    }
                  />

                  <TestCaseTable
                    testCases={
                      executionResponse.submission
                        .testCases
                    }
                  />
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemIdPage;

