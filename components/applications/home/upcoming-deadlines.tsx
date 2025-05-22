"use client";

import { AlertTriangle, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BadgeVariant } from "@/types/components/applications/home/upcoming-deadlines";

export function UpcomingDeadlines() {
  const deadlines = [
    {
      id: "1",
      applicantName: "John Doe",
      applicationId: "CM01JY",
      dueDate: "2024-03-25",
      assigineeName: "Simran Khanduja",
      priority: "high",
    },
    {
      id: "2",
      applicantName: "Jane Smith",
      applicationId: "CP01JY",
      dueDate: "2024-03-26",
      assigineeName: "Simran Khanduja",
      priority: "medium",
    },
    {
      id: "3",
      applicantName: "Mike Johnson",
      applicationId: "CM01JY",
      dueDate: "2024-03-27",
      assigineeName: "Vritika Rao",
      priority: "low",
    },
  ];

  const getPriorityColor = (priority: string): BadgeVariant => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <CardTitle>Upcoming Deadlines</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {deadlines.map((deadline) => (
          <div key={deadline.id} className="space-y-1 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{deadline.applicantName}</p>
                  <Badge variant={getPriorityColor(deadline.priority)}>
                    {deadline.priority}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  Due: {new Date(deadline.dueDate).toLocaleDateString()}
                </div>
              </div>
              <Button variant="outline" size="sm">
                Review Now
              </Button>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                Cohort ID: {deadline.applicationId}
              </p>
              <div className="text-sm text-muted-foreground">
                Assigned to {deadline.assigineeName}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
