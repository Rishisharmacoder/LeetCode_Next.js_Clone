import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CpuIcon,
  Code,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface Submission {
  status: string;
  memory?: string | null;
  time?: string | null;
  createdAt: string | Date;
  language: string;
}

interface SubmissionDetailsProps {
  submission: Submission;
}

export const SubmissionDetails = ({
  submission,
}: SubmissionDetailsProps) => {
  const isSuccess = submission.status === "Accepted";

  const averageMemory = submission.memory
    ? JSON.parse(submission.memory).reduce(
        (a: number, b: string | number) =>
          a + parseFloat(String(b)),
        0
      ) / JSON.parse(submission.memory).length
    : 0;

  const averageTime = submission.time
    ? JSON.parse(submission.time)
        .map((t: string | number) =>
          parseFloat(String(t).replace(" s", ""))
        )
        .reduce((a: number, b: number) => a + b, 0) /
      JSON.parse(submission.time).length
    : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Submission Details</CardTitle>

          {isSuccess ? (
            <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Success
            </Badge>
          ) : (
            <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
              <XCircle className="mr-1 h-3 w-3" />
              Failed
            </Badge>
          )}
        </div>

        <CardDescription>
          Submitted at{" "}
          {new Date(submission.createdAt).toLocaleString()}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Language */}
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-sm font-medium">Language</p>
              <p className="text-sm text-muted-foreground">
                {submission.language}
              </p>
            </div>
          </div>

          {/* Memory */}
          <div className="flex items-center gap-2">
            <CpuIcon className="h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-sm font-medium">Memory (avg)</p>
              <p className="text-sm text-muted-foreground">
                {averageMemory.toFixed(2)} KB
              </p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-sm font-medium">Time (avg)</p>
              <p className="text-sm text-muted-foreground">
                {averageTime.toFixed(3)} s
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};