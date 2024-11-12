"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, AlertTriangle } from "lucide-react";

export function UpcomingDeadlines() {
  const deadlines = [
    {
      id: "1",
      studentName: "John Doe",
      amount: "₹1,65,833",
      dueDate: "2024-03-25",
      priority: "high",
      installment: "2nd Installment",
    },
    {
      id: "2",
      studentName: "Jane Smith",
      amount: "₹1,65,833",
      dueDate: "2024-03-26",
      priority: "medium",
      installment: "3rd Installment",
    },
    {
      id: "3",
      studentName: "Mike Johnson",
      amount: "₹1,65,833",
      dueDate: "2024-03-27",
      priority: "low",
      installment: "1st Installment",
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
                <p className="font-medium">{deadline.studentName}</p>
                <Badge variant={getPriorityColor(deadline.priority)}>
                  {deadline.priority}
                </Badge>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                Due: {new Date(deadline.dueDate).toLocaleDateString()}
              </div>
              <p className="text-sm text-muted-foreground">
                {deadline.installment} • {deadline.amount}
              </p>
            </div>
            <Button variant="outline" size="sm">
              Send Reminder
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}