// FeePreviewForm Component
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
import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { add, format, differenceInDays } from "date-fns";

interface FeePreviewFormProps {
  onNext: () => void;
  initialData?: any;
}

export function FeePreviewForm({ onNext, initialData }: FeePreviewFormProps) {
  const [newBaseFee, setNewBaseFee] = useState(initialData?.baseFee || 0);
  const [editableDates, setEditableDates] = useState<any>({});

  useEffect(() => {
    if (initialData?.isGSTIncluded === false) {
      setNewBaseFee(initialData.baseFee * 1.18);
    }
  }, [initialData]);

  const formatAmount = (value: number | undefined) =>
    value !== undefined
      ? new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(value))
      : "--";

  const handleDateChange = (semesterIndex: number, installmentIndex: number, newDate: string) => {
    setEditableDates((prev: any) => ({
      ...prev,
      [`${semesterIndex}-${installmentIndex}`]: newDate,
    }));
  };

  const calculateInstallments = (semesterIndex: number, slab: any) => {
    const feeDetails: { installmentDate: any; scholarshipPercentage: any; scholarshipAmount: number; amountPayable: number; editableDateKey: string; }[] = [];
    const totalSemesters = initialData?.cohortFeesDetail?.semesters || 0;
    const installmentsPerSemester = initialData?.cohortFeesDetail?.installmentsPerSemester || 0;
    const installmentPercents = installmentsPerSemester === 2 ? [0.6, 0.4] : [0.4, 0.4, 0.2];
    const startDate = new Date(initialData?.startDate);
    const endDate = new Date(initialData?.endDate);
    const daysBetween = differenceInDays(endDate, startDate);
    const monthsPerInstallment = daysBetween / (totalSemesters * installmentsPerSemester * 30);

    let remainingFee = newBaseFee - initialData?.cohortFeesDetail?.tokenFee;
    const perSemesterFee = remainingFee / totalSemesters;
    let scholarshipAmount = remainingFee * (slab.percentage / 100);

    // Calculate installments for the semester
    const semesterInstallments = Array.from({ length: installmentsPerSemester }).map((_, i) => {
      const installmentAmount = perSemesterFee * installmentPercents[i];
      const defaultDate = format(
        add(startDate, { months: Math.round(monthsPerInstallment * (i + semesterIndex * installmentsPerSemester)) }),
        "yyyy-MM-dd"
      );
      const editableDateKey = `${semesterIndex}-${i}`;

      return {
        installmentAmount,
        scholarshipApplied: 0, // Will be adjusted later
        installmentDate: editableDates[editableDateKey] || defaultDate,
        editableDateKey,
      };
    });

    // Deduct scholarship starting from the last installment of the last semester
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

    // Map the updated installments to feeDetails
    semesterInstallments.forEach((installment, i) => {
      feeDetails.push({
        installmentDate: installment.installmentDate,
        scholarshipPercentage: slab.percentage,
        scholarshipAmount: slab.percentage > 0 ? installment.scholarshipApplied : 0,
        amountPayable: installment.installmentAmount - installment.scholarshipApplied,
        editableDateKey: installment.editableDateKey,
      });
    });

    return feeDetails;
  };

  const calculateSemesterSummary = (semesterIndex: number, slab: any) => {
    const installments = calculateInstallments(semesterIndex, slab);
    const totalInstallmentAmount = installments.reduce((sum, inst) => sum + inst.amountPayable + inst.scholarshipAmount, 0);
    const totalScholarshipAmount = installments.reduce((sum, inst) => sum + inst.scholarshipAmount, 0);
  
    return {
      totalInstallmentAmount,
      totalScholarshipAmount,
    };
  };

  const scholarshipSlabs = initialData?.litmusTestDetail?.[0].scholarshipSlabs || [];

  const logInstallmentDetails = () => {
    const allInstallments = scholarshipSlabs.map((slab: any) => {
      return {
        slabName: slab.name,
        slabPercentage: slab.percentage,
        installments: Array.from({ length: initialData?.cohortFeesDetail?.semesters || 0 }).map((_, semesterIndex) => {
          return calculateInstallments(semesterIndex, slab);
        }),
      };
    });

    const zeroScholarshipSlab = { percentage: 0, name: "0% Scholarship" };
    const zeroScholarshipInstallments = {
      slabName: "0% Scholarship",
      slabPercentage: 0,
      installments: Array.from({ length: initialData?.cohortFeesDetail?.semesters || 0 }).map((_, semesterIndex) => {
        return calculateInstallments(semesterIndex, zeroScholarshipSlab);
      }),
    }

    allInstallments.push({ zeroScholarshipInstallments });
    console.log("All Semester Installments:", allInstallments);
  };

  return (
    <div className="max-h-[80vh] space-y-6 py-4">
      <Tabs defaultValue={scholarshipSlabs[0]?.id || "default"} className="space-y-4">
        <TabsList variant="ghost">
          {scholarshipSlabs.map((slab: any) => (
            <TabsTrigger key={slab.id} variant="xs" value={slab.id}>
              {slab.name} ({slab.percentage}%)
            </TabsTrigger>
          ))}
        </TabsList>
        {scholarshipSlabs.map((slab: any) => (
          <TabsContent key={slab.id} value={slab.id}>
            {Array.from({ length: initialData?.cohortFeesDetail?.semesters || 0 }).map((_, semesterIndex) => {
              const { totalInstallmentAmount, totalScholarshipAmount } = calculateSemesterSummary(semesterIndex, slab);
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
                          <TableHead>Amount Payable (₹)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {calculateInstallments(semesterIndex, slab).map((installment, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="flex gap-2 items-center">
                                <Calendar className="w-4 h-4" />
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
                            <TableCell>{formatAmount(installment.amountPayable)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="space-y-2">
                      {totalScholarshipAmount !==0 &&
                      <>
                      <div className="flex justify-between">
                        <span>Total Instalment Amount:</span>
                        <span>₹{formatAmount(totalInstallmentAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Scholarship Amount ({slab.percentage}%):</span>
                        <span className="text-red-500">- ₹{formatAmount(totalScholarshipAmount)}</span>
                      </div>
                      </>}
                      <div className="flex justify-between">
                        <span>Total Amount Payable:</span>
                        <span className="">₹{formatAmount(totalInstallmentAmount-totalScholarshipAmount)}</span>
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
              <div className="flex justify-between text-sm">
                <span>Total Fee Amount:</span>
                <span>₹{formatAmount(newBaseFee)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Scholarship Amount (5%):</span>
                <span className="text-red-500">- ₹{formatAmount(newBaseFee * (slab.percentage/100))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Token Amount:</span>
                <span className="text-red-500">- ₹{formatAmount(initialData?.cohortFeesDetail?.tokenFee)}</span>
              </div>

              <div className="flex justify-between text-sm mt-4">
                <span>Total Amount Payable:</span>
                <span>₹{formatAmount(newBaseFee - (initialData?.cohortFeesDetail?.tokenFee || 0) - newBaseFee * (slab.percentage/100))}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="">
            <Badge variant="outline" className="text-[#FF791F] border-[#FF791F] bg-[#FF791F]/20 px-2 py-1 text-sm rounded-full m-4">
              One Shot Payment
            </Badge>
            <CardContent className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span>Total Fee Amount:</span>
                <span>₹{formatAmount(newBaseFee)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Scholarship Amount (5%):</span>
                <span className="text-red-500">- ₹{formatAmount(newBaseFee * (slab.percentage/100))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>One Shot Payment Discount ({formatAmount(initialData?.cohortFeesDetail?.oneShotDiscount)}%):</span>
                <span className="text-red-500">- ₹{formatAmount(newBaseFee * 0.01 * (initialData?.cohortFeesDetail?.oneShotDiscount || 0))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Token Amount:</span>
                <span className="text-red-500">- ₹{formatAmount(initialData?.cohortFeesDetail?.tokenFee)}</span>
              </div>

              <div className="flex justify-between text-sm mt-4">
                <span>Total Amount Payable:</span>
                <span>₹{formatAmount(newBaseFee - (initialData?.cohortFeesDetail?.tokenFee || 0) - newBaseFee * (slab.percentage/100) - newBaseFee * 0.01 * (initialData?.cohortFeesDetail?.oneShotDiscount || 0))}</span>
              </div>
            </CardContent>
          </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Button onClick={logInstallmentDetails} className="w-full">
        Log Installment Details
      </Button>
    </div>
  );
}
