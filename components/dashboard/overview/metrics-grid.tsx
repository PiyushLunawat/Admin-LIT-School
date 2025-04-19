"use client";


import { getCohorts } from "@/app/api/cohorts";
import { getStudents } from "@/app/api/student";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
            // Total Applications
            setTotalApplicationsCount(applications.length);

            const thisMonthApps = applications.filter((app: any) => {
              const appDate = new Date(app.updatedAt);
              const startOfMonth = new Date();
              startOfMonth.setDate(1);
              return appDate >= startOfMonth;
            });
            setApplicationsThisMonth(thisMonthApps.length);
    
            const lastMonthApps = applications.filter((app: any) => {
              const appDate = new Date(app.updatedAt);
              const startOfLastMonth = addMonths(new Date(), -1);
              startOfLastMonth.setDate(1);
              const endOfLastMonth = new Date(startOfLastMonth);
              endOfLastMonth.setMonth(startOfLastMonth.getMonth() + 1);
              return appDate >= startOfLastMonth && appDate < endOfLastMonth;
            });
            setApplicationsLastMonth(lastMonthApps.length);
      
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
                application?.appliedCohorts?.[application?.appliedCohorts.length - 1]?.applicationDetails?.applicationStatus?.toLowerCase() === "interview scheduled"
            );
            setInterviewsScheduledCount(interviewsScheduled.length);
      
            // Admission Fee Count
            const admissionFee = applications.filter(
              (application) =>
                application?.appliedCohorts?.[application?.appliedCohorts.length - 1]?.tokenFeeDetails?.verificationStatus === 'paid'
            );
            setAdmissionFeeCount(admissionFee.length);
      
            // Litmus Tests Count
            const litmusTests = applications.filter(
              (application) =>
                ['under review', 'completed'].includes(application?.appliedCohorts?.[application?.appliedCohorts.length - 1]?.litmusTestDetails?.status)
            );
            setLitmusTestsCount(litmusTests.length);

            // Reviewed Count
            const reviewed = applications.filter(
              (application) =>
                application?.appliedCohorts?.[application?.appliedCohorts.length - 1]?.litmusTestDetails?.status === 'completed'
            );
            setReviewedCount(reviewed.length);

            const dropped = applications.filter(
              (application) =>
                application?.appliedCohorts?.[application?.appliedCohorts.length - 1]?.status?.toLowerCase() ===
                "dropped"
            );
            setDroppedCount(dropped.length);
            
            // Total Scholarship and Average Scholarships Percentage
            let totalScholarship = 0;
            let scholarshipCount = 0;
            let totalPercentage = 0;
            let percentageCount = 0;
        
            applications?.forEach((application) => {
              const scholarship = application?.appliedCohorts?.[application?.appliedCohorts.length - 1]?.litmusTestDetails?.scholarshipDetail;
              const baseFee = application?.appliedCohorts?.[application?.appliedCohorts.length - 1]?.cohortId?.baseFee || 0;
        
              if (scholarship && baseFee) {
                totalScholarship += scholarship?.scholarshipPercentage * baseFee * 0.01;
                scholarshipCount += 1;
              }
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
              if (application?.appliedCohorts?.[application?.appliedCohorts.length - 1]?.tokenFeeDetails?.verificationStatus === 'paid') {
                return sum + (tokenAmount || 0);
              }
              return sum;
            }, 0);
        
            setTotalTokenAmountPaid(tokensPaid);

            // let tokenPaid = 0;
            // let oneShot = 0;
            // let oneShotPaid = 0;
            // let oneShotAmount = 0;
            // let oneShotAmountPaid = 0;
            // let installmentAmount = 0;
            // let installmentAmountPaid = 0;
            // let pending = 0;

            let tokenAmountPending = 0;
            let tokenAmountPaid = 0;
            let oneShot = 0;
            let oneShotPaid = 0;
            let oneShotAmount = 0;
            let oneShotAmountPaid = 0;
            let installmentAmount = 0;
            let installmentAmountPaid = 0;
            let pending = 0;

            applications?.forEach((application) => {
              const latestCohort = application?.appliedCohorts?.[application?.appliedCohorts.length - 1];
              const cohortDetails = latestCohort?.cohortId;
              const litmusTestDetails = latestCohort?.litmusTestDetails;
              const tokenFeeDetails = latestCohort?.tokenFeeDetails;
              const scholarshipDetails = litmusTestDetails?.scholarshipDetail;
              const paymentDetails = latestCohort?.paymentDetails;
              const tokenAmount = Number(latestCohort?.cohortId?.cohortFeesDetail?.tokenFee) || 0;

              // Initialize installment breakdown based on cohort
              const breakdown: any[] = [];
              for (let sem = 1; sem <= cohortDetails?.cohortFeesDetail?.semesters; sem++) {
                const semesterBreakdown = [];
                for (let inst = 1; inst <= cohortDetails.cohortFeesDetail.installmentsPerSemester; inst++) {
                  semesterBreakdown.push({
                    label: `Instalment ${inst}`,
                    total: 0,
                    received: 0,
                    status: "pending",
                  });
                }
                breakdown.push({
                  semester: sem,
                  installments: semesterBreakdown,
                });
              }
                
              if (tokenFeeDetails?.verificationStatus === 'paid') {
                tokenAmountPaid += (tokenAmount || 0);
              } else if (['selected'].includes(latestCohort?.applicationDetails?.applicationStatus)) {
                tokenAmountPending += (tokenAmount || 0);
                pending += 1;
              }
          
              // One-Shot Payment Processing
              if (paymentDetails?.paymentPlan === 'one-shot') {
                oneShot += 1;
                const oneShotDetails = paymentDetails?.oneShotPayment;
                if (oneShotDetails) {
                  oneShotAmount += (oneShotDetails?.amountPayable || 0);
                  if (oneShotDetails?.verificationStatus === 'paid') {
                    oneShotPaid += 1;
                    oneShotAmountPaid += oneShotDetails?.amountPayable;
                  } else {
                    pending += 1;
                  }
                }
              }

              // Installments Processing
              if (paymentDetails?.paymentPlan === 'instalments') {
                paymentDetails?.installments?.forEach((semesterDetail: any, semIndex: any) => {
                  const semesterNumber = semesterDetail?.semester;
                  const installments = semesterDetail?.installments;
                  installments?.forEach((installment: any, instIndex: any) => {
                    if (breakdown[semIndex] && breakdown[semIndex]?.installments[instIndex]) {
                      breakdown[semIndex].installments[instIndex].total += installment?.amountPayable;
                      if (installment?.verificationStatus === 'paid') {
                        breakdown[semIndex].installments[instIndex].received += installment?.amountPayable;
                      }
                      if (installment?.verificationStatus === 'pending') {
                        pending += 1;
                      }
                    }
                  });
                });

                // Calculate total installments expected and received
                paymentDetails?.installments?.forEach((semesterDetail: any) => {
                  const installments = semesterDetail?.installments;
                  installments?.forEach((installment: any) => {
                    installmentAmount += installment?.amountPayable;
                    if (installment?.verificationStatus === 'paid') {
                      installmentAmountPaid += installment?.amountPayable;
                    }
                  });
                });
              } 
            });
            
            setRevenueCollected(oneShotAmountPaid + installmentAmountPaid + tokenAmountPaid)
            setRevenuePending(tokenAmountPending + (installmentAmount + oneShotAmount) - (installmentAmountPaid + oneShotAmountPaid))
            setPendingPayments(pending);
          } else {
            console.log("Applications data is not an array or is undefined.");
          }
        }, [applications]);

        function KLsystem(amount: number): string {

          if (amount === 0) {
            return `--`; // Converts to 'L' format with two decimal places
          } else if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(2)}L`; // Converts to 'L' format with two decimal places
          } else {
            return `₹${(amount / 1000).toFixed(2)}K`; // Converts to 'K' format with two decimal places
          }
        }

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
      description: "8 pending feedback",
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
      icon: IndianRupee,
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