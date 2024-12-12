"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PlayCircle, 
  Calendar, 
  MessageSquare, 
  FileText 
} from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      icon: PlayCircle,
      label: "Start Next Interview",
      description: "Begin your next scheduled interview",
      variant: "default" as const,
    },
    {
      icon: Calendar,
      label: "View Full Schedule",
      description: "See your complete interview calendar",
      variant: "outline" as const,
    },
    {
      icon: MessageSquare,
      label: "Access Communication",
      description: "Send messages to applicants",
      variant: "outline" as const,
    },
    {
      icon: FileText,
      label: "Pending Feedback",
      description: "Complete feedback for past interviews",
      variant: "outline" as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant}
            className="h-auto flex-col items-start p-4 space-y-2"
          >
            <div className="flex items-center">
              <action.icon className="h-5 w-5 mr-2" />
              {action.label}
            </div>
            <span className="text-xs text-left text-muted-foreground">
              {action.description}
            </span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}