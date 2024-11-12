"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Mail,
  MessageSquare,
  UserMinus,
  X,
  Upload,
  Download,
  CreditCard,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentDetailsProps {
  paymentId: string;
  onClose: () => void;
}

export function PaymentDetails({ paymentId, onClose }: PaymentDetailsProps) {
  // In a real application, this data would be fetched based on the paymentId
  const payment = {
    id: paymentId,
    studentName: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    amount: "₹1,65,833",
    type: "Instalment",
    dueDate: "2024-03-25",
    status: "Pending",
    paymentHistory: [
      {
        date: "2024-03-15",
        amount: "₹1,65,833",
        type: "First Instalment",
        status: "Completed",
      },
      {
        date: "2024-02-15",
        amount: "₹50,000",
        type: "Token Fee",
        status: "Completed",
      },
    ],
    communications: [
      {
        type: "Reminder",
        date: "2024-03-20",
        message: "Payment reminder for upcoming instalment",
      },
    ],
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{payment.studentName}</h3>
          <p className="text-sm text-muted-foreground">{payment.email}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* Payment Details */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Payment Details</h4>
              <Badge>{payment.status}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-medium">{payment.amount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium">{payment.type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(payment.dueDate).toLocaleDateString()}
                </div>
              </div>
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
                <Upload className="h-4 w-4 mr-2" />
                Upload Receipt
              </Button>
              <Button variant="outline" className="justify-start text-destructive">
                <UserMinus className="h-4 w-4 mr-2" />
                Mark as Dropped
              </Button>
            </div>
          </div>

          <Separator />

          {/* Payment History */}
          <div className="space-y-4">
            <h4 className="font-medium">Payment History</h4>
            {payment.paymentHistory.map((record, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{record.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(record.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline">{record.amount}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <Badge variant="success">{record.status}</Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Receipt
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Communication History */}
          <div className="space-y-4">
            <h4 className="font-medium">Communication History</h4>
            {payment.communications.map((comm, index) => (
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
            <Textarea placeholder="Add a note..." />
            <Button className="w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}