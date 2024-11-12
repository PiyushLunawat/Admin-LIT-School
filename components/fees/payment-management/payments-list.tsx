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
import { Calendar, Eye } from "lucide-react";

interface PaymentsListProps {
  onPaymentSelect: (id: string) => void;
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
}

export function PaymentsList({
  onPaymentSelect,
  selectedIds,
  onSelectedIdsChange,
}: PaymentsListProps) {
  const payments = [
    {
      id: "1",
      studentName: "John Doe",
      paymentId: "PAY001",
      amount: "₹1,65,833",
      type: "Instalment",
      dueDate: "2024-03-25",
      status: "Pending",
    },
    {
      id: "2",
      studentName: "Jane Smith",
      paymentId: "PAY002",
      amount: "₹9,95,000",
      type: "One-Shot",
      dueDate: "2024-03-20",
      status: "Completed",
    },
    {
      id: "3",
      studentName: "Mike Johnson",
      paymentId: "PAY003",
      amount: "₹1,65,833",
      type: "Instalment",
      dueDate: "2024-03-15",
      status: "Overdue",
    },
  ];

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "overdue":
        return "destructive";
      default:
        return "secondary";
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
            <TableHead>Payment ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow 
              key={payment.id}
              className="cursor-pointer"
              onClick={() => onPaymentSelect(payment.id)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedIds.includes(payment.id)}
                  onCheckedChange={() => toggleSelectPayment(payment.id)}
                />
              </TableCell>
              <TableCell className="font-medium">{payment.studentName}</TableCell>
              <TableCell>{payment.paymentId}</TableCell>
              <TableCell>{payment.amount}</TableCell>
              <TableCell>
                <Badge variant="outline">{payment.type}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(payment.dueDate).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(payment.status)}>
                  {payment.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPaymentSelect(payment.id);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}