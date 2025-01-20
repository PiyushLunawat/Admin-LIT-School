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
  UserMinus,
  Banknote,
  Wallet
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
        <Icon className="h-5 w-5 text-muted-foreground" />
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
  const [avgScholarshipsPercentage, setAvgScholarshipsPercentage] = useState(0);
  const [totalScholarshipsAmount, setTotalScholarshipsAmount] = useState(0);
  const [paymentsCount, setPaymentsCount] = useState(0);
  const [totalTokenAmountPaid, setTotalTokenAmountPaid] = useState(0);
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
      
      // Total Scholarship and Average Scholarships Percentage
      let totalScholarship = 0;
      let scholarshipCount = 0;
      let totalPercentage = 0;
      let percentageCount = 0;
  
      applications.forEach((application) => {
        const scholarships = application.cousrseEnrolled[application.cousrseEnrolled.length - 1]?.semesterFeeDetails?.scholarshipDetails?.flatMap((semester: any) => semester.installments) || [];
        scholarships.forEach((installment: any) => {
          if (installment?.scholarshipAmount) {
            totalScholarship += installment.scholarshipAmount;
            scholarshipCount += 1;
          }
        });
        const percentage = application?.cousrseEnrolled[application.cousrseEnrolled.length - 1]?.semesterFeeDetails?.scholarshipPercentage;
        if (percentage) {
          totalPercentage += application?.cousrseEnrolled[application.cousrseEnrolled.length - 1]?.semesterFeeDetails?.scholarshipPercentage;
          percentageCount += 1;
        }
      });
  
      setTotalScholarshipsAmount(totalScholarship);
      setAvgScholarshipsPercentage((totalPercentage / percentageCount));
  
      // Total Token Amount Paid
      const tokensPaid = applications.reduce((sum, application) => {
        const tokenAmount = application?.cohort?.cohortFeesDetail?.tokenFee || 0;
        const lastEnrollment = application.cousrseEnrolled?.[application.cousrseEnrolled.length - 1];
        if (lastEnrollment?.tokenFeeDetails?.verificationStatus === 'paid') {
          return sum + (tokenAmount || 0);
        }
        return sum;
      }, 0);
  
      setTotalTokenAmountPaid(tokensPaid);
    } else {
      console.log("Applications data is not an array or is undefined.");
    }
  }, [applications]);

  function KLsystem(amount: number): string {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`; // Converts to 'L' format with two decimal places
    } else {
      return `₹${(amount / 1000).toFixed(2)}K`; // Converts to 'K' format with two decimal places
    }
  }

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
      title: "Admission Fee Paid",
      value: (admissionFeeCount || '--').toString(),
      icon: Banknote,
    },
    {
      title: "LITMUS Tests",
      value: (litmusTestsCount || '--').toString(),
      description: "Submitted",
      icon: GraduationCap,
    },
    {
      title: "Avg. Scholarships",
      value: `${(avgScholarshipsPercentage ? (avgScholarshipsPercentage +'%') : '--').toString()}`,
      description: `${(totalScholarshipsAmount ? (KLsystem(totalScholarshipsAmount)) : '-').toLocaleString()} Scholarship distributed`,
      icon: Award,
    },
    {
      title: "Payments",
      value: `${(paymentsCount ? ('₹'+paymentsCount) : '--').toString()}`,
      description: `${(totalTokenAmountPaid ? (KLsystem(totalTokenAmountPaid)) : '--').toString()} Admission Fee Collected`,
      icon: Wallet,
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
