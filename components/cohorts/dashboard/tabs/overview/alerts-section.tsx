"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle,
  Calendar,
  GraduationCap,
  CreditCard
} from "lucide-react";

type BadgeVariant = "destructive" | "warning" | "secondary" | "success" | "default";
interface Alert {
  id: string;
  type: 'interview' | 'evaluation' | 'payment';
  message: string;
  priority: 'high' | 'medium' | 'low';
}

interface AlertsSectionProps {
  cohortId: string;
}

export function AlertsSection({ cohortId }: AlertsSectionProps) {
  // In a real application, this data would be fetched based on the cohortId
  const alerts: Alert[] = [
    {
      id: "1",
      type: "interview",
      message: "5 interviews scheduled for tomorrow",
      priority: "high"
    },
    {
      id: "2",
      type: "evaluation",
      message: "8 LITMUS tests pending evaluation",
      priority: "medium"
    },
    {
      id: "3",
      type: "payment",
      message: "3 payment deadlines approaching",
      priority: "high"
    }
  ];

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'interview':
        return <Calendar className="h-4 w-4" />;
      case 'evaluation':
        return <GraduationCap className="h-4 w-4" />;
      case 'payment':
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: Alert['priority']): BadgeVariant => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      case 'low':
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <CardTitle>Alerts & Notifications</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start space-x-4 border-b pb-4 last:border-0"
              >
                <div className="rounded-full bg-muted p-2">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <Badge variant={getPriorityColor(alert.priority)}>
                      {alert.priority}
                    </Badge>
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