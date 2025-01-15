"use client";


import { getStudents } from "@/app/api/student";
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
            {trend.isPositive ? '↑' : '↓'} {trend.value}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface MetricsGridProps {
  selectedDateRange: DateRange | undefined;
}

export function MetricsGrid({ selectedDateRange }: MetricsGridProps) {

  const [applications, setApplications] = useState<any>([]);
      const [loading, setLoading] = useState<boolean>(true);
      const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
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
        async function fetchStudents() {
          try {
            const response = await getStudents();
            const mappedStudents =
              response.data.filter(
                (student: any) =>
                  student?.applicationDetails !== undefined
              )
              const filteredApplications = mappedStudents.filter((app: any) => {
                if (!selectedDateRange) return true;
                const appDate = new Date(app.updatedAt);
                const { from, to } = selectedDateRange;
                return (!from || appDate >= from) && (!to || appDate <= to);
              });
    
              setApplications(filteredApplications);
            console.log("fetching students:", response.data);
          } catch (error) {
            console.error("Error fetching students:", error);
          } finally {
            setLoading(false);
          }
        }
    
        fetchStudents();
      }, [selectedDateRange]);

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

  const metrics = [
    {
      title: "Total Applications",
      value: totalApplicationsCount,
      description: "45 new this month",
      icon: ClipboardList,
      trend: { value: 12, isPositive: true },
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
      description: "32 evaluated",
      icon: GraduationCap,
    },
    {
      title: "Scholarships",
      value: `${(avgScholarshipsPercentage.toFixed(2))}%`,
      description: `₹${(totalScholarshipsAmount/100000).toFixed(2)}L awarded`,
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
      value: droppedCount,
      description: "This month",
      icon: UserMinus,
      trend: { value: 2, isPositive: false },
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