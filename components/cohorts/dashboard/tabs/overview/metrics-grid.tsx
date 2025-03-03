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
          application?.appliedCohorts?.[application?.appliedCohorts.length - 1]?.applicationDetails?.applicationStatus?.toLowerCase() ===
          "under review"
      );
      setUnderReviewCount(underReview.length);

      // Interviews Scheduled Count
      const interviewsScheduled = applications.filter(
        (application) =>
          application?.appliedCohorts?.[application?.appliedCohorts.length - 1]?.applicationDetails?.applicationStatus?.toLowerCase() ===
          "interviews scheduled"
      );
      setInterviewsScheduledCount(interviewsScheduled.length);

      // Admission Fee Count
      const admissionFee = applications.filter(
        (application) =>
          application?.appliedCohorts?.[application?.appliedCohorts.length - 1]?.status === 'enrolled'
      );
      setAdmissionFeeCount(admissionFee.length);

      // Litmus Tests Count
      const litmusTests = applications.filter(
        (application) =>
          ![undefined, 'pending'].includes(application?.appliedCohorts?.[application?.appliedCohorts.length - 1]?.litmusTestDetails?.status)
      );
      setLitmusTestsCount(litmusTests.length);
      
      // Total Scholarship and Average Scholarships Percentage
      let totalScholarship = 0;
      let scholarshipCount = 0;
      let totalPercentage = 0;
      let percentageCount = 0;
  
      applications.forEach((application) => {
        const scholarships = application?.appliedCohorts?.[application?.appliedCohorts.length - 1]?.semesterFeeDetails?.flatMap((semester: any) => semester.installments) || [];
        scholarships.forEach((installment: any) => {
          if (installment?.scholarshipAmount) {
            totalScholarship += installment.scholarshipAmount;
            scholarshipCount += 1;
          }
        });
        const percentage = application?.appliedCohorts?.[application?.appliedCohorts.length - 1]?.litmusTestDetails?.scholarshipDetail?.scholarshipPercentage;
        if (percentage) {
          totalPercentage += application?.appliedCohorts?.[application?.appliedCohorts.length - 1]?.litmusTestDetails?.scholarshipDetail?.scholarshipPercentage;
          percentageCount += 1;
        }
      });
  
      setTotalScholarshipsAmount(totalScholarship);
      setAvgScholarshipsPercentage((totalPercentage / percentageCount));
  
      // Total Token Amount Paid
      const tokensPaid = applications.reduce((sum, application) => {
        const tokenAmount = Number(application?.appliedCohorts?.[application?.appliedCohorts.length - 1]?.cohortId?.cohortFeesDetail?.tokenFee) || 0;
        const lastEnrollment = application?.appliedCohorts?.[application?.appliedCohorts.length - 1];
        if (lastEnrollment?.tokenFeeDetails?.verificationStatus === 'paid') {
          return sum + (tokenAmount || 0);
        }
        return sum;
      }, 0);
  
      setTotalTokenAmountPaid(tokensPaid);

      let oneShotAmountPaid = 0;
      let installmentAmountPaid = 0;

      applications.forEach((application) => {
        const lastEnrolled = application?.appliedCohorts?.[application?.appliedCohorts.length - 1];
        if (!lastEnrolled) return;

        // One-Shot Payment Processing
        if (lastEnrolled?.feeSetup?.installmentType === 'one shot payment') {
          const oneShotDetails = lastEnrolled?.oneShotPayment;
          if (oneShotDetails) {
            if (oneShotDetails?.verificationStatus === 'paid') {
              oneShotAmountPaid += oneShotDetails?.amountPayable;
            }
          }
        }
        // Installments Processing
        if (lastEnrolled?.feeSetup?.installmentType === 'instalments') {
          lastEnrolled?.installmentDetails.forEach((semesterDetail: any) => {
            const installments = semesterDetail?.installments;
            installments.forEach((installment: any) => {
              if (installment?.verificationStatus === 'paid') {
                installmentAmountPaid += installment?.amountPayable;
              }
            });
          });
        }       
      });

      setPaymentsCount(oneShotAmountPaid+installmentAmountPaid+tokensPaid)

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

  const formatAmount = (value: number | undefined) =>
    value !== undefined
      ? new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(value))
      : "--";

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
      value: `${(avgScholarshipsPercentage ? (avgScholarshipsPercentage.toFixed(2) +'%') : '--').toString()}`,
      description: `${(totalScholarshipsAmount ? (KLsystem(totalScholarshipsAmount)) : '-')} Scholarship distributed`,
      icon: Award,
    },
    {
      title: "Payments",
      value: `${(paymentsCount ? ('₹'+formatAmount(paymentsCount)) : '--').toString()}`,
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
