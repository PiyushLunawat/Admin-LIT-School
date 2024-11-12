"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CreditCard,
  AlertTriangle,
  Clock,
  UserMinus,
  IndianRupee,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ElementType;
}

function MetricCard({ title, value, description, icon: Icon }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function MetricsGrid() {
  const metrics = [
    {
      title: "Today's Collections",
      value: "₹4,95,000",
      description: "5 payments received",
      icon: IndianRupee,
    },
    {
      title: "Outstanding Amount",
      value: "₹12,45,000",
      description: "15 students pending",
      icon: CreditCard,
    },
    {
      title: "Overdue Payments",
      value: "₹3,25,000",
      description: "8 payments overdue",
      icon: AlertTriangle,
    },
    {
      title: "This Week",
      value: "₹15,75,000",
      description: "25 payments processed",
      icon: Clock,
    },
    {
      title: "Dropped Students",
      value: "3",
      description: "Due to non-payment",
      icon: UserMinus,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          description={metric.description}
          icon={metric.icon}
        />
      ))}
    </div>
  );
}