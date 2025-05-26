"use client";

import { AlertTriangle, Award, Clock, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";

import { getCohortById } from "@/app/api/cohorts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatAmount, KLsystem } from "@/lib/utils/helpers";
import { PaymentsSummaryProps } from "@/types/components/cohorts/dashboard/tabs/payments/payments-summary";

export function PaymentsSummary({
  cohortId,
  applications,
}: PaymentsSummaryProps) {
  const [cohort, setCohort] = useState<any>(null);
  const [tokenAmountCount, setTokenAmountCount] = useState(0);
  const [totalOneShotCount, setTotalOneShotCount] = useState(0);
  const [totalOneShotPaidCount, setTotalOneShotPaidCount] = useState(0);
  const [totalOneShotAmountCount, setTotalOneShotAmountCount] = useState(0);
  const [totalOneShotAmountPaidCount, setTotalOneShotAmountPaidCount] =
    useState(0);
  const [totalInstallmentAmountCount, setTotalInstallmentAmountCount] =
    useState(0);
  const [totalInstallmentAmountPaidCount, setTotalInstallmentAmountPaidCount] =
    useState(0);
  const [totalExpectedCount, setTotalExpectedCount] = useState(0);
  const [totalReceivedCount, setTotalReceivedCount] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [totalStudentCount, setTotalStudentCount] = useState(0);
  const [avgScholarshipsPercentage, setAvgScholarshipsPercentage] = useState<
    number | string
  >("--");
  const [totalScholarshipsAmount, setTotalScholarshipsAmount] = useState<
    number | string
  >("--");

  useEffect(() => {
    async function fetchCohort() {
      try {
        const cohortData = await getCohortById(cohortId);
        setCohort(cohortData.data);
      } catch (error) {
        console.error("Failed to fetch cohort:", error);
      }
    }
    fetchCohort();
  }, [cohortId]);

  const [instalmentBreakdown, setInstalmentBreakdown] = useState<any[]>([]);

  useEffect(() => {
    if (applications && Array.isArray(applications) && cohort) {
      let tokenAmountPending = 0;
      let tokenAmountPaid = 0;
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

      // Initialize installment breakdown based on cohort
      const breakdown: any[] = [];
      for (let sem = 1; sem <= cohort?.cohortFeesDetail?.semesters; sem++) {
        const semesterBreakdown = [];
        for (
          let inst = 1;
          inst <= cohort.cohortFeesDetail.installmentsPerSemester;
          inst++
        ) {
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

      applications?.forEach((application) => {
        const latestCohort =
          application?.appliedCohorts?.[application?.appliedCohorts.length - 1];
        const litmusTestDetails = latestCohort?.litmusTestDetails;
        const tokenFeeDetails = latestCohort?.tokenFeeDetails;
        const scholarshipDetails = litmusTestDetails?.scholarshipDetail;
        const paymentDetails = latestCohort?.paymentDetails;
        const tokenAmount =
          Number(latestCohort?.cohortId?.cohortFeesDetail?.tokenFee) || 0;

        if (tokenFeeDetails?.verificationStatus === "paid") {
          tokenAmountPaid += tokenAmount || 0;
        } else {
          tokenAmountPending += tokenAmount || 0;
          pending += 1;
        }

        // One-Shot Payment Processing
        if (paymentDetails?.paymentPlan === "one-shot") {
          oneShot += 1;
          const oneShotDetails = paymentDetails?.oneShotPayment;
          console.log("paymentDetails", paymentDetails);

          if (oneShotDetails) {
            oneShotAmount += oneShotDetails?.amountPayable;
            if (oneShotDetails?.verificationStatus === "paid") {
              oneShotPaid += 1;
              oneShotAmountPaid += oneShotDetails?.amountPayable;
            } else {
              pending += 1;
            }
          }
        }

        // Installments Processing
        if (paymentDetails?.paymentPlan === "instalments") {
          paymentDetails?.installments?.forEach(
            (installment: any, instIndex: any) => {
              if (
                breakdown[installment?.semester - 1] &&
                breakdown[installment?.semester - 1]?.installments[instIndex]
              ) {
                breakdown[installment?.semester - 1].installments[
                  instIndex
                ].total += installment?.amountPayable;
                if (installment?.verificationStatus === "paid") {
                  breakdown[installment?.semester - 1].installments[
                    instIndex
                  ].received += installment?.amountPayable;
                }
                if (installment?.verificationStatus === "pending") {
                  pending += 1;
                }
              }
            }
          );

          // Calculate total installments expected and received
          paymentDetails?.installments?.forEach((installment: any) => {
            installmentAmount += installment?.amountPayable;
            if (installment?.verificationStatus === "paid") {
              installmentAmountPaid += installment?.amountPayable;
            }

            // Scholarships
            if (paymentDetails?.scholarshipDetails) {
              paymentDetails.scholarshipDetails?.forEach((scholarship: any) => {
                scholarship?.installments?.forEach((install: any) => {
                  if (install.scholarshipAmount) {
                    totalScholarship += install?.scholarshipAmount;
                    scholarshipCount += 1;
                  }
                });
              });
            }

            // Scholarship Percentage
            if (paymentDetails?.scholarshipPercentage !== undefined) {
              totalPercentage += paymentDetails?.scholarshipPercentage;
              percentageCount += 1;
            }
          });
        }

        const scholarships =
          scholarshipDetails?.installmentDetails?.flatMap(
            (semester: any) => semester.installments
          ) || [];
        scholarships?.forEach((installment: any) => {
          if (installment?.scholarshipAmount) {
            totalScholarship += installment?.scholarshipAmount;
            scholarshipCount += 1;
          }
        });
        const percentage = scholarshipDetails?.scholarshipPercentage;
        if (percentage) {
          totalPercentage += scholarshipDetails?.scholarshipPercentage;
          percentageCount += 1;
        }
      });

      setTokenAmountCount(tokenAmountPaid);

      // Update One-Shot Metrics
      setTotalOneShotCount(oneShot);
      setTotalOneShotPaidCount(oneShotPaid);
      setTotalOneShotAmountCount(oneShotAmount);
      setTotalOneShotAmountPaidCount(oneShotAmountPaid);

      // Update Installment Metrics
      setTotalInstallmentAmountCount(installmentAmount);
      setTotalInstallmentAmountPaidCount(installmentAmountPaid);

      // Update Expected and Received Counts
      setTotalExpectedCount(
        oneShotAmount + installmentAmount + tokenAmountPaid
      );
      setTotalReceivedCount(
        oneShotAmountPaid + installmentAmountPaid + tokenAmountPaid
      );
      setPendingPayments(pending);

      // Update Scholarships Metrics
      setTotalStudentCount(percentageCount);
      setTotalScholarshipsAmount(totalScholarship);
      setAvgScholarshipsPercentage(totalPercentage / percentageCount);

      // Update Installment Breakdown
      setInstalmentBreakdown(breakdown);
    }
  }, [applications, cohort]);

  const determineStatus = (received: number, total: number) => {
    if (received >= total) return "complete";
    if (received > 0 && received < total) return "partial";
    return "pending";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expected
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{formatAmount(totalExpectedCount)}
            </div>
            {/* <Progress states={[ {value:(summary.collectionProgress)} ]} className="mt-2" /> */}
            <p className="text-xs text-muted-foreground mt-2">
              {((totalReceivedCount / totalExpectedCount) * 100 || 0).toFixed(
                2
              )}
              % collected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Received
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{formatAmount(totalReceivedCount)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {KLsystem(tokenAmountCount)} Admission Fee Collected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{formatAmount(totalExpectedCount - totalReceivedCount)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {pendingPayments} payments pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Scholarships</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{formatAmount(Number(totalScholarshipsAmount))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {totalStudentCount} scholarships awarded
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Instalment Breakdown</CardTitle>
        </CardHeader>
        <CardContent
          className={`flex flex-col sm:grid grid-cols-${
            instalmentBreakdown.length <= 4 ? instalmentBreakdown.length : 3
          } gap-4 `}
        >
          {instalmentBreakdown.map((semester, semesterIndex) => (
            <div key={semesterIndex} className="space-y-2 flex-1">
              <Badge variant="blue" className="py-1">
                Semester {semester.semester}
              </Badge>
              <Card className="md:col-span-1 lg:col-span-1">
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {semester.installments.map(
                      (instalment: any, instalmentIndex: number) => (
                        <div key={instalmentIndex} className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">
                              {instalment.label}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              ₹{formatAmount(instalment.received)} / ₹
                              {formatAmount(instalment.total)}
                            </span>
                          </div>
                          <Progress
                            states={[
                              {
                                value: instalment.received,
                                widt:
                                  (instalment.received / instalment.total) *
                                    100 || 0,
                                color:
                                  instalment.received >= instalment.total
                                    ? "#2EB88A"
                                    : instalment.received > 0
                                    ? "#2EB88A"
                                    : "#2EB88A",
                              },
                            ]}
                          />
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>One-Shot Payment Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">
                    {totalOneShotPaidCount}/{totalOneShotCount} Students
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatAmount(totalOneShotAmountPaidCount)} /{" "}
                    {formatAmount(totalOneShotAmountCount)}
                  </span>
                </div>
                <Progress
                  states={[
                    {
                      value: totalOneShotAmountPaidCount,
                      widt:
                        (totalOneShotAmountPaidCount /
                          totalOneShotAmountCount) *
                        100,
                      color: "#2EB88A",
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
