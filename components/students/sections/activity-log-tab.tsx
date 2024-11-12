"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  UserPlus,
  Calendar,
  GraduationCap,
  CreditCard,
  MessageSquare,
  Clock,
} from "lucide-react";

interface ActivityLogTabProps {
  studentId: string;
}

export function ActivityLogTab({ studentId }: ActivityLogTabProps) {
  // In a real application, this data would be fetched based on the studentId
  const activities = [
    {
      id: "1",
      type: "application",
      description: "Application submitted",
      timestamp: "2024-03-15 10:30 AM",
      actor: "System",
    },
    {
      id: "2",
      type: "interview",
      description: "Interview scheduled for March 20th",
      timestamp: "2024-03-16 02:15 PM",
      actor: "Sarah Admin",
    },
    {
      id: "3",
      type: "litmus",
      description: "LITMUS test submission received",
      timestamp: "2024-03-17 11:45 AM",
      actor: "System",
    },
    {
      id: "4",
      type: "payment",
      description: "Token fee payment received",
      timestamp: "2024-03-18 03:30 PM",
      actor: "Finance Team",
    },
    {
      id: "5",
      type: "communication",
      description: "Email sent: Interview confirmation",
      timestamp: "2024-03-19 09:15 AM",
      actor: "System",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "application":
        return <UserPlus className="h-4 w-4" />;
      case "interview":
        return <Calendar className="h-4 w-4" />;
      case "litmus":
        return <GraduationCap className="h-4 w-4" />;
      case "payment":
        return <CreditCard className="h-4 w-4" />;
      case "communication":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-8">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="relative pl-8 pb-8 last:pb-0"
              >
                <div className="absolute left-0 top-0">
                  <div className="bg-muted w-8 h-8 rounded-full flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                  {/* Vertical line */}
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-full bg-muted" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="capitalize">
                      {activity.type}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {activity.timestamp}
                    </div>
                  </div>
                  <p>{activity.description}</p>
                  <p className="text-sm text-muted-foreground">
                    By: {activity.actor}
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