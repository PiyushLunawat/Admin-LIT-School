"use client";

import {
  Calendar,
  Clock,
  CreditCard,
  GraduationCap,
  UserMinus,
  UserPlus,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  RecentActivityProps,
} from "@/types/components/cohorts/dashboard/tabs/overview/recent-activity";

export function RecentActivity({ applications }: RecentActivityProps) {
  const activities: Activity[] = [
    {
      id: "1",
      type: "application",
      description: "New application received from John Doe",
      timestamp: "2 minutes ago",
    },
    {
      id: "2",
      type: "interview",
      description: "Interview completed with Sarah Smith",
      timestamp: "1 hour ago",
    },
    {
      id: "3",
      type: "litmus",
      description: "LITMUS test submitted by Mike Johnson",
      timestamp: "3 hours ago",
    },
    {
      id: "4",
      type: "payment",
      description: "Admission fee received from Emily Brown",
      timestamp: "5 hours ago",
    },
    {
      id: "5",
      type: "dropped",
      description: "Alex Wilson marked as dropped",
      timestamp: "1 day ago",
    },
  ];

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "application":
        return <UserPlus className="h-4 w-4" />;
      case "interview":
        return <Calendar className="h-4 w-4" />;
      case "litmus":
        return <GraduationCap className="h-4 w-4" />;
      case "payment":
        return <CreditCard className="h-4 w-4" />;
      case "dropped":
        return <UserMinus className="h-4 w-4" />;
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
                <div className="rounded-full bg-muted p-2">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">{activity.description}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {activity.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
