"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, Clock, XCircle } from "lucide-react";

export function RecentActivity() {
  const activities = [
    {
      id: "1",
      type: "Review Completed",
      description: "Completed review for John Doe's application",
      timestamp: "10 minutes ago",
      status: "completed",
    },
    {
      id: "2",
      type: "New Assignment",
      description: "3 new applications assigned to you",
      timestamp: "1 hour ago",
      status: "pending",
    },
    {
      id: "3",
      type: "Information Requested",
      description: "Requested additional documents from Sarah Smith",
      timestamp: "2 hours ago",
      status: "action-needed",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "pending":
        return <Clock className="h-4 w-4 text-warning" />;
      case "action-needed":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 border-b pb-4 last:border-0"
              >
                <div className="mt-1">{getStatusIcon(activity.status)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{activity.type}</p>
                    <span className="text-xs text-muted-foreground">
                      {activity.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}