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

interface MetricsGridProps {
  applications: any[];
}

export function MetricsGrid({ applications }: MetricsGridProps) {
  const [totalApplicationsCount, setTotalApplicationsCount] = useState(0);
  const [underReviewCount, setUnderReviewCount] = useState(0);
  const [interviewsScheduledCount, setInterviewsScheduledCount] = useState(0);
  const [admissionFeeCount, setAdmissionFeeCount] = useState(0);
  const [litmusTestsCount, setLitmusTestsCount] = useState(0);
  const [avgScholarshipsCount, setAvgScholarshipsCount] = useState(0);
  const [paymentsCount, setPaymentsCount] = useState(0);
  const [droppedCount, setDroppedCount] = useState(0);

  useEffect(() => {
    if (applications && Array.isArray(applications)) {
      // Total Applications
      setTotalApplicationsCount(applications.length);

      // Under Review Count
      const underReview = applications.filter(
        (application) =>
          application?.applicationDetails?.applicationStatus?.toLowerCase() ===
          "under review"
      );
      setUnderReviewCount(underReview.length);

      // Interviews Scheduled Count
      const interviewsScheduled = applications.filter(
        (application) =>
          application?.applicationDetails?.applicationStatus?.toLowerCase() ===
          "interviews scheduled"
      );
      setInterviewsScheduledCount(interviewsScheduled.length);

      // Admission Fee Count
      const admissionFee = applications.filter(
        (application) =>
          application?.cousrseEnrolled?.[application.cousrseEnrolled?.length - 1]?.tokenFeeDetails?.verificationStatus === 'paid'
      );
      setAdmissionFeeCount(admissionFee.length);

      // Litmus Tests Count
      const litmusTests = applications.filter(
        (application) =>
          application?.litmusTestDetails?.[0]?.litmusTaskId !== undefined
      );
      setLitmusTestsCount(litmusTests.length);


      console.log("Applications processed:", litmusTests.length);
    } else {
      console.log("Applications data is not an array or is undefined.");
    }
  }, [applications]);

  const metrics = [
    {
      title: "Total Applications",
      value: (totalApplicationsCount || '--').toString(),
      icon: ClipboardList,
    },
    {
      title: "Under Review",
      value: (underReviewCount || '--').toString(),
      icon: Users,
    },
    {
      title: "Interviews Scheduled",
      value: (interviewsScheduledCount || '--').toString(),
      icon: Calendar,
    },
    {
      title: "Aadmission Fee Paid",
      value: (admissionFeeCount || '--').toString(),
      icon: AlertTriangle,
    },
    {
      title: "LITMUS Tests",
      value: (litmusTestsCount || '--').toString(),
      description: "Submitted",
      icon: GraduationCap,
    },
    {
      title: "Avg. Scholarships",
      value: `${(avgScholarshipsCount+'%' || '--').toString()}`,
      description: "₹5L Scholarship distributed",
      icon: Award,
    },
    {
      title: "Payments",
      value: `${('₹'+paymentsCount || '--').toString()}`,
      description: "₹5L Token Amount Collected",
      icon: CreditCard,
    },
    {
      title: "Dropped",
      value: (droppedCount || '--').toString(),
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
