"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  ClipboardList,
  Calendar,
  GraduationCap,
  Award,
  CreditCard,
  AlertTriangle,
  UserMinus
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
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface MetricsGridProps {
  cohortId: string;
}

export function MetricsGrid({ cohortId }: MetricsGridProps) {
  // In a real application, this data would be fetched based on the cohortId
  const metrics = [
    {
      title: "Total Applications",
      value: "156",
      icon: ClipboardList,
    },
    {
      title: "Under Review",
      value: "23",
      icon: Users,
    },
    {
      title: "Interviews Scheduled",
      value: "18",
      icon: Calendar,
    },
    {
      title: "LITMUS Tests",
      value: "45",
      description: "Submitted",
      icon: GraduationCap,
    },
    {
      title: "Avg. Scholarships",
      value: "12%",
      description: "₹5L Scholarship distributed",
      icon: Award,
    },
    {
      title: "Payments",
      value: "₹24.5L",
      description: "₹5L Token Amount Collected",
      icon: CreditCard,
    },
    {
      title: "Pending Actions",
      value: "8",
      description: "Requires Attention",
      icon: AlertTriangle,
    },
    {
      title: "Dropped",
      value: "3",
      description: "Students",
      icon: UserMinus,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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