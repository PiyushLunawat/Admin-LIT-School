"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  AlertTriangle, 
  MessageSquare, 
  Download 
} from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      icon: CreditCard,
      label: "Process Payment",
      description: "Record a new payment",
      variant: "default" as const,
    },
    {
      icon: AlertTriangle,
      label: "View Overdue",
      description: "Check overdue payments",
      variant: "outline" as const,
    },
    {
      icon: MessageSquare,
      label: "Send Reminders",
      description: "Payment reminder messages",
      variant: "outline" as const,
    },
    {
      icon: Download,
      label: "Export Report",
      description: "Download collection report",
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