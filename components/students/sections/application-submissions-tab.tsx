"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Eye, MessageSquare } from "lucide-react";

interface ApplicationSubmissionsTabProps {
  studentId: string;
}

export function ApplicationSubmissionsTab({ studentId }: ApplicationSubmissionsTabProps) {
  // In a real application, this data would be fetched based on the studentId
  const application = {
    tasks: [
      {
        title: "Share an Embarrassing Story",
        type: "Long Text",
        submissionDate: "2024-03-15",
        response: "Lorem ipsum dolor sit amet...",
        reviewerScore: 8,
        reviewerComment: "Great storytelling ability",
      },
      {
        title: "Portfolio Submission",
        type: "File",
        submissionDate: "2024-03-15",
        files: [
          { name: "portfolio.pdf", size: "2.5 MB" },
          { name: "work-samples.zip", size: "15 MB" },
        ],
        reviewerScore: 9,
        reviewerComment: "Impressive body of work",
      },
    ],
    timeline: [
      {
        date: "2024-03-15",
        event: "Application Submitted",
        details: "All required documents uploaded",
      },
      {
        date: "2024-03-16",
        event: "Under Review",
        details: "Application assigned to Sarah Admin",
      },
      {
        date: "2024-03-17",
        event: "Review Completed",
        details: "Application marked for interview",
      },
    ],
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        {/* Application Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Application Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {application.tasks.map((task, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Submitted on {new Date(task.submissionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary">{task.type}</Badge>
                </div>

                {task.type === "Long Text" && (
                  <p className="text-sm">{task.response}</p>
                )}

                {task.type === "File" && (
                  <div className="space-y-2">
                    {task.files?.map((file, fileIndex) => (
                      <div
                        key={fileIndex}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">{file.size}</p>
                        </div>
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
                    ))}
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Reviewer Feedback</p>
                      <p className="text-sm">{task.reviewerComment}</p>
                    </div>
                    <Badge variant="outline">Score: {task.reviewerScore}/10</Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {/* Application Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Application Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {application.timeline.map((event, index) => (
                  <div
                    key={index}
                    className="flex gap-4 pb-4 border-l pl-4 relative last:pb-0"
                  >
                    <div
                      className="absolute w-3 h-3 bg-primary rounded-full -left-[6px]"
                      style={{ top: "0" }}
                    />
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className="font-medium">{event.event}</p>
                      <p className="text-sm">{event.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View Full Application
              </Button>
              <Button className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download All Files
              </Button>
              <Button className="w-full" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Add Reviewer Comment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
