"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye, MessageSquare } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface LitmusTestDetailsTabProps {
  studentId: string;
}

export function LitmusTestDetailsTab({ studentId }: LitmusTestDetailsTabProps) {
  // In a real application, this data would be fetched based on the studentId
  const litmusTest = {
    status: "Evaluated",
    submissionDate: "2024-03-15",
    evaluator: "Tom Evaluator",
    tasks: [
      {
        title: "Create a pitch deck",
        type: "File",
        submission: "pitch-deck.pdf",
        score: 85,
        feedback: "Strong presentation with clear value proposition.",
      },
      {
        title: "Market Analysis",
        type: "Document",
        submission: "market-analysis.docx",
        score: 90,
        feedback: "Excellent research and insights.",
      },
    ],
    overallScore: 87,
    scholarshipAwarded: "Smart Mouth (5%)",
    evaluatorNotes: "Demonstrated strong potential and creative thinking.",
  };

  return (
    <div className="space-y-6">
      {/* Test Overview */}
      <Card>
        <CardHeader>
          <CardTitle>LITMUS Test Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className="mt-1">{litmusTest.status}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Submission Date</p>
              <p className="font-medium">
                {new Date(litmusTest.submissionDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Evaluator</p>
              <p className="font-medium">{litmusTest.evaluator}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Scholarship Awarded</p>
              <Badge variant="secondary">{litmusTest.scholarshipAwarded}</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Score</span>
              <span>{litmusTest.overallScore}%</span>
            </div>
            <Progress value={litmusTest.overallScore} />
          </div>
        </CardContent>
      </Card>

      {/* Task Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>Task Submissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {litmusTest.tasks.map((task, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-muted-foreground">{task.type}</p>
                </div>
                <Badge variant="secondary">{task.score}%</Badge>
              </div>
              <div className="flex items-center justify-between border rounded p-2">
                <span className="text-sm">{task.submission}</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Feedback</p>
                <p className="mt-1">{task.feedback}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Evaluator Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Evaluator Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{litmusTest.evaluatorNotes}</p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download All Submissions
            </Button>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}