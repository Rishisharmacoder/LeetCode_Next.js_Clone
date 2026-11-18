import "server-only";

import axios from "axios";

type Judge0Submission = {
  source_code: string;
  language_id: number;
  stdin: string;
  expected_output?: string;
};

export type Judge0Result = {
  token: string;
  status: { id: number; description?: string };
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  memory?: number | string | null;
  time?: number | string | null;
};

function getExecutionConfig() {
  const configuredProvider =
    process.env.CODE_EXECUTION_PROVIDER?.trim().toLowerCase();
  const onlineCompilerApiKey =
    process.env.ONLINECOMPILER_API_KEY?.trim();
  const provider =
    configuredProvider ||
    (onlineCompilerApiKey ? "onlinecompiler" : "judge0");

  if (provider === "onlinecompiler") {
    if (!onlineCompilerApiKey) {
      throw new Error(
        "ONLINECOMPILER_API_KEY is required when CODE_EXECUTION_PROVIDER is onlinecompiler",
      );
    }

    return {
      baseUrl: "https://api.onlinecompiler.io/api/judge0",
      headers: { "X-Auth-Token": onlineCompilerApiKey },
    };
  }

  if (provider === "judge0") {
    const baseUrl = process.env.JUDGE0_API_URL?.replace(/\/+$/, "");
    if (!baseUrl) {
      throw new Error("JUDGE0_API_URL is required when using Judge0");
    }

    return { baseUrl, headers: undefined };
  }

  throw new Error(
    `Unsupported CODE_EXECUTION_PROVIDER: ${configuredProvider}`,
  );
}

export async function submitBatch(
  submissions: Judge0Submission[],
): Promise<Judge0Result[]> {
  const { baseUrl, headers } = getExecutionConfig();
  const { data } = await axios.post<Judge0Result[]>(
    `${baseUrl}/submissions/batch?base64_encoded=false`,
    { submissions },
    { headers },
  );
  return data;
}

// Poll all tokens until they are done
export async function pollBatchResults(
  tokens: string[],
): Promise<Judge0Result[]> {
  const { baseUrl, headers } = getExecutionConfig();

  while (true) {
    const { data } = await axios.get<{
      submissions: Judge0Result[];
    }>(
      `${baseUrl}/submissions/batch`,
      {
        params: {
          tokens: tokens.join(","),
          base64_encoded: false,
        },
        headers,
      },
    );

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
