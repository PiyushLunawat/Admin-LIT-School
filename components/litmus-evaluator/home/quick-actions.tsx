"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PlayCircle, 
  ClipboardList, 
  MessageSquare, 
  Award 
} from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      icon: PlayCircle,
      label: "Start Next Evaluation",
      description: "Begin evaluating the next submission",
      variant: "default" as const,
    },
    {
      icon: ClipboardList,
      label: "View Pending",
      description: "See submissions awaiting evaluation",
      variant: "outline" as const,
    },
    {
      icon: MessageSquare,
      label: "Communications",
      description: "Access applicant messages",
      variant: "outline" as const,
    },
    {
      icon: Award,
      label: "Scholarship Review",
      description: "Review and award scholarships",
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