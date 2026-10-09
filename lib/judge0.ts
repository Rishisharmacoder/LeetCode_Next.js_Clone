import axios from "axios";

type Judge0Submission = {
  source_code: string;
  language_id: number;
  stdin: string;
  expected_output: string;
};

export type Judge0Result = {
  token: string;
  status: { id: number };
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
};

export function getJudge0LanguageId(language: string): number | undefined {
  const languageMap: Record<string, number> = {
    PYTHON: 71,
    JAVASCRIPT: 63,
    JAVA: 62,
    C: 50,
    CPP: 54,
    GO: 60,
  };
  return languageMap[language.toUpperCase()];
}

export async function submitBatch(
  submissions: Judge0Submission[],
): Promise<Judge0Result[]> {
  const { data } = await axios.post(
    `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
    { submissions },
  );
  console.log("Batch submission response:", data);
  return data;
}

// Poll all tokens until they are done
export async function pollBatchResults(
  tokens: string[],
): Promise<Judge0Result[]> {
  while (true) {
    const { data } = await axios.get(
      `${process.env.JUDGE0_API_URL}/submissions/batch`,
      {
        params: {
          tokens: tokens.join(","),
          base64_encoded: false,
        },
      },
    );

    console.log(data);
    const results = data.submissions;

    const isAllDone = results.every(
      (r) => r.status.id !== 1 && r.status.id !== 2,
    );
    if (isAllDone) return results;

    await sleep(1000);
  }
}

function sleep(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
