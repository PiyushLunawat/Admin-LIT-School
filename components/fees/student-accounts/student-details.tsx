"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Mail,
  MessageSquare,
  UserMinus,
  X,
  Download,
  CreditCard,
} from "lucide-react";

interface StudentDetailsProps {
  studentId: string;
  onClose: () => void;
}

export function StudentDetails({ studentId, onClose }: StudentDetailsProps) {
  // In a real application, this data would be fetched based on the studentId
  const student = {
    id: studentId,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    program: "Creator Marketer",
    cohort: "CM01JY",
    totalFees: "₹9,95,000",
    paidAmount: "₹4,97,500",
    nextDueDate: "2024-03-25",
    status: "Current",
    paymentSchedule: [
      {
        type: "Token Fee",
        amount: "₹50,000",
        dueDate: "2024-01-15",
        status: "Paid",
        paidDate: "2024-01-14",
      },
      {
        type: "Instalment 1",
        amount: "₹1,65,833",
        dueDate: "2024-02-15",
        status: "Paid",
        paidDate: "2024-02-14",
      },
      {
        type: "Instalment 2",
        amount: "₹1,65,833",
        dueDate: "2024-03-15",
        status: "Pending",
      },
    ],
    communications: [
      {
        type: "Payment Reminder",
        date: "2024-03-10",
        message: "Reminder for upcoming instalment due on March 15",
      },
    ],
  };

  const calculateProgress = (paid: string, total: string): number => {
    const paidAmount = parseInt(paid.replace(/[^0-9]/g, ""));
    const totalAmount = parseInt(total.replace(/[^0-9]/g, ""));
    return (paidAmount / totalAmount) * 100;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{student.name}</h3>
          <p className="text-sm text-muted-foreground">{student.email}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* Account Overview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Account Overview</h4>
              <Badge>{student.status}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Program</p>
                <p className="font-medium">{student.program}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cohort</p>
                <p className="font-medium">{student.cohort}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Payment Progress</span>
                <span>{student.paidAmount} / {student.totalFees}</span>
              </div>
              <Progress states={[ {value:(calculateProgress(student.paidAmount, student.totalFees))} ]} />
            </div>
          </div>

          <Separator />

          {/* Quick Actions */}
          <div className="space-y-2">
            <h4 className="font-medium">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="justify-start">
                <CreditCard className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
              <Button variant="outline" className="justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Send Reminder
              </Button>
              <Button variant="outline" className="justify-start">
                <Download className="h-4 w-4 mr-2" />
                Download Statement
              </Button>
              <Button variant="outline" className="justify-start text-destructive">
                <UserMinus className="h-4 w-4 mr-2" />
                Mark as Dropped
              </Button>
            </div>
          </div>

          <Separator />

          {/* Payment Schedule */}
          <div className="space-y-4">
            <h4 className="font-medium">Payment Schedule</h4>
            {student.paymentSchedule.map((payment, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{payment.type}</p>
                    <p className="text-sm text-muted-foreground">
                      Due: {new Date(payment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline">{payment.amount}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <Badge 
                    variant={payment.status === "Paid" ? "success" : "secondary"}
                  >
                    {payment.status}
                  </Badge>
                  {payment.paidDate && (
                    <p className="text-sm text-muted-foreground">
                      Paid on {new Date(payment.paidDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Communication History */}
          <div className="space-y-4">
            <h4 className="font-medium">Communication History</h4>
            {student.communications.map((comm, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <Badge variant="secondary">{comm.type}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(comm.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm">{comm.message}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}