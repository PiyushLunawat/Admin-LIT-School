"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useId, useState } from "react";
import { format, add, differenceInDays } from "date-fns";
import { updateCohort } from "@/app/api/cohorts";
import { z } from "zod";

// Reuse your existing scholarship schema:
export const scholarshipSchema = z.object({
  installments: z.array(
    z.object({  
      scholarshipName: z.string(),
      scholarshipPercentage: z.number(),
      scholarshipClearance: z.string(),
      scholarshipDetails: z.array(
        z.object({
          semester: z.number(),
          installments: z.array(
            z.object({
              installmentDate: z.string(),
              amountPayable: z.number(),
              scholarshipAmount: z.number(),
              baseFee: z.number(),
            })
          ),
        })
      ),
      oneShotPayment: z.object({ 
        installmentDate: z.string(),
        amountPayable: z.number(),
        scholarshipAmount: z.number(),
        OneShotPaymentAmount: z.number(),
        gstAmount: z.number(),
        baseFee: z.number(),
      })
    })
  ),
});

interface FeePreviewFormProps {
  onNext: () => void;
  onCohortCreated: (cohort: any) => void;
  initialData?: any;
}

export function FeePreviewForm({ onNext, onCohortCreated, initialData }: FeePreviewFormProps) {
  const [loading, setLoading] = useState(false);  
  const [newBaseFee, setNewBaseFee] = useState(initialData?.baseFee || 0);
  const [isGST, setIsGST] = useState(true);
  const [GSTAmount, setGSTAmount] = useState(1);
  const [withoutGSTAmount, setWithoutGSTAmount] = useState(1);
  const [editableDates, setEditableDates] = useState<Record<string, string>>({});
  const uniqueId = useId();

  // Pull scholarshipSlabs from litmusTestDetail
  const scholarshipSlabs =
    initialData?.litmusTestDetail?.[0]?.scholarshipSlabs?.map((slab: any, index: number) => ({
      ...slab,
      id: `${uniqueId}-${index}`, // unique ID
    })) || [];

  useEffect(() => {
    if (initialData?.isGSTIncluded === false) {
      setIsGST(false);
      setGSTAmount(1.18);
    } else {
      setWithoutGSTAmount(1.18);
    }
  }, [initialData]);

  // Handle date changes in the <input type="date">
  const handleDateChange = (semesterIndex: number, installmentIndex: number, newDate: string) => {
    setEditableDates((prev) => ({
      ...prev,
      [`${semesterIndex}-${installmentIndex}`]: newDate,
    }));
  };

  const formatAmount = (value: number | undefined) =>
    value !== undefined
      ? new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(value))
      : "--";

  const calculateInstallments = (semesterIndex: number, slab: any) => {
    const totalSemesters = initialData?.cohortFeesDetail?.semesters || 0;
    const installmentsPerSemester = initialData?.cohortFeesDetail?.installmentsPerSemester || 0;

    let installmentPercents: any;

      switch (installmentsPerSemester) {
        case '2':
          installmentPercents = [0.6, 0.4];
          break;
        case '3':
          installmentPercents = [0.4, 0.4, 0.2];
          break;
        case '4':
          installmentPercents = [0.3, 0.3, 0.3, 0.1];
          break;
        default:
          installmentPercents = Array.from({ length: installmentsPerSemester }, () => 1 / installmentsPerSemester);
          break;
      }    

    const startDate = new Date(initialData?.startDate);
    const endDate = new Date(initialData?.endDate);
    const daysBetween = differenceInDays(endDate, startDate);
    const monthsPerInstallment = daysBetween / (totalSemesters * installmentsPerSemester * 30);

    let remainingFee = newBaseFee;
    const perSemesterFee = remainingFee / totalSemesters;  

    let scholarshipAmount = newBaseFee * (slab.percentage / 100);

    // Build the installments
    const semesterInstallments = Array.from({ length: installmentsPerSemester }).map((_, i) => {
      const installmentAmount = perSemesterFee * installmentPercents[i];
      
      const defaultDate = format(
        add(startDate, {
          months: Math.round(monthsPerInstallment * (i + semesterIndex * installmentsPerSemester)),
        }),
        "yyyy-MM-dd"
      );
      const editableDateKey = `${semesterIndex}-${i}`;

      return {
        installmentAmount,
        scholarshipApplied: 0,
        installmentDate: editableDates[editableDateKey] || defaultDate,
        editableDateKey,
      };
    });

    if (semesterIndex === totalSemesters - 1) {
      for (let i = semesterInstallments.length - 1; i >= 0 && scholarshipAmount > 0; i--) {
        const installment = semesterInstallments[i];
        if (installment.installmentAmount >= scholarshipAmount) {
          installment.scholarshipApplied = scholarshipAmount;
          scholarshipAmount = 0;
        } else {
          installment.scholarshipApplied = installment.installmentAmount;
          scholarshipAmount -= installment.installmentAmount;
        }
      }
    }

    // Return array in the shape your UI or your final JSON expects
    return semesterInstallments.map((inst) => ({
      installmentDate: inst.installmentDate,
      baseFee: Math.round(inst.installmentAmount - inst.scholarshipApplied),
      amountPayable: Math.round(inst.installmentAmount - inst.scholarshipApplied),
      scholarshipPercentage: slab.percentage,
      scholarshipAmount: slab.percentage > 0 ? inst.scholarshipApplied : 0,
      // ...
    }));
  };

  const calculateSemesterSummary = (semesterIndex: number, slab: any) => {
    const installments = calculateInstallments(semesterIndex, slab);
    const totalInstallmentAmount = installments.reduce(
      (sum, i) => sum + i.amountPayable + i.scholarshipAmount,
      0
    );
    const totalScholarshipAmount = installments.reduce((sum, i) => sum + i.scholarshipAmount, 0);
    const totalpayableAmount =
      installments.reduce((sum, i) => sum + i.amountPayable * GSTAmount + i.scholarshipAmount, 0);

    return {
      totalInstallmentAmount,
      totalScholarshipAmount,
      totalpayableAmount,
    };
  };

  async function handleSubmit() {
    setLoading(true)
  try {
    const feeStructureDetails = scholarshipSlabs.map((slab: any) => ({
      scholarshipName: slab.name,
      scholarshipPercentage: slab.percentage,
      scholarshipClearance: slab.clearance,
      installmentDetails: Array.from({
        length: initialData?.cohortFeesDetail?.semesters || 0,
      }).map((_, semesterIndex) => ({
        semester: semesterIndex + 1,
        installments: calculateInstallments(semesterIndex, slab).map((installment) => ({
          installmentDate: installment.installmentDate,
          baseFee: installment.amountPayable,
          scholarshipAmount: installment.scholarshipAmount,
          amountPayable: installment.amountPayable * GSTAmount,
          verificationStatus: "pending",
          receiptUrls: [],
          feedback: [],
        })),
      })),
      oneShotPaymentDetails: {
        installmentDate: initialData?.startDate, // Example date
        baseFee: newBaseFee,
        OneShotPaymentAmount: newBaseFee * 0.01 * (initialData?.cohortFeesDetail?.oneShotDiscount || 0),
        amountPayable: (newBaseFee - newBaseFee * (slab.percentage * 0.01) - newBaseFee * 0.01 * (initialData?.cohortFeesDetail?.oneShotDiscount || 0))*GSTAmount,
        verificationStatus: "pending",
        receiptUrls: [],
        feedback: [],
      }
    }));

    feeStructureDetails.push({
      scholarshipName: "No Scholarship",
      scholarshipPercentage: 0,
      scholarshipClearance: "N/A",
      scholarshipDetails: Array.from({
        length: initialData?.cohortFeesDetail?.semesters || 0,
      }).map((_, semesterIndex) => ({
        semester: semesterIndex + 1,
        installments: calculateInstallments(semesterIndex, { percentage: 0 }).map((installment) => ({
          installmentDate: installment.installmentDate,
          baseFee: installment.amountPayable,
          scholarshipAmount: 0, // No scholarship for this case
          amountPayable: installment.amountPayable * GSTAmount,
          verificationStatus: "pending",
          receiptUrls: [],
          feedback: [],
        })),
      })),
      oneShotPaymentDetails: {
        installmentDate: initialData?.startDate,
        baseFee: newBaseFee,
        OneShotPaymentAmount: newBaseFee * 0.01 * (initialData?.cohortFeesDetail?.oneShotDiscount || 0), // No scholarship discount
        amountPayable: (newBaseFee - newBaseFee * 0.01 * (initialData?.cohortFeesDetail?.oneShotDiscount || 0)) * GSTAmount,
        verificationStatus: "pending",
        receiptUrls: [],
        feedback: [],
      },
    });
  
      const updated = await updateCohort(initialData._id, {
        feeStructureDetails: feeStructureDetails,
      });
      console.log("Cohort updated successfully:", updated);
      onCohortCreated(updated.data);
      onNext();
    } catch (error) {
      console.error("Failed to update cohort:", error);
    } finally {
      setLoading(false)
    }
  };


  return (
    <div className="max-h-[80vh] space-y-6 py-4">
      <Tabs defaultValue={scholarshipSlabs[0]?.id || "default"} className="space-y-4">
        <TabsList variant="ghost">
          <TabsTrigger variant="xs" value={'no-scholarship'}>No Scholarship (0%) </TabsTrigger>
          {scholarshipSlabs.map((slab: any) => (
            <TabsTrigger key={slab.id} variant="xs" value={slab.id}>
              {slab.name} ({slab.percentage}%)
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="no-scholarship">
          <Card className="mb-4">
            <Badge variant="success" className=" px-2 py-1 text-sm rounded-full m-4">
              Admission Fee
            </Badge>
            <CardContent className="flex flex-col">
              <div className="flex justify-between text-sm">
                <span>Amount:</span>
                <span className="font-bold">₹{formatAmount(initialData?.cohortFeesDetail?.tokenFee)}</span>
              </div>
            </CardContent>
          </Card>
          {Array.from({ length: initialData?.cohortFeesDetail?.semesters || 0 }).map((_, semesterIndex) => {
            const { totalInstallmentAmount, totalScholarshipAmount } = calculateSemesterSummary(semesterIndex, { percentage: 0 });
            return (
              <Card key={semesterIndex} className="mb-4">
                <Badge
                  variant="outline"
                  className="text-[#00A3FF] border-[#00A3FF] bg-[#00A3FF]/20 px-2 py-1 text-sm rounded-full m-4"
                >
                  Semester {semesterIndex + 1}
                </Badge>
                <CardContent className="flex flex-col gap-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Instalment Date</TableHead>
                        <TableHead>Base Amount (₹)</TableHead>
                        <TableHead>Amount Payable (₹)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {calculateInstallments(semesterIndex, { percentage: 0 }).map((installment, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex gap-2 items-center">
                              <input
                                type="date"
                                value={installment.installmentDate}
                                onChange={(e) =>
                                  handleDateChange(semesterIndex, index, e.target.value)
                                }
                                className="border rounded px-2 py-1 text-sm"
                              />
                            </div>
                          </TableCell>
                          <TableCell>{formatAmount(installment.amountPayable/withoutGSTAmount)}</TableCell>
                          <TableCell>{formatAmount(installment.amountPayable * GSTAmount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Instalment Amount:</span>
                      <span>₹{formatAmount(totalInstallmentAmount/withoutGSTAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>GST <span className="text-muted-foreground text-xs">(18%)</span>:</span>
                      {isGST ? 
                        <span>₹{formatAmount((totalInstallmentAmount - totalInstallmentAmount/withoutGSTAmount))}</span> :
                        <span>₹{formatAmount((totalInstallmentAmount)*0.18)}</span>
                      }
                    </div>
                    <div className="flex justify-between">
                      <span>Total Amount Payable:</span>
                      <span className="font-bold">₹{formatAmount(totalInstallmentAmount * GSTAmount)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        <Card className="mb-4">
        <Badge variant="outline" className="text-[#FF791F] border-[#FF791F] bg-[#FF791F]/20 px-2 py-1 text-sm rounded-full m-4">
          Overall Fee
        </Badge>
        <CardContent className="flex flex-col gap-2">
          <div className="flex justify-between text-sm border-b border-white/30 pb-2">
            <span>Admission Fee:</span>
            <span className=""> ₹{formatAmount(initialData?.cohortFeesDetail?.tokenFee)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total Fee Amount:</span>
            <span>₹{formatAmount(newBaseFee/withoutGSTAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>GST <span className="text-muted-foreground text-xs">(18%)</span>:</span>
            {isGST ? 
              <span>₹{formatAmount((newBaseFee - newBaseFee/withoutGSTAmount))}</span> :
              <span>₹{formatAmount((newBaseFee)*0.18)}</span>
            }
          </div>
          <div className="flex justify-between text-sm mt-4">
            <span>Total Amount Payable:</span>
            <span className="font-bold">₹{formatAmount((newBaseFee)*GSTAmount)}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="">
        <Badge variant="outline" className="text-[#FF791F] border-[#FF791F] bg-[#FF791F]/20 px-2 py-1 text-sm rounded-full m-4">
          One Shot Payment
        </Badge>
        <CardContent className="flex flex-col gap-2">
          <div className="flex justify-between text-sm border-b border-white/30 pb-2">
            <span>Admission Fee:</span>
            <span className="">₹{formatAmount(initialData?.cohortFeesDetail?.tokenFee)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total Fee Amount:</span>
            <span>₹{formatAmount(newBaseFee/withoutGSTAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>One Shot Payment Discount ({formatAmount(initialData?.cohortFeesDetail?.oneShotDiscount)}%):</span>
            <span className="text-red-500">- ₹{formatAmount(newBaseFee/withoutGSTAmount * 0.01 * (initialData?.cohortFeesDetail?.oneShotDiscount || 0))}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>GST <span className="text-muted-foreground text-xs">(18%)</span>:</span>
          {isGST ?
            <span>₹{formatAmount((newBaseFee/withoutGSTAmount - newBaseFee/withoutGSTAmount * 0.01 * (initialData?.cohortFeesDetail?.oneShotDiscount || 0))*0.18)}</span> :
            <span>₹{formatAmount((newBaseFee - newBaseFee * 0.01 * (initialData?.cohortFeesDetail?.oneShotDiscount || 0))*0.18)}</span>
          }
          </div>

          <div className="flex justify-between text-sm mt-4">
            <span>Total Amount Payable:</span>
            <span className="font-bold">₹{formatAmount((newBaseFee - newBaseFee * 0.01 * (initialData?.cohortFeesDetail?.oneShotDiscount || 0))*GSTAmount )}</span>
          </div>
        </CardContent>
      </Card>
      </TabsContent>

        {scholarshipSlabs.map((slab: any) => (
          <TabsContent key={slab.id} value={slab.id}>
            <Card className="mb-4">
              <Badge variant="success" className=" px-2 py-1 text-sm rounded-full m-4">
                Admission Fee
              </Badge>
              <CardContent className="flex flex-col">
                <div className="flex justify-between text-sm">
                  <span>Amount:</span>
                  <span className="font-bold">₹{formatAmount(initialData?.cohortFeesDetail?.tokenFee)}</span>
                </div>
              </CardContent>
            </Card>
            {Array.from({ length: initialData?.cohortFeesDetail?.semesters || 0 }).map((_, semesterIndex) => {
              const { totalInstallmentAmount, totalScholarshipAmount, totalpayableAmount } = calculateSemesterSummary(semesterIndex, slab);
              return (
                <Card key={semesterIndex} className="mb-4">
                  <Badge
                    variant="outline"
                    className="text-[#00A3FF] border-[#00A3FF] bg-[#00A3FF]/20 px-2 py-1 text-sm rounded-full m-4"
                  >
                    Semester {semesterIndex + 1}
                  </Badge>
                  <CardContent className="flex flex-col gap-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Instalment Date</TableHead>
                          <TableHead>Scholarship %</TableHead>
                          <TableHead>Scholarship Amount (₹)</TableHead>
                          <TableHead>Base Amt. (₹)</TableHead>
                          <TableHead>Amt. Payable <span className="text-[8px]">+ GST</span> (₹)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {calculateInstallments(semesterIndex, slab).map((installment, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="flex gap-2 items-center">
                                <input
                                  type="date"
                                  value={installment.installmentDate}
                                  onChange={(e) =>
                                    handleDateChange(semesterIndex, index, e.target.value)
                                  }
                                  className="border rounded px-2 py-1 text-sm"
                                />
                              </div>
                            </TableCell>
                            <TableCell>{installment.scholarshipAmount ? installment.scholarshipPercentage : '--'}</TableCell>
                            <TableCell>{installment.scholarshipAmount ? formatAmount(installment.scholarshipAmount) : '--'}</TableCell>
                            <TableCell>{formatAmount((installment.amountPayable + installment.scholarshipAmount)/withoutGSTAmount)}</TableCell>
                            <TableCell>{formatAmount(installment.amountPayable*GSTAmount)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Instalment Amount:</span>
                        <span>₹{formatAmount(totalInstallmentAmount/withoutGSTAmount)}</span>
                      </div>
                      {(!isGST || totalScholarshipAmount !==0) &&
                      <>
                      {totalScholarshipAmount !==0 && 
                      <div className="flex justify-between">
                        <span>Scholarship Amount ({slab.percentage}%):</span>
                        <span className="text-red-500">- ₹{formatAmount(totalScholarshipAmount)}</span>
                      </div>}
                      </>}
                      <div className="flex justify-between">
                        <span>GST <span className="text-muted-foreground text-xs">(18%)</span>:</span>
                        {isGST ?
                          <span>₹{formatAmount((totalInstallmentAmount - totalInstallmentAmount/withoutGSTAmount))}</span> :
                          <span>₹{formatAmount(((totalInstallmentAmount-totalScholarshipAmount)*0.18))}</span>
                        }
                      </div>
                      <div className="flex justify-between">
                        <span>Total Amount Payable:</span>
                        <span className="font-bold">₹{formatAmount(totalpayableAmount-totalScholarshipAmount)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          <Card className="mb-4">
            <Badge variant="outline" className="text-[#FF791F] border-[#FF791F] bg-[#FF791F]/20 px-2 py-1 text-sm rounded-full m-4">
              Overall Fee
            </Badge>
            <CardContent className="flex flex-col gap-2">
              <div className="flex justify-between text-sm border-b border-white/30 pb-2">
                <span>Admission Fee:</span>
                <span className=""> ₹{formatAmount(initialData?.cohortFeesDetail?.tokenFee)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Fee Amount:</span>
                <span>₹{formatAmount(newBaseFee/withoutGSTAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Scholarship Amount (5%):</span>
                <span className="text-red-500">- ₹{formatAmount(newBaseFee * (slab.percentage/100))}</span>
              </div>
              {!isGST && <div className="flex justify-between text-sm">
                <span>GST <span className="text-muted-foreground text-xs">(18%)</span>:</span>
                <span>₹{formatAmount((newBaseFee - newBaseFee * (slab.percentage/100))*0.18)}</span>
              </div>}
              <div className="flex justify-between text-sm mt-4">
                <span>Total Amount Payable:</span>
                <span className="font-bold">₹{formatAmount((newBaseFee - newBaseFee * (slab.percentage/100))*GSTAmount)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="">
            <Badge variant="outline" className="text-[#FF791F] border-[#FF791F] bg-[#FF791F]/20 px-2 py-1 text-sm rounded-full m-4">
              One Shot Payment
            </Badge>
            <CardContent className="flex flex-col gap-2">
              <div className="flex justify-between text-sm border-b border-white/30 pb-2">
                <span>Admission Fee:</span>
                <span className="">₹{formatAmount(initialData?.cohortFeesDetail?.tokenFee)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Fee Amount:</span>
                <span>₹{formatAmount(newBaseFee/withoutGSTAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Scholarship Amount (5%):</span>
                <span className="text-red-500">- ₹{formatAmount(newBaseFee * (slab.percentage/100))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>One Shot Payment Discount ({formatAmount(initialData?.cohortFeesDetail?.oneShotDiscount)}%):</span>
                <span className="text-red-500">- ₹{formatAmount(newBaseFee * 0.01 * (initialData?.cohortFeesDetail?.oneShotDiscount || 0))}</span>
              </div>
              {!isGST && <div className="flex justify-between text-sm">
                <span>GST <span className="text-muted-foreground text-xs">(18%)</span>:</span>
                <span>₹{formatAmount((newBaseFee - newBaseFee * (slab.percentage/100) - newBaseFee * 0.01 * (initialData?.cohortFeesDetail?.oneShotDiscount || 0))*0.18)}</span>
              </div>}

              <div className="flex justify-between text-sm mt-4">
                <span>Total Amount Payable:</span>
                <span className="font-bold">₹{formatAmount((newBaseFee - newBaseFee * (slab.percentage/100) - newBaseFee * 0.01 * (initialData?.cohortFeesDetail?.oneShotDiscount || 0))*GSTAmount )}</span>
              </div>
            </CardContent>
          </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Button type="button" onClick={handleSubmit} disabled={loading} className="w-full">
        Save & Update Cohort
      </Button>
    </div>
  );
}
