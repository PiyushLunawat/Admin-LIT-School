"use client";

import { getStudents } from "@/app/api/student";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Clock, CheckCircle, AlertTriangle, RotateCcw, Calendar, Banknote } from "lucide-react";
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

  const [loading, setLoading] = useState<boolean>(true);
  const [totalStudentsEnrolled, setTotalStudentsEnrolled] = useState(0);
  const [paidAdmissionFee, setPaidAdmissionFee] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [pendingAdmissionFee, setPendingAdmissionFee] = useState(0);
  const [totalNotPaid, setTotalNotPaid] = useState(0);
  const [paidToday, setPaidToday] = useState(0);
  const [paidTodayAmount, setPaidTodayAmount] = useState(0);
  const [uniqueCohorts, setUniqueCohorts] = useState<Set<string>>(new Set());
  const [uniqueNotCohorts, setUniqueNotCohorts] = useState<Set<string>>(new Set());
  const [uniqueTodayCohorts, setUniqueTodayCohorts] = useState<Set<string>>(new Set());


  useEffect(() => {
    if (applications && Array.isArray(applications)) {
      let enrolledCount = 0;
      let paidFee = 0;
      let paidCount = 0;
      let pendingFee = 0;
      let notPaidCount = 0;
      let paidTodayCount = 0;
      let paidTodayFee = 0;

      const cohortSet = new Set<string>();
      const cohortNotSet = new Set<string>();
      const cohortTodaySet = new Set<string>();

      const today = new Date().toISOString().split('T')[0]; // get current date in YYYY-MM-DD format

      applications.forEach((application: any) => {
        const lastTokenFeeDetail = application?.cousrseEnrolled?.[application?.cousrseEnrolled?.length - 1]?.tokenFeeDetails;
        const cohortFeesDetail = application?.cohort?.cohortFeesDetail;
        
        // Check if the student is enrolled
        if (lastTokenFeeDetail?.verificationStatus === 'paid') {
          enrolledCount += 1;
          cohortSet.add(application?.cohort?.cohortId);
          // Add to Paid Admission Fee
          paidFee += cohortFeesDetail?.tokenFee || 0;
          paidCount += 1;
          // Check if the fee was paid today
          const updatedAt = new Date(lastTokenFeeDetail?.updatedAt).toISOString().split('T')[0];
          if (updatedAt === today) {
            paidTodayFee += cohortFeesDetail?.tokenFee || 0;
            paidTodayCount += 1;
            cohortTodaySet.add(application?.cohort?.cohortId);
          }
        } else {
          // Add to Pending Admission Fee if not paid
          pendingFee += Number(cohortFeesDetail?.tokenFee) || 0;
          notPaidCount += 1;
          cohortNotSet.add(application?.cohort?.cohortId);
        }
      });

      // Update the state
      setTotalStudentsEnrolled(enrolledCount);
      setUniqueCohorts(cohortSet);
      setUniqueNotCohorts(cohortNotSet);
      setUniqueTodayCohorts(cohortTodaySet);

      setPaidAdmissionFee(paidFee);
      setTotalPaid(paidCount);
      setPendingAdmissionFee(pendingFee);
      setTotalNotPaid(notPaidCount);
      setPaidToday(paidTodayCount);
      setPaidTodayAmount(paidTodayCount)
    } else {
      console.log("Applications data is not an array or is undefined.");
    }
  }, [applications]);

  
  const formatAmount = (value: number | undefined) =>
    value !== undefined
      ? new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(value))
      : "--";

  function KLsystem(amount: number): string {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`; // Converts to 'L' format with two decimal places
    } else {
      return `₹${(amount / 1000).toFixed(2)}K`; // Converts to 'K' format with two decimal places
    }
  }
  
  const metrics = [
    {
      title: "Total Students Enrolled",
      value: `${totalStudentsEnrolled}`,
      description: `Across ${uniqueCohorts.size} Cohorts`,
      icon: ClipboardList,
    },
    {
      title: "Admission Fee Collected",
      value: KLsystem(paidAdmissionFee),
      description: `${totalPaid} Payments from ${uniqueCohorts.size} upcoming cohorts`,
      icon: Banknote,
    },
    {
      title: "Pending Payments",
      value: `${totalNotPaid}`,
      description: `₹${formatAmount(pendingAdmissionFee)} from ${uniqueNotCohorts.size} upcoming cohorts`,
      icon: Clock,
    },
    {
      title: "Paid Today",
      value: `${paidToday}`,
      description: `${formatAmount(paidTodayAmount)} from ${uniqueTodayCohorts.size} upcoming cohorts`,
      icon: Calendar,
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