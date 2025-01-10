"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CircleCheckBig, Download, Eye, FlagIcon, Mail, MessageSquare, Upload, UploadIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { verifyTokenAmount } from "@/app/api/student";

type BadgeVariant = "lemon" | "warning" | "secondary" | "success" | "default";

interface PaymentInformationTabProps {
  student: any;
}

export function PaymentInformationTab({ student }: PaymentInformationTabProps) {

  const [sch, setSch] = useState<any>();
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showAllSemesters, setShowAllSemesters] = useState(false);

  const handleView = (url: string) => {
    setImageUrl(url);
    setOpen(true);
  };

  const handleDownload = (url: string) => {
    const link = document.createElement("a");
      link.href = url;
      link.download = "Receipt.pdf"; // Default filename for the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  async function handleVerify(tokenId: any, comment: string, verificationStatus: string) {
    try {
  
      if (!tokenId) {
        console.error("Token Fee ID is not available");
        return;
      }  
      const response = await verifyTokenAmount(tokenId, comment, verificationStatus);
      console.log("Token verification response:", response);
    } catch (error) {
      console.error("Error verifying token amount:", error);
    }
  }
  

  console.log("dd",student);

  useEffect(() => {
    if (!student.cohort?.feeStructureDetails) return;

    const scholarshipId = student?.litmusTestDetails?.[0]?.litmusTaskId?.scholarshipDetail;

    const matchedScholarship = student.cohort.feeStructureDetails.find(
      (scholarship: any) => scholarship._id === scholarshipId
    );
    const fallbackScholarship = student.cohort.feeStructureDetails.find(
      (scholarship: any) => scholarship.scholarshipName === "No Scholarship"
    );

    setSch(matchedScholarship || fallbackScholarship);
  }, [student]);

  const formatAmount = (value: number | undefined) =>
    value !== undefined
      ? new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(value))
      : "--";
  
  const visibleSemesters = showAllSemesters
  ? sch?.scholarshipDetails
  : sch?.scholarshipDetails?.slice(0, 1); 

  const tokenAmount = student?.cohort?.cohortFeesDetail?.tokenFee || 0;
  const installments = sch?.scholarshipDetails?.flatMap((semester: any) => semester.installments) || [];
  const installmentTotal = installments.reduce((sum: number, installment: any) => sum + (installment.amountPayable || 0), 0);
  const scholarshipAmount = installments.reduce((sum: number, installment: any) => sum + (installment.scholarshipAmount || 0), 0);
  const totalAmount = tokenAmount + installmentTotal;

  const isTokenPaid =
    student?.cousrseEnrolled?.[student.cousrseEnrolled?.length - 1]?.tokenFeeDetails?.verificationStatus === "paid";
  const paidAmount = isTokenPaid ? tokenAmount : 0;
  
  const getStatusColor = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "flagged":
        return "warning";
      case "pending":
        return "lemon";
      case "paid":
        return "success";
      default:
        return "secondary";
    }
  };


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
              <p className="text-sm font-semibold">₹ {formatAmount(totalAmount) || "--"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Paid Amount</p>
              <p className="text-sm font-semibold">{paidAmount ? <>₹ {formatAmount(paidAmount)}</> : "--"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Scholarship</p>
              <p className="flex gap-1 text-sm items-center font-semibold">
                {student?.litmusTestDetails?.[0]?.litmusTaskId?.scholarshipDetail ? (
                  <>
                    ₹ {formatAmount(scholarshipAmount)}{' '}
                    <Badge variant="secondary">
                      {`${sch?.scholarshipName} ${sch?.scholarshipPercentage}%`}
                    </Badge>
                  </>
                ) : ( '--' )}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Token Status</p>
              <Badge variant={getStatusColor(student?.cousrseEnrolled?.[student.cousrseEnrolled?.length - 1]?.tokenFeeDetails?.verificationStatus || '--')}>
                {student?.cousrseEnrolled?.[student.cousrseEnrolled?.length - 1]?.tokenFeeDetails?.verificationStatus || '--'}
              </Badge>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Payment Progress</span>
              <span>{(paidAmount/totalAmount*100).toFixed(2)}%</span>
            </div>
            <Progress states={[
              { value: paidAmount, widt: (paidAmount/totalAmount*100), color: '#2EB88A' }
            ]} />
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
                    Amount: {formatAmount(student?.cohort?.cohortFeesDetail?.tokenFee)}
                    {student?.cousrseEnrolled?.length > 0 && (
                      <>
                        {" • Uploaded on "}
                        {new Date(
                          student?.cousrseEnrolled?.[student.cousrseEnrolled?.length - 1]?.tokenFeeDetails?.updatedAt
                        ).toLocaleDateString()}
                      </>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(student?.cousrseEnrolled?.[student.cousrseEnrolled?.length - 1]?.tokenFeeDetails?.verificationStatus || '--')}>
                    {student?.cousrseEnrolled?.[student.cousrseEnrolled?.length - 1]?.tokenFeeDetails?.verificationStatus || '--'}
                  </Badge>
                  {student?.cousrseEnrolled?.length > 0 && 
                  <Button variant="ghost" size="sm" onClick={() => handleView(student?.cousrseEnrolled?.[student.cousrseEnrolled?.length - 1]?.tokenFeeDetails?.receiptUrl[0])}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>}
                </div>
                
              </div>
              {/* <div className="flex justify-between items-center">
                {payment.tokenPaid !== "Paid" && <Button variant="outline" size="sm" className="">
                  <UploadIcon className="h-4 w-4 mr-2" />
                  Upload Receipt
                </Button>}
              </div>  */}
              {student?.cousrseEnrolled?.[student.cousrseEnrolled?.length - 1]?.tokenFeeDetails?.verificationStatus === 'pending' &&
                <div className="flex gap-4 mt-4">
                  <Button variant="outline" className="flex gap-2 border-[#FF503D] text-[#FF503D] bg-[#FF503D]/[0.2] "
                    onClick={() => handleVerify(student?.cousrseEnrolled?.[student.cousrseEnrolled?.length - 1]?.tokenFeeDetails?._id, "Upload again", "flagged")}>
                      <FlagIcon className="w-4 h-4"/> Flag Document
                  </Button>
                  <Button variant="outline" className="flex gap-2 border-[#2EB88A] text-[#2EB88A] bg-[#2EB88A]/[0.2]"
                    onClick={() => handleVerify(student?.cousrseEnrolled?.[student.cousrseEnrolled?.length - 1]?.tokenFeeDetails?._id, "Token Fee is verfied", "paid")}>
                      <CircleCheckBig className="w-4 h-4"/> Mark as Verified
                  </Button>
                </div>
              }
              {student?.cousrseEnrolled?.[student.cousrseEnrolled?.length - 1]?.tokenFeeDetails?.verificationStatus === 'paid' && 
              <>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Paid: {new Date(student?.cousrseEnrolled?.[student.cousrseEnrolled?.length - 1]?.tokenFeeDetails?.updatedAt).toLocaleDateString()}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => handleDownload(student?.cousrseEnrolled?.[student.cousrseEnrolled?.length - 1]?.tokenFeeDetails?.receiptUrl[0])}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
              </>
              }
            </div>

            {visibleSemesters?.map((semesterObj: any, semesterIndex: number) => (
            <div key={semesterIndex}>
              <Badge variant="blue" className="mb-3">
                Semester {semesterObj.semester}
              </Badge>

              <div className="space-y-4">
                {semesterObj.installments?.map((instalment: any, iIndex: number) => (
                  <div key={iIndex} className="border rounded-lg p-4 space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Instalment {iIndex + 1}</h4>
                        <p className="text-sm text-muted-foreground">
                          Amount: {formatAmount(instalment.amountPayable)}
                        </p>
                      </div>
                      {/* <Badge variant="secondary">Pending</Badge> */}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        Due:{" "}
                        {instalment.installmentDate
                          ? new Date(instalment.installmentDate).toLocaleDateString()
                          : "--"}
                      </div>
                      {/* <Button variant="outline" size="sm">
                        <UploadIcon className="h-4 w-4 mr-2" />
                        Upload Receipt
                      </Button> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Show More / Show Less button, only if more than 1 semester */}
          {sch?.scholarshipDetails?.length > 1 && (
            <Button
              variant="outline" className="w-full"
              onClick={() => setShowAllSemesters(!showAllSemesters)}
            >
              {showAllSemesters ? "Show Less" : "Show More"}
            </Button>
          )}

        </CardContent>
      </Card>

      {/* Communication History */}
      {/* <Card>
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
      </Card> */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl py-2 px-6 overflow-y-auto">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Receipt"
              className="mx-auto h-[50vh] object-contain"
            />
          ) : (
            <p className="text-center text-muted-foreground">No receipt found.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}