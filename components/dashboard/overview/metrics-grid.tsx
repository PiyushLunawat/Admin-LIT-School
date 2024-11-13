"use client";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  ClipboardList,
  Calendar,
  GraduationCap,
  Award,
  Building2,
  IndianRupee,
  AlertTriangle,
  UserMinus,
  CheckCircle,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function MetricCard({ title, value, description, icon: Icon, trend }: MetricCardProps) {
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
        {trend && (
          <p className={`text-xs mt-1 ${trend.isPositive ? 'text-success' : 'text-destructive'}`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function MetricsGrid() {
  const metrics = [
    {
      title: "Total Applications",
      value: "156",
      description: "45 new this month",
      icon: ClipboardList,
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Under Review",
      value: "23",
      description: "8 pending feedback",
      icon: CheckCircle,
    },
    {
      title: "Interviews Scheduled",
      value: "18",
      description: "This week",
      icon: Calendar,
    },
    {
      title: "LITMUS Tests",
      value: "45",
      description: "32 evaluated",
      icon: GraduationCap,
    },
    {
      title: "Scholarships",
      value: "12",
      description: "₹2.98L awarded",
      icon: Award,
    },
    {
      title: "Active Cohorts",
      value: "8",
      description: "3 starting soon",
      icon: Building2,
    },
    {
      title: "Revenue Collected",
      value: "₹24.5L",
      description: "This month",
      icon: IndianRupee,
      trend: { value: 8, isPositive: true },
    },
    {
      title: "Outstanding",
      value: "₹12.4L",
      description: "15 payments pending",
      icon: AlertTriangle,
    },
    {
      title: "Dropped Students",
      value: "3",
      description: "This month",
      icon: UserMinus,
      trend: { value: 2, isPositive: false },
    },
    {
      title: "Total Students",
      value: "2,340",
      description: "Active enrollments",
      icon: Users,
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
          trend={metric.trend}
        />
      ))}
    </div>
  );
}