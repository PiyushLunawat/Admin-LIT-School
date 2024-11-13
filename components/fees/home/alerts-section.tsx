"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock } from "lucide-react";

type BadgeVariant = "destructive" | "warning" | "secondary" | "success" | "default";

export function AlertsSection() {
  const alerts = [
    {
      id: "1",
      type: "Payment Overdue",
      message: "3 students have payments overdue by more than 7 days",
      priority: "high",
      action: "View Details",
    },
    {
      id: "2",
      type: "Drop Risk",
      message: "2 students at risk of being dropped due to non-payment",
      priority: "high",
      action: "Review",
    },
    {
      id: "3",
      type: "Payment Discrepancy",
      message: "Payment amount mismatch detected for recent transaction",
      priority: "medium",
      action: "Investigate",
    },
  ];

  const getPriorityColor = (priority: string): BadgeVariant => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-2">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <CardTitle>Alerts & Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start justify-between space-x-4 border rounded-lg p-4"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Badge variant={getPriorityColor(alert.priority)}>
                  {alert.type}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 inline mr-1" />
                  Now
                </span>
              </div>
              <p className="text-sm">{alert.message}</p>
            </div>
            <Button size="sm" variant="outline">
              {alert.action}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}