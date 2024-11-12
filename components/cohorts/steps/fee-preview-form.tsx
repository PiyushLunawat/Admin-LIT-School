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

interface FeePreviewFormProps {
  onNext: () => void;
  initialData?: any;
}

export function FeePreviewForm({ onNext }: FeePreviewFormProps) {
  const feeSchedule = [
    {
      date: "22-Sep-2024",
      scholarship: "5",
      scholarshipamount: "10,000",
      amount: "99,472.22",
    },
    {
      date: "22-Oct-2024",
      scholarship: "5",
      scholarshipamount: "10,000",
      amount: "99,472.22",
    },
    {
      date: "22-Nov-2024",
      scholarship: "5",
      scholarshipamount: "10,000",
      amount: "99,472.22",
    },
  ];

  return (
    <div className="max-h-[80vh] overflow-y-auto space-y-6 py-4">
      <Tabs defaultValue="effort_excellence" className="space-y-4">
        <TabsList variant='ghost'>
          <TabsTrigger variant='xs' value="effort_excellence">Effort Excellence (5%)</TabsTrigger>
          <TabsTrigger variant='xs' value="strategic_scholar">Strategic Scholar (8%)</TabsTrigger>
          <TabsTrigger variant='xs' value="innovative_initiator">Innovative Initiator (12%)</TabsTrigger>
          <TabsTrigger variant='xs' value="creative_crusader">Creative Crusader (15%)</TabsTrigger>
        </TabsList>
        <TabsContent value="effort_excellence">

    <Card className="mb-4">
        <Badge variant="outline" className="text-[#00A3FF] border-[#00A3FF] bg-[#00A3FF]/20 px-2 py-1 text-sm rounded-full m-4">
          Semester 01
        </Badge>
        <CardContent className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Instalment Date</TableHead>
            <TableHead>Scholarship %</TableHead>
            <TableHead>Scholarship Amount (₹)</TableHead>
            <TableHead >Amount Payable (₹)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feeSchedule.map((fee, index) => (
            <TableRow key={index}>
              <TableCell>{fee.date}</TableCell>
              <TableCell>{fee.scholarship}</TableCell>
              <TableCell >{fee.scholarshipamount}</TableCell>
              <TableCell >{fee.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Total Instalment Amount:</span>
          <span>₹8,95,250</span>
        </div>
        <div className="flex justify-between">
          <span>Scholarship Amount (5%):</span>
          <span>₹49,750</span>
        </div>
      </div>
      </CardContent>
      </Card>

      <Card className="mb-4">
        <Badge variant="outline" className="text-[#FF791F] border-[#FF791F] bg-[#FF791F]/20 px-2 py-1 text-sm rounded-full m-4">
          Overall Fee
        </Badge>
        <CardContent className="flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span>Total Fee Amount:</span>
          <span>₹ 55,000</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Total Scholarship Amount (5%):</span>
          <span className="text-red-500">- ₹ 2,750</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Token Amount:</span>
          <span>₹ 55,000</span>
        </div>

        <div className="flex justify-between text-sm mt-4">
          <span>Total Amount Payable:</span>
          <span>₹ 59,000</span>
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
          <span>₹ 55,000</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Total Scholarship Amount (5%):</span>
          <span className="text-red-500">- ₹ 2,750</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>One Shot Payment Discount (10%):</span>
          <span className="text-red-500">- ₹ 5,750</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Token Amount:</span>
          <span>₹ 55,000</span>
        </div>

        <div className="flex justify-between text-sm mt-4">
          <span>Total Amount Payable:</span>
          <span>₹ 59,000</span>
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