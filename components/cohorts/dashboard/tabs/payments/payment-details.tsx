"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  MessageSquare,
  UserMinus,
  X,
  Upload,
  Download,
  Calendar,
  UploadIcon,
  StarIcon,
  DownloadIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MarkedAsDialog } from "@/components/students/sections/drop-dialog";
import { useState } from "react";

type BadgeVariant = "destructive" | "warning" | "secondary" | "success" | "default";
interface PaymentDetailsProps {
  studentId: string;
  onClose: () => void;
}

export function PaymentDetails({ studentId, onClose }: PaymentDetailsProps) {
  const [markedAsDialogOpen, setMarkedAsDialogOpen] = useState(false)

  const payment = {
    id: studentId,
    studentName: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    paymentPlan: "Instalments",
    totalAmount: "₹9,95,000",
    paidAmount: "₹4,97,500",
    scholarship: "Smart Mouth (5%)",
    scholarshipAmount: "₹49,750",
    tokenAmount: "₹50,000",
    tokenPaid: true,
    instalments: [
      {
        number: 1,
        amount: "₹1,65,833",
        dueDate: "2024-02-15",
        status: "Paid",
        paidDate: "2024-02-14",
        receipt: "receipt-001.pdf",
      },
      {
        number: 2,
        amount: "₹1,65,833",
        dueDate: "2024-03-15",
        status: "Paid",
        paidDate: "2024-03-13",
        receipt: "receipt-002.pdf",
      },
      {
        number: 3,
        amount: "₹1,65,833",
        dueDate: "2024-04-15",
        status: "Pending",
      },
    ],
    communications: [
      {
        type: "Reminder",
        date: "2024-03-20",
        message: "Email Payment reminder for 3rd instalment",
      },
      {
        type: "Reminder",
        date: "2024-03-20",
        message: "WhatsApp payment reminder for 5th instalment",
      },
    ],
  };

  const getStatusColor = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "overdue":
        return "destructive";
      default:
        return "default";
    }
  };

  const progressPercentage = 
    (payment.instalments.filter(i => i.status === "Paid").length / 
    payment.instalments.length) * 100;

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
          {/* Payment Overview */}
          <div className="space-y-2">
            <h4 className="font-medium">Payment Overview</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-medium">{payment.totalAmount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paid Amount</p>
                <p className="font-medium">{payment.paidAmount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scholarship</p>
                <p className="font-medium">{payment.scholarship}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Token Status</p>
                <span className="text-base mr-2">{payment.tokenAmount}</span><Badge variant={payment.tokenPaid ? "success" : "destructive"}>
                  {payment.tokenPaid ? "Paid" : "Pending"}
                </Badge>
              </div>
            </div>
            <div className="space-y-1 mt-2">
              <div className="flex justify-between text-sm">
                <span>Payment Progress</span>
                <span>{progressPercentage.toFixed(0)}%</span>
              </div>
              <Progress states={[
                { value: 0, widt: progressPercentage, color: '#2EB88A' }
              ]} />
            </div>
          </div>

          <Separator />

          {/* Quick Actions */}
          <div className="space-y-2">
            <h4 className="font-medium">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Presen...
              </Button>
              <Button variant="outline" className="justify-start">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download Files
              </Button>
              <Button variant="outline" className="justify-start">
                <StarIcon className="h-4 w-4 mr-2" />
                Award Scholarship
              </Button>
              <Button variant="outline" className="justify-start text-destructive" onClick={()=>setMarkedAsDialogOpen(true)}>
                    <UserMinus className="h-4 w-4 mr-2" />
                    Mark as Dropped
                  </Button>

                  <Dialog open={markedAsDialogOpen} onOpenChange={setMarkedAsDialogOpen}>
        <DialogContent className="max-w-4xl py-4 px-6">
          <MarkedAsDialog student={payment}/>
        </DialogContent>
      </Dialog>
            </div>
          </div>

          <Separator />

          {/* Instalments */}
          <div className="space-y-4">
            <h4 className="font-medium">Payment Schedule</h4>
            {payment.instalments.map((instalment, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium">Instalment {instalment.number}</h5>
                    <p className="text-xs text-[#00A3FF]">Semester 01</p>
                  </div>
                  <Badge variant={getStatusColor(instalment.status)}>
                    {instalment.status}
                  </Badge>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Amount: {instalment.amount}</p>
                    <p className="text-xs text-muted-foreground">Scholarship Waiver: ₹15,000.00</p>
                    <p className="text-xs text-muted-foreground">Instalment Amount: ₹1,20,000.00</p>
                  </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Due: {new Date(instalment.dueDate).toLocaleDateString()}
                </div>
                {instalment.paidDate && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Paid: {new Date(instalment.paidDate).toLocaleDateString()}
                  </div>
                )}
                {instalment.receipt ? (
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                ) : 
                <Button variant="outline" size="sm" className="w-full mt-2">
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Upload Receipt
                  </Button>}
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
                  <Badge variant="secondary" className="bg-[#262626]">{comm.type}</Badge>
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