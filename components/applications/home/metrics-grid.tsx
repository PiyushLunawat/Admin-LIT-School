"use client";

import { getStudents } from "@/app/api/student";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Clock, CheckCircle, AlertTriangle, RotateCcw, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

interface MetricCardProps {
  title: string;
  value: number;
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
  applications: any;
}

export function MetricsGrid({ applications }: MetricsGridProps) {

    const [totalApplicationsCount, setTotalApplicationsCount] = useState(0);
    const [underReviewCount, setUnderReviewCount] = useState(0);
    const [ReviewTodayCount, setReviewTodayCount] = useState(0);
    const [revisedApplicationsCount, setRevisedApplicationsCount] = useState(0);

    useEffect(() => {
      if (applications && Array.isArray(applications)) {
        // Total Applications
        setTotalApplicationsCount(applications.length);
  
        // Under Review Count
        const underReview = applications.filter(
          (application) =>
            application?.appliedCohorts?.[application?.appliedCohorts.length - 1]?.applicationDetails?.applicationStatus?.toLowerCase() ===
            "under review"
        );
        setUnderReviewCount(underReview.length);
  
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
            ['on hold', 'accepted', 'rejected'].includes(application?.appliedCohorts?.[application?.appliedCohorts.length - 1]?.applicationDetails?.applicationStatus) &&
          new Date(application?.appliedCohorts?.[application?.appliedCohorts.length - 1]?.applicationDetails?.updatedAt).toDateString() === new Date().toDateString()
        );
        setReviewTodayCount(reviewed.length);

        const revised = applications.filter(
          (application) =>
            application?.appliedCohorts?.[application?.appliedCohorts.length - 1]?.applicationDetails?.applicationStatus?.toLowerCase() === "under review" &&
            application?.appliedCohorts?.[application?.appliedCohorts.length - 1]?.applicationDetails?.applicationTasks?.length > 1
        );
        setRevisedApplicationsCount(underReview.length);

      } else {
        console.log("Applications data is not an array or is undefined.");
      }
    }, [applications]);
  
  const metrics = [
    {
      title: "Total Applications",
      value: totalApplicationsCount,
      description: "in Ongoing Cohorts",
      icon: ClipboardList,
    },
    {
      title: "Pending Review",
      value: underReviewCount,
      description: "Awaiting Your Evaluation",
      icon: Clock,
    },
    {
      title: "Reviewed Today",
      value: ReviewTodayCount,
      description: "Applications processed",
      icon: Calendar,
    },
    {
      title: "Revised Applications",
      value: revisedApplicationsCount,
      description: "in Ongoing Cohorts",
      icon: RotateCcw,
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