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
  Star,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MarkedAsDialog } from "@/components/students/sections/drop-dialog";
import { useEffect, useState } from "react";
import { AwardScholarship } from "@/components/common-dialog/award-scholarship";
import { Card } from "@/components/ui/card";

type BadgeVariant = "destructive" | "warning" | "secondary" | "success" | "default";
interface PaymentDetailsProps {
  student: any;
  onClose: () => void;
}

export function PaymentDetails({ student, onClose }: PaymentDetailsProps) {
  const [markedAsDialogOpen, setMarkedAsDialogOpen] = useState(false);
  const [sch, setSch] = useState<any>(null);
  const [schOpen, setSchOpen] = useState(false);

  const colorClasses = ['text-emerald-600', 'text-[#3698FB]', 'text-[#FA69E5]', 'text-orange-600'];

  let paidAmount = 0;
  let notPaidAmount = 0;

  const lastEnrolled = student.cousrseEnrolled?.[student.cousrseEnrolled.length - 1];
  if (lastEnrolled?.feeSetup?.installmentType === 'one shot payment') {
    const oneShotDetails = lastEnrolled?.oneShotPayment;
    if (oneShotDetails) {
      if (oneShotDetails?.verificationStatus === 'paid') {
        paidAmount += oneShotDetails?.amountPayable;
      } else{
        notPaidAmount += oneShotDetails?.amountPayable;
      }
    }
  }
  if (lastEnrolled?.feeSetup?.installmentType === 'instalments') {
    lastEnrolled?.installmentDetails.forEach((semesterDetail: any) => {
      const installments = semesterDetail?.installments;
      installments.forEach((installment: any) => {
        if (installment?.verificationStatus === 'paid') {
          paidAmount += installment?.amountPayable;
        } else {
          notPaidAmount += installment?.amountPayable;
        }    
      });
    });
  }

    useEffect(() => {
      if (student?.cohort?.feeStructureDetails && student?.litmusTestDetails?.[0]?.litmusTaskId?.scholarshipDetail) {
        const scholarship = student.cohort.feeStructureDetails.find(
          (scholarship: any) =>
            scholarship._id === student.litmusTestDetails[0].litmusTaskId.scholarshipDetail
        );
        setSch(scholarship);
      }
    }, [student]);

  const payment = {
    id: student,
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

  const getColor = (slabName: string): string => {
    const index = student?.cohort?.litmusTestDetail?.[0]?.scholarshipSlabs.findIndex(
      (slab: any) => slab.name === slabName
    );
    
    return index !== -1 ? colorClasses[index % colorClasses.length] : 'text-default';
  };


  const formatAmount = (value: number | undefined) =>
    value !== undefined
      ? new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(value))
      : "--";

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{student?.firstName+" "+student?.lastName}</h3>
          <p className="text-sm text-muted-foreground">{student?.email}</p>
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
                <p className="font-medium">₹{formatAmount(paidAmount+notPaidAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paid Amount</p>
                <p className="font-medium">₹{formatAmount(paidAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scholarship</p>
                <p className={`font-medium ${getColor(sch?.scholarshipName)}`}>
                  {sch?.scholarshipName+' ('+sch?.scholarshipPercentage+'%)'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Admission Fee Status</p>
                <span className="text-base mr-2">{formatAmount(student?.cohort?.cohortFeesDetail?.tokenFee)}</span>
                <Badge className="capitalize" variant={getStatusColor(student.cousrseEnrolled?.[student.cousrseEnrolled.length - 1]?.tokenFeeDetails?.verificationStatus)}>
                  ₹{student.cousrseEnrolled?.[student.cousrseEnrolled.length - 1]?.tokenFeeDetails?.verificationStatus}
                </Badge>
              </div>
            </div>
            <div className="space-y-1 mt-2">
              <div className="flex justify-between text-sm">
                <span>Payment Progress</span>
                <span>{((paidAmount / notPaidAmount) * 100).toFixed(0)}%</span>
              </div>
              <Progress states={[
                { value: (paidAmount), widt: ((paidAmount / notPaidAmount) * 100), color: '#2EB88A' }
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
              {sch ? 
                  <Button variant="outline" className={`justify-start ${getColor(sch?.scholarshipName)}`} onClick={() => setSchOpen(true)}>
                    <div className="flex gap-2 items-center">
                      <span className="text-lg pb-[2px]">★ </span> {sch?.scholarshipName+' ('+sch?.scholarshipPercentage+'%)'}
                    </div> 
                  </Button>
                    :
                  <Button variant="outline" className="justify-start">
                    <div className="flex gap-2 items-center">
                      <Star className="h-4 w-4" />
                      Award Scholarship
                    </div>
                  </Button>
                }
              <Button variant="outline" className="justify-start text-destructive" onClick={()=>setMarkedAsDialogOpen(true)}>
                <UserMinus className="h-4 w-4 mr-2" />
                Mark as Dropped
              </Button>

                  <Dialog open={markedAsDialogOpen} onOpenChange={setMarkedAsDialogOpen}>
                    <DialogContent className="max-w-4xl py-4 px-6">
                      <MarkedAsDialog student={student}/>
                    </DialogContent>
                  </Dialog>
            </div>
          </div>

          <Separator />

          {/* Instalments */}
          <div className="space-y-4">
            <h4 className="font-medium">Payment Schedule</h4>

            {student.cousrseEnrolled?.[student.cousrseEnrolled.length - 1]?.feeSetup?.installmentType === 'one shot payment' ? 
            <Card className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium">One Shot Payement</h5>
                </div>
                <Badge variant={getStatusColor(student.cousrseEnrolled?.[student.cousrseEnrolled.length - 1]?.oneShotPayment?.verificationStatus)}>
                  {student.cousrseEnrolled?.[student.cousrseEnrolled.length - 1]?.oneShotPayment?.verificationStatus}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount: ₹{formatAmount(student.cousrseEnrolled?.[student.cousrseEnrolled.length - 1]?.oneShotPayment?.amountPayable)}</p>
                <p className="text-xs text-muted-foreground">One Shot Discount: {formatAmount(student.cousrseEnrolled?.[student.cousrseEnrolled.length - 1]?.oneShotPayment?.OneShotPaymentAmount)}</p>
                <p className="text-xs text-muted-foreground">Base Amount: ₹{formatAmount(student.cousrseEnrolled?.[student.cousrseEnrolled.length - 1]?.oneShotPayment?.baseFee)}</p>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                Due: {new Date(student.cousrseEnrolled?.[student.cousrseEnrolled.length - 1]?.oneShotPayment?.installmentDate).toLocaleDateString()}
              </div>
              {student.cousrseEnrolled?.[student.cousrseEnrolled.length - 1]?.oneShotPayment?.receiptUrls[student.cousrseEnrolled?.[student.cousrseEnrolled.length - 1]?.oneShotPayment?.receiptUrls.length - 1]?.uploadedDate && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Paid: {new Date(student.cousrseEnrolled?.[student.cousrseEnrolled.length - 1]?.oneShotPayment?.receiptUrls[student.cousrseEnrolled?.[student.cousrseEnrolled.length - 1]?.oneShotPayment?.receiptUrls.length - 1]?.uploadedDate).toLocaleDateString()}
                </div>
              )}
              {student.cousrseEnrolled?.[student.cousrseEnrolled.length - 1]?.oneShotPayment?.receiptUrls[student.cousrseEnrolled?.[student.cousrseEnrolled.length - 1]?.oneShotPayment?.receiptUrls.length - 1]?.url ? (
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
              ) : 
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <UploadIcon className="h-4 w-4 mr-2" />
                  Upload Receipt
                </Button>}             
            </Card> : 
            student.cousrseEnrolled?.[student.cousrseEnrolled.length - 1]?.installmentDetails?.map(
              (semesterDetail: any, semesterIndex: number) => (
                <div key={semesterIndex} className="space-y-2">
                  {semesterDetail?.installments?.map((installment: any, installmentIndex: number) => (
                    <Card key={installmentIndex} className="p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">Installment {installmentIndex + 1}</h5>
                          <p className="text-xs text-[#00A3FF]">Semester {semesterDetail.semester}</p>
                        </div>
                        <Badge className="capitalize" variant={getStatusColor(installment.verificationStatus)}>
                          {installment.verificationStatus}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Amount Payable: ₹{formatAmount(installment.amountPayable)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Scholarship Waiver: ₹{formatAmount(installment.scholarshipAmount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Base Amount: ₹{formatAmount(installment.baseFee)}
                        </p>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        Due: {new Date(installment.installmentDate).toLocaleDateString()}
                      </div>
                      {installment.receiptUrls?.[0]?.uploadedDate && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          Paid: {new Date(installment.receiptUrls[0]?.uploadedDate).toLocaleDateString()}
                        </div>
                      )}
                      {installment.receiptUrls?.[0]?.url ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => window.open(installment.receiptUrls[0]?.url, "_blank")}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Receipt
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="w-full mt-2">
                          <UploadIcon className="h-4 w-4 mr-2" />
                          Upload Receipt
                        </Button>
                      )}
                    </Card>
                  ))}
                </div>
              )
            )}
          </div>

          <Dialog open={schOpen} onOpenChange={setSchOpen}>
            <DialogContent className="max-w-5xl">
              <AwardScholarship student={student} />
            </DialogContent>
          </Dialog>

          {/* <Separator /> */}

          {/* Communication History */}
          {/* <div className="space-y-4">
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
          </div> */}
        </div>
      </ScrollArea>
    </div>
  );
}