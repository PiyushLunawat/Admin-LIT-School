"use client";

import { getStudents } from "@/app/api/student";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Clock, CheckCircle, AlertTriangle, RotateCcw, Calendar, Banknote, Award, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

interface MetricCardProps {
  title: string;
  value: number;
  description?: string;
  icon: React.ElementType;
}

function MetricCard({ title, value, description, icon: Icon }: MetricCardProps) {

  const formatAmount = (value: number | undefined) =>
    value !== undefined
      ? new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(value))
      : "--";

      return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">₹{formatAmount(value)}</div>
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
  const [tokenAmountCount, setTokenAmountCount] = useState(0);
    const [totalExpectedCount, setTotalExpectedCount] = useState(0);
    const [totalReceivedCount, setTotalReceivedCount] = useState(0);
    const [pendingPayments, setPendingPayments] = useState(0);
    const [totalStudentCount, setTotalStudentCount] = useState(0);
    const [avgScholarshipsPercentage, setAvgScholarshipsPercentage] = useState<number | string>('--');
    const [totalScholarshipsAmount, setTotalScholarshipsAmount] = useState<number | string>('--');

  useEffect(() => {
    if (applications && Array.isArray(applications)) {
      let tokenPaid = 0;
      let oneShot = 0;
      let oneShotPaid = 0;
      let oneShotAmount = 0;
      let oneShotAmountPaid = 0;
      let installmentAmount = 0;
      let installmentAmountPaid = 0;
      let pending = 0;
      let totalScholarship = 0;
      let scholarshipCount = 0;
      let totalPercentage = 0;
      let percentageCount = 0;



      applications.forEach((application) => {

              // Initialize installment breakdown based on cohort
      const breakdown: any[] = [];
      for (let sem = 1; sem <= application?.cohort?.cohortFeesDetail?.semesters; sem++) {
        const semesterBreakdown = [];
        for (let inst = 1; inst <= application?.cohort.cohortFeesDetail.installmentsPerSemester; inst++) {
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

        const lastEnrolled = application.cousrseEnrolled?.[application.cousrseEnrolled.length - 1];

        if (!lastEnrolled) return;

          const tokenAmount = application?.cohort?.cohortFeesDetail?.tokenFee || 0;
          const lastEnrollment = application.cousrseEnrolled?.[application.cousrseEnrolled.length - 1];
          if (lastEnrollment?.tokenFeeDetails?.verificationStatus === 'paid') {
             tokenPaid += (tokenAmount || 0);
          }
    

        // One-Shot Payment Processing
        if (lastEnrolled?.feeSetup?.installmentType === 'one shot payment') {
          oneShot += 1;
          const oneShotDetails = lastEnrolled?.oneShotPayment;
          if (oneShotDetails) {
            oneShotAmount += oneShotDetails?.amountPayable;
            if (oneShotDetails?.verificationStatus === 'paid') {
              oneShotPaid += 1;
              oneShotAmountPaid += oneShotDetails?.amountPayable;
            }
            if (oneShotDetails?.verificationStatus === 'pending') {
              pending += 1;
            }
          }
        }

        // Installments Processing
        if (lastEnrolled?.feeSetup?.installmentType === 'instalments') {
          lastEnrolled?.installmentDetails.forEach((semesterDetail: any, semIndex: any) => {
            const semesterNumber = semesterDetail?.semester;
            const installments = semesterDetail?.installments;
            installments.forEach((installment: any, instIndex: any) => {
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
          lastEnrolled?.installmentDetails.forEach((semesterDetail: any) => {
            const installments = semesterDetail?.installments;
            installments.forEach((installment: any) => {
              installmentAmount += installment?.amountPayable;
              if (installment?.verificationStatus === 'paid') {
                installmentAmountPaid += installment?.amountPayable;
              }

              // Scholarships
              if (semesterDetail?.scholarshipDetails) {
                semesterDetail.scholarshipDetails.forEach((scholarship: any) => {
                  scholarship?.installments.forEach((install: any) => {
                    if (install.scholarshipAmount) {
                      totalScholarship += install?.scholarshipAmount;
                      scholarshipCount += 1;
                    }
                  });
                });
              }

              // Scholarship Percentage
              if (semesterDetail?.scholarshipPercentage !== undefined) {
                totalPercentage += semesterDetail?.scholarshipPercentage;
                percentageCount += 1;
              }
            });
          });
        }

        const scholarships = application?.cousrseEnrolled[application.cousrseEnrolled.length - 1]?.installmentDetails?.flatMap((semester: any) => semester.installments) || [];
         scholarships.forEach((installment: any) => {
           if (installment?.scholarshipAmount) {
             totalScholarship += installment?.scholarshipAmount;
             scholarshipCount += 1;
           }
         });
         const percentage = application?.cousrseEnrolled[application.cousrseEnrolled.length - 1]?.semesterFeeDetails?.scholarshipPercentage;
         if (percentage) {
           totalPercentage += application?.cousrseEnrolled[application.cousrseEnrolled.length - 1]?.semesterFeeDetails?.scholarshipPercentage;
           percentageCount += 1;
         }        
      });

      setTokenAmountCount(tokenPaid);
      // Update Expected and Received Counts
      setTotalExpectedCount(oneShotAmount + installmentAmount + tokenPaid);
      setTotalReceivedCount(oneShotAmountPaid + installmentAmountPaid + tokenPaid);
      setPendingPayments(pending);

      // Update Scholarships Metrics
      setTotalStudentCount(percentageCount)
      setTotalScholarshipsAmount(totalScholarship);
      setAvgScholarshipsPercentage((totalPercentage / percentageCount));

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
      title: "Total Expected",
      value: (totalExpectedCount),
      description: `${((totalReceivedCount / totalExpectedCount) * 100).toFixed(2)}% collected from ongoing cohorts`,
      icon: Banknote,
    },
    {
      title: "Total Received",
      value: (totalReceivedCount),
      description: `${KLsystem(tokenAmountCount)} Admission Fee Collected`,
      icon: Wallet,
    },
    {
      title: "Outstanding",
      value: (totalExpectedCount-totalReceivedCount),
      description: `${pendingPayments} payments pending`,
      icon: Clock,
    },
    {
      title: "Scholarships",
      value: (Number(totalScholarshipsAmount)),
      description: `${totalStudentCount} scholarships - avg. of ${Number(avgScholarshipsPercentage).toFixed(2)}%`,
      icon: Award,
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