"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ClipboardList,
  Clock,
  Calendar,
  CheckCircle,
  Award
} from "lucide-react";
import { useEffect, useState } from "react";

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

interface MetricGridProps {
  applications: any;
}

export function MetricsGrid({ applications }: MetricGridProps) {

  const [totalAssignedCount, setTotalAssignedCount] = useState(0);
  const [underReviewCount, setUnderReviewCount] = useState(0);
  const [ReviewCount, setReviewCount] = useState(0);
  const [revisedApplicationsCount, setRevisedApplicationsCount] = useState(0);

  useEffect(() => {
    if (applications && Array.isArray(applications)) {

      // Assigned Count
      const assigned = applications.filter(
        (application) =>
          application?.appliedCohorts?.[application?.appliedCohorts.length - 1]?.litmusTestDetails?.status?.toLowerCase() === "Interview Scheduled" ||
        application?.appliedCohorts?.[application?.appliedCohorts.length - 1]?.litmusTestDetails?.status?.toLowerCase() === "submitted" 
      );
      setTotalAssignedCount(assigned.length);

      // Interviews Scheduled Count
      // const interviewsScheduled = applications.filter(
      //   (application) =>
      //     application?.applicationDetails?.applicationStatus?.toLowerCase() ===
      //     "interviews scheduled"
      // );
      // setInterviewsScheduledCount(interviewsScheduled.length);

      // Reviewed Count
      const reviewed = applications.filter(
        (application) =>
          application?.appliedCohorts?.[application?.appliedCohorts.length - 1]?.litmusTestDetails?.status?.toLowerCase() === "completed" 
      );
      setReviewCount(reviewed.length);

      const revised = applications.filter(
        (application) =>
          application?.appliedCohorts?.[application?.appliedCohorts.length - 1]?.applicationDetails?.applicationStatus?.toLowerCase() === "under review" &&
          application?.appliedCohorts?.[application?.appliedCohorts.length - 1]?.applicationDetails?.applicationTasks?.length > 1
      );
      setRevisedApplicationsCount(reviewed.length);

    } else {
      console.log("Applications data is not an array or is undefined.");
    }
  }, [applications]);
      
  const metrics = [
    {
      title: "Total Assigned",
      value: `${totalAssignedCount}`,
      description: "Submissions in your queue",
      icon: ClipboardList,
    },
    {
      title: "Pending Evaluation",
      value: "23",
      description: "Awaiting your review",
      icon: Clock,
    },
    {
      title: "Today's Presentations",
      value: "5",
      description: "Scheduled presentations",
      icon: Calendar,
    },
    {
      title: "Completed This Week",
      value: `${ReviewCount}`,
      description: "Evaluations processed",
      icon: CheckCircle,
    },
    {
      title: "Scholarships Awarded",
      value: `${ReviewCount}`,
      description: "This month",
      icon: Award,
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