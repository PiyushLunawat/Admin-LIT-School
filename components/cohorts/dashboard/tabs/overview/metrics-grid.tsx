"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAmount, KLsystem } from "@/lib/utils/helpers";
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
  if (!Array.isArray(applications)) {
    console.log("Applications data is not an array or is undefined.");
    return;
  }

  let totalApplications = applications.length;
  let underReview = 0;
  let interviewsScheduled = 0;
  let admissionFee = 0;
  let litmusTests = 0;
  let dropped = 0;
  let totalScholarshipAmount = 0;
  let totalScholarshipPercentage = 0;
  let scholarshipCount = 0;
  let percentageCount = 0;
  let totalTokenPaid = 0;
  let oneShotAmountPaid = 0;
  let installmentAmountPaid = 0;

  applications.forEach((application) => {
    const cohorts = application?.appliedCohorts;
    if (!cohorts?.length) return;

    const latestCohort = application?.appliedCohorts[application?.appliedCohorts.length - 1];

    const cohortStatus = latestCohort?.status?.toLowerCase();
    const applicationStatus = latestCohort?.applicationDetails?.applicationStatus?.toLowerCase();
    const applicationInterviews = latestCohort?.applicationDetails?.applicationTestInterviews;
    const litmusStatus = latestCohort?.litmusTestDetails?.status;
    const scholarship = latestCohort?.litmusTestDetails?.scholarshipDetail;
    const baseFee = latestCohort?.cohortId?.baseFee || 0;
    const percentage = scholarship?.scholarshipPercentage;
    const lastInterview = applicationInterviews?.[applicationInterviews?.length - 1];
  
    const currentTime = new Date();
  
    if (lastInterview?.meetingDate && lastInterview?.endTime) {
      const meetingEnd = new Date(
        new Date(lastInterview.meetingDate).toDateString() + ' ' + lastInterview.endTime
      );
      if (meetingEnd >= currentTime) interviewsScheduled++;
    }

    // Status counts
    if (applicationStatus === 'under review') underReview++;
    // if (applicationStatus === 'interview scheduled') interviewsScheduled++;
    if (cohortStatus === 'enrolled') admissionFee++;
    if (![undefined, 'pending'].includes(litmusStatus)) litmusTests++;
    if (cohortStatus === 'dropped') dropped++;

    // Scholarship totals
    if (percentage && baseFee) {
      totalScholarshipAmount += percentage * baseFee * 0.01;
      scholarshipCount++;
    }
    if (percentage) {
      totalScholarshipPercentage += percentage;
      percentageCount++;
    }

    // Token Fee
    const tokenFee = Number(latestCohort?.cohortId?.cohortFeesDetail?.tokenFee) || 0;
    if (latestCohort?.tokenFeeDetails?.verificationStatus === 'paid') {
      totalTokenPaid += tokenFee;
    }

    // One-shot payment
    if (latestCohort?.feeSetup?.installmentType === 'one shot payment') {
      const oneShot = latestCohort?.oneShotPayment;
      if (oneShot?.verificationStatus === 'paid') {
        oneShotAmountPaid += oneShot.amountPayable;
      }
    }

    // Installment payment
    if (latestCohort?.feeSetup?.installmentType === 'instalments') {
      latestCohort?.installmentDetails?.forEach((semester: any) => {
        semester?.installments?.forEach((inst: any) => {
          if (inst?.verificationStatus === 'paid') {
            installmentAmountPaid += inst.amountPayable;
          }
        });
      });
    }
  });

  setTotalApplicationsCount(totalApplications);
  setUnderReviewCount(underReview);
  setInterviewsScheduledCount(interviewsScheduled);
  setAdmissionFeeCount(admissionFee);
  setLitmusTestsCount(litmusTests);
  setDroppedCount(dropped);
  setTotalScholarshipsAmount(totalScholarshipAmount);
  setAvgScholarshipsPercentage(totalScholarshipPercentage / (percentageCount || 1));
  setTotalTokenAmountPaid(totalTokenPaid);
  setPaymentsCount(oneShotAmountPaid + installmentAmountPaid + totalTokenPaid);
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
