"use client";


import { getCohorts } from "@/app/api/cohorts";
import { getStudents } from "@/app/api/student";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KLsystem } from "@/lib/utils/helpers";
import { addMonths } from "date-fns";
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
  Wallet,
} from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

interface MetricCardProps {
  title: string;
  value: string | number;
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
            {trend.isPositive ? '↑' : '↓'} {(trend.value).toFixed(2)}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface MetricsGridProps {
  selectedDateRange: DateRange | undefined;
  searchQuery: string;
  selectedProgram: string;
  selectedCohort: string;
}

export function MetricsGrid({ selectedDateRange, searchQuery, selectedProgram, selectedCohort, }: MetricsGridProps) {

  const [loading, setLoading] = useState<boolean>(true);
  const [activeCohorts, setActiveCohorts] = useState(0);
  const [soonCohorts, setSoonCohorts] = useState(0);
  const [applications, setApplications] = useState<any>([]);
  const [totalApplicationsCount, setTotalApplicationsCount] = useState(0);
  const [applicationsThisMonth, setApplicationsThisMonth] = useState(0);
  const [applicationsLastMonth, setApplicationsLastMonth] = useState(0);
  const [underReviewCount, setUnderReviewCount] = useState(0);
  const [interviewsScheduledCount, setInterviewsScheduledCount] = useState(0);
  const [admissionFeeCount, setAdmissionFeeCount] = useState(0);
  const [litmusTestsCount, setLitmusTestsCount] = useState(0);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [avgScholarshipsPercentage, setAvgScholarshipsPercentage] = useState(0);
  const [totalScholarshipsAmount, setTotalScholarshipsAmount] = useState(0);
  const [totalTokenAmountPaid, setTotalTokenAmountPaid] = useState(0);
  const [droppedCount, setDroppedCount] = useState(0);
  const [revenueCollected, setRevenueCollected] = useState(0);
  const [revenuePending, setRevenuePending] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [revenueCollectedThisMonth, setRevenueCollectedThisMonth] = useState(0);
  const [revenueCollectedLastMonth, setRevenueCollectedLastMonth] = useState(0);

  useEffect(() => {
    async function fetchAndFilterStudents() {
      setLoading(true);
      try {
        // 1) Fetch All Students
        const response = await getStudents();

        const resp = await getCohorts();

        let activeCohort = 0, soonCohort = 0;
        resp.data.filter(
          (cohort: any) => {
            if(cohort?.status !== 'archived')
              activeCohort += 1;
            if(cohort?.status !== 'archived' && new Date(cohort.startDate) > new Date())
              soonCohort += 1;
          }
        );
        setActiveCohorts(activeCohort);
        setSoonCohorts(soonCohort);

        // 2) Filter Out Students with No Application Details
        const validStudents = response.data.filter(
          (student: any) =>
            ['initiated', 'applied', 'reviewing', 'enrolled', 'dropped'].includes(student?.appliedCohorts?.[student?.appliedCohorts.length - 1]?.status)
        );

        // 3) Filter Based on Date Range, Search Query, Program, Cohort
        const filteredApplications = validStudents.filter((app: any) => {

          const latestCohort = app?.appliedCohorts?.[app?.appliedCohorts.length - 1];
          const cohortDetails = latestCohort?.cohortId;

          // --- Date Range Check ---
          if (selectedDateRange) {
            const appDate = new Date(app.updatedAt);
            const { from, to } = selectedDateRange;
            if ((from && appDate < from) || (to && appDate > to)) {
              return false;
            }
          }

          // --- Search Query (by Name, Email, etc.) ---
          if (searchQuery) {
            const lowerSearch = searchQuery.toLowerCase();
            // Adjust fields as needed (name, email, phone, etc.)
            const matchesSearch =
              ((app.firstName+' '+app.lastName) || "").toLowerCase().includes(lowerSearch) ||
              (cohortDetails.programDetail.name || "").toLowerCase().includes(lowerSearch) ||
              (cohortDetails.cohortId || "").toLowerCase().includes(lowerSearch);;

            if (!matchesSearch) return false;
          }

          // --- Program Check ---
          if (selectedProgram !== "all-programs") {
            // Suppose 'app.program' is how you store it
            if ((cohortDetails?.programDetail?.name) !== selectedProgram) {
              return false;
            }
          }

          // --- Cohort Check ---
          if (selectedCohort !== "all-cohorts") {
            // Suppose 'app.cohort' is how you store it
            if ((cohortDetails?.cohortId) !== selectedCohort) {
              return false;
            }
          }

          return true;
        });

        // 4) Set Final Filtered Applications
        setApplications(filteredApplications);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAndFilterStudents();
  }, [selectedDateRange, searchQuery, selectedProgram, selectedCohort]);

  useEffect(() => {
    if (applications && Array.isArray(applications)) {
      let totalApplications = 0;
      let applicationsThisMonth = 0;
      let applicationsLastMonth = 0;
  
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0); // last date of last month
  
      let underReview = 0;
      let interviewsScheduled = 0;
      let admissionFee = 0;
      let litmusTests = 0;
      let reviewed = 0;
      let dropped = 0;
  
      let totalScholarshipAmount = 0;
      let totalScholarshipPercentage = 0;
      let scholarshipCount = 0;
  
      let totalTokenPaid = 0;
      let tokenAmountPending = 0;
      let tokenAmountPaid = 0;
  
      let oneShot = 0;
      let oneShotPaid = 0;
      let oneShotAmount = 0;
      let oneShotAmountPaid = 0;
  
      let installmentAmount = 0;
      let installmentAmountPaid = 0;
  
      let pendingPayments = 0;
  
      applications.forEach((application) => {
        totalApplications += 1;
  
        const latestCohort = application?.appliedCohorts?.[application?.appliedCohorts.length - 1];
        const appDate = new Date(application.updatedAt);
  
        // Date based
        if (appDate >= startOfMonth) {
          applicationsThisMonth += 1;
        }
        if (appDate >= startOfLastMonth && appDate <= endOfLastMonth) {
          applicationsLastMonth += 1;
        }
  
        // Status based
        const applicationStatus = latestCohort?.applicationDetails?.applicationStatus?.toLowerCase();
        const tokenFeeStatus = latestCohort?.tokenFeeDetails?.verificationStatus;
        const litmusStatus = latestCohort?.litmusTestDetails?.status?.toLowerCase();
        const tokenAmount = Number(latestCohort?.cohortId?.cohortFeesDetail?.tokenFee) || 0;
        const baseFee = latestCohort?.cohortId?.baseFee || 0;
        const scholarshipDetails = latestCohort?.litmusTestDetails?.scholarshipDetail;
        const paymentDetails = latestCohort?.paymentDetails;
  
        if (applicationStatus === "under review") underReview++;
        if (applicationStatus === "interview scheduled") interviewsScheduled++;
        if (tokenFeeStatus === "paid") admissionFee++;
  
        if (![undefined, '', 'pending', 'completed'].includes(litmusStatus)) litmusTests++;
        if (litmusStatus === "completed") reviewed++;
  
        if (latestCohort?.status?.toLowerCase() === "dropped") dropped++;
  
        // Scholarships
        if (scholarshipDetails && baseFee) {
          totalScholarshipAmount += scholarshipDetails.scholarshipPercentage * baseFee * 0.01;
          totalScholarshipPercentage += scholarshipDetails.scholarshipPercentage;
          scholarshipCount += 1;
        }
  
        // Token Payments
        if (tokenFeeStatus === "paid") {
          tokenAmountPaid += tokenAmount;
        } else if (applicationStatus === "selected") {
          tokenAmountPending += tokenAmount;
          pendingPayments++;
        }
  
        // Revenue
        if (paymentDetails?.paymentPlan === "one-shot") {
          oneShot++;
          const oneShotPayment = paymentDetails.oneShotPayment;
          if (oneShotPayment) {
            oneShotAmount += oneShotPayment.amountPayable || 0;
            if (oneShotPayment.verificationStatus === "paid") {
              oneShotPaid++;
              oneShotAmountPaid += oneShotPayment.amountPayable || 0;
            } else {
              pendingPayments++;
            }
          }
        }
  
        if (paymentDetails?.paymentPlan === "instalments") {
          paymentDetails.installments?.forEach((installment: any) => {
              installmentAmount += installment.amountPayable || 0;
              if (installment.verificationStatus === "paid") {
                installmentAmountPaid += installment.amountPayable || 0;
              } else if (installment.verificationStatus === "pending") {
                pendingPayments++;
              }
          });
        }
      });
  
      // Set all states
      setTotalApplicationsCount(totalApplications);
      setApplicationsThisMonth(applicationsThisMonth);
      setApplicationsLastMonth(applicationsLastMonth);
  
      setUnderReviewCount(underReview);
      setInterviewsScheduledCount(interviewsScheduled);
      setAdmissionFeeCount(admissionFee);
      setLitmusTestsCount(litmusTests);
      setReviewedCount(reviewed);
      setDroppedCount(dropped);
  
      setTotalScholarshipsAmount(totalScholarshipAmount);
      setAvgScholarshipsPercentage(totalScholarshipPercentage / (scholarshipCount || 1));
  
      setTotalTokenAmountPaid(tokenAmountPaid);
  
      setRevenueCollected(oneShotAmountPaid + installmentAmountPaid + tokenAmountPaid);
      setRevenuePending(tokenAmountPending + (installmentAmount + oneShotAmount) - (installmentAmountPaid + oneShotAmountPaid));
      setPendingPayments(pendingPayments);
    } else {
      console.log("Applications data is not an array or is undefined.");
    }
  }, [applications]);
  
        const calculatePercentageIncrease = (current: number, previous: number) => {
          if (current === 0) return 0;
          if (previous === 0) return 100;
          return ((current - previous) / previous) * 100;
        };
      

  const metrics = [
    {
      title: "Total Applications",
      value: totalApplicationsCount,
      description: `${applicationsThisMonth} new this month`,
      icon: ClipboardList,
      trend: { value: calculatePercentageIncrease(applicationsThisMonth, applicationsLastMonth), isPositive: applicationsThisMonth > applicationsLastMonth },
    },
    {
      title: "Under Review",
      value: underReviewCount,
      description: "pending feedback",
      icon: CheckCircle,
    },
    {
      title: "Interviews Scheduled",
      value: interviewsScheduledCount,
      description: "This week",
      icon: Calendar,
    },
    {
      title: "LITMUS Tests",
      value: litmusTestsCount,
      description: `${reviewedCount} evaluated`,
      icon: GraduationCap,
    },
    {
      title: "Scholarships",
      value: `${(avgScholarshipsPercentage ? (avgScholarshipsPercentage.toFixed(2) +'%') : '--')}`,
      description: `${KLsystem(totalScholarshipsAmount)} awarded`,
      icon: Award,
    },
    {
      title: "Active Cohorts",
      value: activeCohorts,
      description: `${soonCohorts} starting soon`,
      icon: Building2,
    },
    {
      title: "Revenue Collected",
      value: `${KLsystem(revenueCollected)}`,
      description: `${KLsystem(totalTokenAmountPaid)} Admission Fee Paid`,
      icon: Wallet,
      // trend: { value: 8, isPositive: true },
    },
    {
      title: "Outstanding",
      value: `${KLsystem(revenuePending)}`,
      description: `${pendingPayments} payments pending`,
      icon: AlertTriangle,
    },
    {
      title: "Dropped Students",
      value: droppedCount,
      // description: "This month",
      icon: UserMinus,
      // trend: { value: 2, isPositive: false },
    },
    {
      title: "Total Students",
      value: admissionFeeCount,
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