"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Mail, MessageSquare, Upload, UploadIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PaymentInformationTabProps {
  studentId: string;
}

export function PaymentInformationTab({ studentId }: PaymentInformationTabProps) {
  // In a real application, this data would be fetched based on the studentId
  const payment = {
    totalAmount: "₹9,95,000",
    paidAmount: "₹4,97,500",
    scholarship: "Smart Mouth (5%)",
    scholarshipAmount: "₹49,750",
    tokenAmount: "₹50,000",
    tokenDueDate: "2024-02-15",
    tokenPaid: "Paid",
    tokenPaidDate: "2024-02-14",
    tokenReceipt: "receipt-001.pdf",
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
        message: "Payment reminder for 3rd instalment",
      },
    ],
  };

  const progressPercentage = 
    (payment.instalments.filter(i => i.status === "Paid").length / 
    payment.instalments.length) * 100;

  return (
    <div className="space-y-6">
      {/* Payment Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
              <Badge variant="secondary">{payment.scholarship}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Token Status</p>
              <Badge variant={payment.tokenPaid ? "success" : "destructive"}>
                {payment.tokenPaid ? "Paid" : "Pending"}
              </Badge>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Payment Progress</span>
              <span>{progressPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={progressPercentage} />
          </div>
        </CardContent>
      </Card>

      {/* Payment Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
        <div className="border rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">Token Amount</h4>
                  <p className="text-sm text-muted-foreground">
                    Amount: {payment.tokenAmount}
                  </p>
                </div>
                <Badge
                  variant={payment.tokenPaid === "Paid" ? "success" : "secondary"}
                >
                  {payment.tokenPaid}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Due: {new Date(payment.tokenDueDate).toLocaleDateString()}
                </div>
                {payment.tokenPaid !== "Paid" && <Button variant="outline" size="sm" className="">
                  <UploadIcon className="h-4 w-4 mr-2" />
                  Upload Receipt
                </Button>}
              </div> 
              {payment.tokenPaidDate && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Paid: {new Date(payment.tokenPaidDate).toLocaleDateString()}
                </div>
              )}
              {payment.tokenReceipt && (
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
              )}
            </div>

            <Badge variant="blue" className="mb-2 mt-4">Semester 01</Badge>
          {payment.instalments.map((instalment, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">Instalment {instalment.number}</h4>
                  <p className="text-sm text-muted-foreground">
                    Amount: {instalment.amount}
                  </p>
                </div>
                <Badge
                  variant={instalment.status === "Paid" ? "success" : "secondary"}
                >
                  {instalment.status}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Due: {new Date(instalment.dueDate).toLocaleDateString()}
                </div>
                {instalment.status !== "Paid" && <Button variant="outline" size="sm" className="">
                  <UploadIcon className="h-4 w-4 mr-2" />
                  Upload Receipt
                </Button>}
              </div>
              {instalment.paidDate && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Paid: {new Date(instalment.paidDate).toLocaleDateString()}
                </div>
              )}
              {instalment.receipt && (
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Communication History */}
      <Card>
        <CardHeader>
          <CardTitle>Communication History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Send Reminder
            </Button>
            <Button variant="outline">
              <img src="/assets/images/whatsapp-icon.svg" className="h-4 w-4 mr-2" />
              Send WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}