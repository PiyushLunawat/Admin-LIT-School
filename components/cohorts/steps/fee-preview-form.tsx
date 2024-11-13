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

interface FeePreviewFormProps {
  onNext: () => void;
  initialData?: any;
}

export function FeePreviewForm({ onNext, initialData }: FeePreviewFormProps) {

  return (
    <div className="max-h-[80vh] overflow-y-auto space-y-6 py-4">
      <Tabs defaultValue="effort_excellence" className="space-y-4">
        <TabsList variant="ghost">
          <TabsTrigger variant="xs" value="effort_excellence">Effort Excellence (5%)</TabsTrigger>
          <TabsTrigger variant="xs" value="strategic_scholar">Strategic Scholar (8%)</TabsTrigger>
          <TabsTrigger variant="xs" value="innovative_initiator">Innovative Initiator (12%)</TabsTrigger>
          <TabsTrigger variant="xs" value="creative_crusader">Creative Crusader (15%)</TabsTrigger>
        </TabsList>
        <TabsContent value="effort_excellence">
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
                      <TableCell>22-Oct-2024</TableCell>
                      <TableCell>5</TableCell>
                      <TableCell>{((initialData?.baseFee*(0.05)/initialData?.cohortFeesDetail?.semesters)/initialData?.cohortFeesDetail?.installmentsPerSemester).toFixed(2)}</TableCell>
                      <TableCell>{(((initialData?.baseFee)/(initialData?.cohortFeesDetail?.semesters))/initialData?.cohortFeesDetail?.installmentsPerSemester).toFixed(2) || "--"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Instalment Amount:</span>
                  <span>₹{((initialData?.baseFee)/(initialData?.cohortFeesDetail?.semesters)).toFixed(2) || "--"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Scholarship Amount ({5}%):</span>
                  <span className="text-red-500">- ₹{(initialData?.baseFee*(0.05)/initialData?.cohortFeesDetail?.semesters).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>))}

          <Card className="mb-4">
            <Badge variant="outline" className="text-[#FF791F] border-[#FF791F] bg-[#FF791F]/20 px-2 py-1 text-sm rounded-full m-4">
              Overall Fee
            </Badge>
            <CardContent className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span>Total Fee Amount:</span>
                <span>₹{initialData?.baseFee}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Scholarship Amount ({5}%):</span>
                <span className="text-red-500">- ₹{initialData?.baseFee*(0.05)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Token Amount:</span>
                <span>₹{initialData?.cohortFeesDetail?.tokenFee}</span>
              </div>

              <div className="flex justify-between text-sm mt-4">
                <span>Total Amount Payable:</span>
                <span>₹{initialData?.baseFee + initialData?.cohortFeesDetail?.tokenFee - initialData?.baseFee*(0.05)}</span>
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
                <span>₹{initialData?.baseFee}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Scholarship Amount (5%):</span>
                <span className="text-red-500">- ₹{initialData?.baseFee*(0.05)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>One Shot Payment Discount ({initialData?.cohortFeesDetail?.oneShotDiscount}%):</span>
                <span className="text-red-500">- ₹{initialData?.baseFee*(0.01)*initialData?.cohortFeesDetail?.oneShotDiscount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Token Amount:</span>
                <span>₹{initialData?.cohortFeesDetail?.tokenFee}</span>
              </div>

              <div className="flex justify-between text-sm mt-4">
                <span>Total Amount Payable:</span>
                <span>₹{initialData?.baseFee + initialData?.cohortFeesDetail?.tokenFee
                  - initialData?.baseFee*(0.05) - initialData?.baseFee*(0.01)*initialData?.cohortFeesDetail?.oneShotDiscount}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button onClick={onNext} className="w-full">
        Next: Collaborators
      </Button>
    </div>
  );
}
