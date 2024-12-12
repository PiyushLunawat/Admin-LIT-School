"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CreditCard, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  UserMinus,
} from "lucide-react";

export function RecentActivity() {
  const activities = [
    {
      id: "1",
      type: "payment_received",
      description: "Payment received from John Doe",
      amount: "₹1,65,833",
      timestamp: "10 minutes ago",
      status: "completed",
    },
    {
      id: "2",
      type: "payment_overdue",
      description: "Payment overdue for Jane Smith",
      amount: "₹1,65,833",
      timestamp: "1 hour ago",
      status: "overdue",
    },
    {
      id: "3",
      type: "student_dropped",
      description: "Mike Johnson marked as dropped",
      timestamp: "2 hours ago",
      status: "dropped",
    },
    {
      id: "4",
      type: "reminder_sent",
      description: "Payment reminder sent to Emily Brown",
      amount: "₹1,65,833",
      timestamp: "3 hours ago",
      status: "pending",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "payment_received":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "payment_overdue":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "student_dropped":
        return <UserMinus className="h-4 w-4 text-destructive" />;
      case "reminder_sent":
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      case "dropped":
        return <Badge variant="destructive">Dropped</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
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
                <div className="mt-1">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium">{activity.description}</p>
                    {getStatusBadge(activity.status)}
                  </div>
                  {activity.amount && (
                    <p className="text-sm font-medium">{activity.amount}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {activity.timestamp}
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