"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, AlertTriangle } from "lucide-react";

export function UpcomingDeadlines() {
  const deadlines = [
    {
      id: "1",
      applicantName: "John Doe",
      applicationId: "APP001",
      dueDate: "2024-03-25",
      priority: "high",
    },
    {
      id: "2",
      applicantName: "Jane Smith",
      applicationId: "APP002",
      dueDate: "2024-03-26",
      priority: "medium",
    },
    {
      id: "3",
      applicantName: "Mike Johnson",
      applicationId: "APP003",
      dueDate: "2024-03-27",
      priority: "low",
    },
  ];

  const getPriorityColor = (priority: string): string => {
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
          <div
            key={deadline.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
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
              <p className="text-sm text-muted-foreground">
                ID: {deadline.applicationId}
              </p>
            </div>
            <Button variant="outline" size="sm">
              Review Now
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}