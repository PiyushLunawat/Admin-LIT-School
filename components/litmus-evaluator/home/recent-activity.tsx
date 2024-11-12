"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, Clock, Award } from "lucide-react";

export function RecentActivity() {
  const activities = [
    {
      id: "1",
      type: "Evaluation Completed",
      description: "Completed evaluation for John Doe's submission",
      timestamp: "10 minutes ago",
      status: "completed",
    },
    {
      id: "2",
      type: "Scholarship Awarded",
      description: "Awarded Smart Mouth (5%) to Sarah Smith",
      timestamp: "1 hour ago",
      status: "awarded",
    },
    {
      id: "3",
      type: "Presentation Conducted",
      description: "Conducted LITMUS presentation for Mike Johnson",
      timestamp: "2 hours ago",
      status: "completed",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "awarded":
        return <Award className="h-4 w-4 text-primary" />;
      case "pending":
        return <Clock className="h-4 w-4 text-warning" />;
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