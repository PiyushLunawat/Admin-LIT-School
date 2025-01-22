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
import { add, format } from "date-fns";

interface FeePreviewFormProps {
  onNext: () => void;
  initialData?: any;
}

export function FeePreviewForm({ onNext, initialData }: FeePreviewFormProps) {

  const [newBaseFee, setNewBaseFee] = useState(initialData?.baseFee || 0);

  useEffect(() => {
    if (initialData?.isGSTIncluded === false) {
      setNewBaseFee(initialData.baseFee * 1.18);
    }
  }, [initialData]);

  const scholarshipSlabs = initialData?.litmusTestDetail?.[0].scholarshipSlabs || [];
console.log("dsdv",scholarshipSlabs)

const formatAmount = (value: number | undefined) =>
  value !== undefined
    ? new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(value))
    : "--";

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
          {Array.from({ length: initialData?.cohortFeesDetail?.semesters || 0 }).map((_, semesterIndex) => (
            <Card key={semesterIndex} className="mb-4">
              <Badge variant="outline" className="text-[#00A3FF] border-[#00A3FF] bg-[#00A3FF]/20 px-2 py-1 text-sm rounded-full m-4">
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
                    {Array.from({ length: initialData?.cohortFeesDetail?.installmentsPerSemester || 0 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex gap-2 items-center">
                            <Calendar className="w-4 h-4"/>
                            {initialData?.startDate ? format(add(new Date(initialData.startDate), { months: (index+semesterIndex)*3 }), "dd/MM/yyyy") : "--"} 
                          </div>
                        </TableCell>
                        <TableCell>{slab.percentage}</TableCell>
                        <TableCell>{formatAmount((newBaseFee * (slab.percentage/100) / (initialData?.cohortFeesDetail?.semesters || 1) / (initialData?.cohortFeesDetail?.installmentsPerSemester || 1)))}</TableCell>
                        <TableCell>{formatAmount((newBaseFee / (initialData?.cohortFeesDetail?.semesters || 1) / (initialData?.cohortFeesDetail?.installmentsPerSemester || 1)))}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Instalment Amount:</span>
                    <span>₹{formatAmount(newBaseFee / (initialData?.cohortFeesDetail?.semesters || 1))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Scholarship Amount (5%):</span>
                    <span className="text-red-500">- ₹{formatAmount(newBaseFee * (slab.percentage/100) / (initialData?.cohortFeesDetail?.semesters || 1))}</span>
                  </div>
                  {semesterIndex === 0 && <div className="flex justify-between text-sm">
                    <span>Admission Fee Amount:</span>
                    <span className="text-red-500">- ₹{formatAmount(initialData?.cohortFeesDetail?.tokenFee)}</span>
                  </div>}
                </div>
              </CardContent>
            </Card>
          ))}

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
                <span>Admission Fee Amount:</span>
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
                <span>Admission Fee Amount:</span>
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

      <Button onClick={onNext} className="w-full">
        Next: Collaborators
      </Button>
    </div>
  );
}
