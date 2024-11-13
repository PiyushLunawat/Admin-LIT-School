"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, Mail } from "lucide-react";

type BadgeVariant = "destructive" | "warning" | "secondary" | "success" | "default";
interface PaymentRecord {
  id: string;
  studentName: string;
  paymentPlan: "One-Shot" | "Instalments";
  tokenPaid: boolean;
  instalmentsPaid: number;
  totalInstalments: number;
  nextDueDate?: string;
  status: "On Time" | "Overdue" | "Complete";
  scholarship?: string;
}

interface PaymentsListProps {
  cohortId: string;
  onStudentSelect: (id: string) => void;
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
}

export function PaymentsList({
  cohortId,
  onStudentSelect,
  selectedIds,
  onSelectedIdsChange,
}: PaymentsListProps) {
  // In a real application, this data would be fetched based on the cohortId
  const payments: PaymentRecord[] = [
    {
      id: "1",
      studentName: "John Doe",
      paymentPlan: "Instalments",
      tokenPaid: true,
      instalmentsPaid: 2,
      totalInstalments: 6,
      nextDueDate: "2024-04-15",
      status: "On Time",
      scholarship: "Smart Mouth (5%)",
    },
    {
      id: "2",
      studentName: "Jane Smith",
      paymentPlan: "One-Shot",
      tokenPaid: true,
      instalmentsPaid: 1,
      totalInstalments: 1,
      status: "Complete",
    },
    {
      id: "3",
      studentName: "Mike Johnson",
      paymentPlan: "Instalments",
      tokenPaid: true,
      instalmentsPaid: 1,
      totalInstalments: 6,
      nextDueDate: "2024-03-30",
      status: "Overdue",
      scholarship: "Smart Ass (8%)",
    },
  ];

  const getStatusColor = (status: PaymentRecord["status"]): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "on time":
        return "success";
      case "overdue":
        return "warning";
      case "complete":
        return "secondary";
      default:
        return "default";
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === payments.length) {
      onSelectedIdsChange([]);
    } else {
      onSelectedIdsChange(payments.map(payment => payment.id));
    }
  };

  const toggleSelectPayment = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectedIdsChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onSelectedIdsChange([...selectedIds, id]);
    }
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedIds.length === payments.length}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Next Due</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow 
              key={payment.id}
              className="cursor-pointer"
              onClick={() => onStudentSelect(payment.id)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedIds.includes(payment.id)}
                  onCheckedChange={() => toggleSelectPayment(payment.id)}
                />
              </TableCell>
              <TableCell className="font-medium">{payment.studentName}</TableCell>
              <TableCell>{payment.paymentPlan}</TableCell>
              <TableCell>
                {payment.instalmentsPaid}/{payment.totalInstalments} Instalments
              </TableCell>
              <TableCell>
                {payment.nextDueDate ? (
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(payment.nextDueDate).toLocaleDateString()}
                  </div>
                ) : "--"}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(payment.status)}>
                  {payment.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStudentSelect(payment.id);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Send reminder to:", payment.id);
                    }}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}