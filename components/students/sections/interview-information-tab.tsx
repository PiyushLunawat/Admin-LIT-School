"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Download, MessageSquare } from "lucide-react";

interface InterviewInformationTabProps {
  studentId: string;
}

export function InterviewInformationTab({ studentId }: InterviewInformationTabProps) {
  // In a real application, this data would be fetched based on the studentId
  const interview = {
    status: "Scheduled",
    date: "2024-03-25",
    time: "10:30 AM",
    interviewer: "Sarah Admin",
    location: "Online (Zoom)",
    feedback: {
      communication: 8,
      technicalSkills: 7,
      creativity: 9,
      overallRating: "Strong Candidate",
      notes: "Demonstrated excellent communication skills and creative thinking.",
    },
    documents: [
      { name: "Interview Notes", type: "PDF", size: "245 KB" },
      { name: "Evaluation Form", type: "PDF", size: "180 KB" },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Interview Details */}
      <Card>
        <CardHeader>
          <CardTitle>Interview Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className="mt-1">{interview.status}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Interviewer</p>
              <p className="font-medium">{interview.interviewer}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date & Time</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{interview.date} at {interview.time}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{interview.location}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback & Evaluation */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback & Evaluation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Communication</p>
              <p className="font-medium">{interview.feedback.communication}/10</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Technical Skills</p>
              <p className="font-medium">{interview.feedback.technicalSkills}/10</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Creativity</p>
              <p className="font-medium">{interview.feedback.creativity}/10</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overall Rating</p>
              <Badge variant="secondary">{interview.feedback.overallRating}</Badge>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Notes</p>
            <p>{interview.feedback.notes}</p>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Interview Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {interview.documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {doc.type} • {doc.size}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
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
              <Calendar className="h-4 w-4 mr-2" />
              Reschedule Interview
            </Button>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Feedback
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export All Documents
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}