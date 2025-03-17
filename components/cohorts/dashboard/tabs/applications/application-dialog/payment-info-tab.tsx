"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CircleCheckBig, Download, Eye, FlagIcon, Mail, MessageSquare, Upload, UploadIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { verifyTokenAmount } from "@/app/api/student";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

type BadgeVariant = 'onhold' | "pending" | "warning" | "secondary" | "success" | "default";

interface PaymentInformationTabProps {
  student: any;
  onUpdateStatus: () => void;
}

export function PaymentInformationTab({ student, onUpdateStatus }: PaymentInformationTabProps) {

  const [sch, setSch] = useState<any>();
  const [feeStructure, setFeeStructure] = useState<any>();
  const [open, setOpen] = useState(false);
  const [flagOpen, setFlagOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showAllSemesters, setShowAllSemesters] = useState(false);

  const latestCohort = student?.appliedCohorts?.[student?.appliedCohorts.length - 1];
  const cohortDetails = latestCohort?.cohortId; 
  const applicationDetails = latestCohort?.applicationDetails;
  const litmusTestDetails = latestCohort?.litmusTestDetails;
  const scholarshipDetails = litmusTestDetails?.scholarshipDetail;
  const [tokenFeeDetails, setTokenFeeDetails] = useState<any>(latestCohort?.tokenFeeDetails);
  const [paymentDetails, setPaymentDetails] = useState<any>(latestCohort?.paymentDetails);

  useEffect(() => {
    setTokenFeeDetails(latestCohort?.tokenFeeDetails)
    setPaymentDetails(latestCohort?.paymentDetails);
  }, [student]);

  const colorClasses = [
    'text-emerald-600 !bg-emerald-600/20 border-emerald-600',
    'text-[#3698FB] !bg-[#3698FB]/20 border-[#3698FB]',
    'text-[#FA69E5] !bg-[#FA69E5]/20 border-[#FA69E5]',
    'text-orange-600 !bg-orange-600/20 border-orange-600'
  ];
  
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
        console.error("Admission Fee ID is not available");
        return;
      }  
      const response = await verifyTokenAmount(tokenId, comment, verificationStatus);
      setTokenFeeDetails(response.token);
      setFlagOpen(false);
      onUpdateStatus();
    } catch (error) {
      console.error("Error verifying token amount:", error);
    }
  }

  const lastCourse = latestCohort?.cousrseEnrolled?.[latestCohort?.cousrseEnrolled.length - 1];
  let lastStatus = '';
  if(tokenFeeDetails?.verificationStatus === 'pending' || tokenFeeDetails?.verificationStatus === undefined
  ){
    lastStatus = 'pending';
  } else {
    lastStatus = '';
  }

  useEffect(() => {
    if (!cohortDetails?.feeStructureDetails) return;

    const matchedScholarship = litmusTestDetails?.scholarshipDetail;
    const fallbackScholarship = cohortDetails.feeStructureDetails.find(
      (scholarship: any) => scholarship.scholarshipName === "No Scholarship"
    );
    const finalScholarship = latestCohort?.installmentDetails;
    if (finalScholarship && finalScholarship.length > 0) {
      setFeeStructure(finalScholarship);
    }

    setSch((matchedScholarship || fallbackScholarship));
  }, [student]);

  
  const visibleSemesters = showAllSemesters
  ? (feeStructure || sch?.scholarshipDetails)
  : (feeStructure || sch?.scholarshipDetails)?.slice(0, 1); 
  
  const tokenAmount = Number(cohortDetails?.cohortFeesDetail?.tokenFee) || 0;
  const installments = (feeStructure || sch?.scholarshipDetails)?.flatMap((semester: any) => semester.installments) || [];
  const installmentTotal = installments.reduce((sum: number, installment: any) => sum + (installment.amountPayable || 0), 0);
  const scholarshipAmount = installments.reduce((sum: number, installment: any) => sum + (installment.scholarshipAmount || 0), 0);
  const totalAmount = Number(tokenAmount) + Number(installmentTotal);

  const isTokenPaid = tokenFeeDetails?.verificationStatus === "paid";
  const paidAmount = isTokenPaid ? tokenAmount : 0;
  
  const getStatusColor = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "flagged":
      case "overdue":
        return "warning";
      case "pending":
        return "onhold";
      case "verification pending":
        return "pending";
      case "paid":
        return "success";
      default:
        return "secondary";
    }
  };

  const getColor = (slabName: string): string => {
    const index = cohortDetails?.litmusTestDetail?.[0]?.scholarshipSlabs.findIndex(
      (slab: any) => slab.name === slabName
    );
    return index !== -1 ? colorClasses[index % colorClasses.length] : 'text-default';
  };

  const formatAmount = (value: number | undefined) =>
    value !== undefined
      ? new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(value))
      : "--";

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
              <p className="text-sm font-semibold">₹{formatAmount(totalAmount) || "--"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Paid Amount</p>
              <p className="text-sm font-semibold">{paidAmount ? <>₹{formatAmount(paidAmount)}</> : "--"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Scholarship</p>
              <div className="flex gap-1.5 items-center text-sm font-semibold">
                {scholarshipDetails ? (
                  <>
                    ₹{formatAmount(scholarshipAmount)}{' '}
                    <Badge className={`capitalize ${getColor(scholarshipDetails?.scholarshipName)}`} variant="secondary">
                      {scholarshipDetails?.scholarshipName+' ('+scholarshipDetails?.scholarshipPercentage+'%)'}
                    </Badge> 
                  </>
                ) : ( <span className="text-muted-foreground">Not Assigned</span> )}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Admission Fee Status</p>
              <div className="flex gap-2 items-center">
                <span className="text-sm font-semibold">₹{formatAmount(tokenAmount)}</span>
                {applicationDetails?.applicationStatus === 'selected' && 
                  <Badge className="capitalize" variant={getStatusColor(tokenFeeDetails?.verificationStatus || 'pending')}>
                    {tokenFeeDetails?.verificationStatus || 'pending'}
                  </Badge>
                }
              </div>
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
                  <h4 className="font-medium">Admission Fee</h4>
                  <p className="text-sm text-muted-foreground">
                    Amount: ₹{formatAmount(tokenAmount)}
                    {tokenFeeDetails && (
                      <>
                        {" • Uploaded on "}
                        {new Date(
                          tokenFeeDetails?.updatedAt
                        ).toLocaleDateString()}
                      </>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {applicationDetails?.applicationStatus === 'selected' && 
                    <Badge className="capitalize" variant={getStatusColor(tokenFeeDetails?.verificationStatus || '')}>
                      {tokenFeeDetails?.verificationStatus || 'pending'}
                    </Badge>
                  }
                  {tokenFeeDetails?.verificationStatus === 'paid' && 
                  <Button variant="ghost" size="sm" onClick={() => handleView(tokenFeeDetails?.receiptUrl[0])}>
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

              
              {tokenFeeDetails?.verificationStatus === 'verification pending' &&
                <div className="space-y-4">
                  <div className="w-full flex bg-[#64748B33] flex-col items-center rounded-xl">
                    <img src={tokenFeeDetails?.receiptUrl[0]} alt={tokenFeeDetails?.receiptUrl[0].split('/').pop()} className='w-full h-[200px] object-contain rounded-t-xl' />
                  </div>
                  {flagOpen ?
                  <div className="space-y-4 ">
                    <div className="mt-2 space-y-2">
                      <label className="text-lg pl-3">Provide Reasons</label>
                      <Textarea className="h-[100px]" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Type your reasons here..."/>
                    </div>
                    <div className="flex gap-2" >
                      <Button variant="outline" className="flex" onClick={() => setFlagOpen(false)}>Back</Button>
                      <Button className="flex-1" disabled={!reason.trim()}
                        onClick={() => handleVerify(tokenFeeDetails?._id, reason, "flagged")}>Mark as Flagged</Button>
                    </div>
                  </div> :
                  <div className="flex gap-4 mt-4">
                    <Button variant="outline" className="flex gap-2 border-[#FF503D] text-[#FF503D] bg-[#FF503D]/[0.2] "
                      onClick={() => setFlagOpen(true)}>
                        <FlagIcon className="w-4 h-4"/> Flag Reciept
                    </Button>
                    <Button variant="outline" className="flex gap-2 border-[#2EB88A] text-[#2EB88A] bg-[#2EB88A]/[0.2]"
                      onClick={() => handleVerify(tokenFeeDetails?._id, "", "paid")}>
                        <CircleCheckBig className="w-4 h-4"/> Mark as Verified
                    </Button>
                  </div>}
                </div>
              }
              {tokenFeeDetails?.verificationStatus === 'paid' && 
              <>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Paid: {new Date(tokenFeeDetails?.updatedAt).toLocaleDateString()}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => handleDownload(tokenFeeDetails?.receiptUrl[0])}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
              </>
              }
              {(tokenFeeDetails?.comment && tokenFeeDetails?.comment.length > 0) && 
              <div className="space-y-3">
                <Separator />
                  {tokenFeeDetails?.comment.slice().reverse().map((reason: any, index: any) => (
                    <div key={index} className="sapce-y-4 text-muted-foreground text-sm">
                      <div className="flex justify-between items-center">
                        <div className="">
                          Reason:
                        </div>
                        <div className="text-[#FF503D]">Rejected on {new Date(reason?.date).toLocaleDateString()}</div>
                      </div>
                      <div className="">{reason?.text}</div>
                      <Button variant="ghost" className="px-0 text-white" size="sm" onClick={() => handleView(tokenFeeDetails?.receiptUrl[index])}>
                        <Eye className="h-4 w-4 mr-2" /> Acknowledgement Receipt
                      </Button>
                    </div>
                  ))}
              </div>}
            </div>

            {lastCourse?.feeSetup?.installmentType === 'one shot payment' ? 
            <Card className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium">One Shot Payement</h5>
                </div>
                <div className="flex items-center gap-2">
                  {(new Date(lastCourse?.oneShotPayment?.installmentDate) < new Date() && lastCourse?.oneShotPayment?.verificationStatus === 'pending' ) ?
                    <Badge variant={getStatusColor('overdue')}>
                      overdue
                    </Badge>
                  :
                  <Badge variant={getStatusColor(lastCourse?.oneShotPayment?.verificationStatus)}>
                    {lastCourse?.oneShotPayment?.verificationStatus}
                  </Badge>
                  }
                  {lastCourse?.oneShotPayment?.receiptUrls[lastCourse?.oneShotPayment?.receiptUrls.length - 1]?.url && 
                    <Button variant="ghost" size="sm" onClick={() => handleView(lastCourse?.oneShotPayment?.receiptUrls[lastCourse?.oneShotPayment?.receiptUrls.length - 1]?.url)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  }
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount: ₹{formatAmount(lastCourse?.oneShotPayment?.amountPayable)}</p>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                Due: {new Date(lastCourse?.oneShotPayment?.installmentDate).toLocaleDateString()}
              </div>
              {lastCourse?.oneShotPayment?.receiptUrls[lastCourse?.oneShotPayment?.receiptUrls.length - 1]?.uploadedDate && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Paid: {new Date(lastCourse?.oneShotPayment?.receiptUrls[lastCourse?.oneShotPayment?.receiptUrls.length - 1]?.uploadedDate).toLocaleDateString()}
                </div>
              )}
              {lastCourse?.oneShotPayment?.receiptUrls[lastCourse?.oneShotPayment?.receiptUrls.length - 1]?.url ? (
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
              ) : 
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <UploadIcon className="h-4 w-4 mr-2" />
                  Upload Receipt
                </Button>
              }             
            </Card> : 
            <div className="space-y-2">
              {visibleSemesters?.map((semesterObj: any, semesterIndex: number) => (
                <div key={semesterIndex}>
                  <Badge variant="blue" className="capitalize mb-3">
                    Semester {semesterObj.semester}
                  </Badge>
                  <div className="space-y-4">
                    {semesterObj.installments?.map((instalment: any, iIndex: number) => (
                      <div key={iIndex} className="border rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Instalment {iIndex + 1}</h4>
                            <p className="text-sm text-muted-foreground">
                              Amount: ₹{formatAmount(instalment?.amountPayable)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {lastStatus !== 'pending' && (
                              (new Date(instalment?.installmentDate) < new Date() && instalment?.verificationStatus === 'pending' && !(instalment.receiptUrls[0]?.uploadedDate)) ?
                                <Badge variant={getStatusColor('overdue')}>
                                  overdue
                                </Badge>
                              :
                                <Badge className="capitalize" variant={getStatusColor(instalment?.verificationStatus)}>
                                  {instalment?.verificationStatus}
                                </Badge>
                            )}
                            {instalment?.receiptUrls[instalment?.receiptUrls.length - 1]?.url && 
                              <Button variant="ghost" size="sm" onClick={() => handleView(instalment?.receiptUrls[instalment?.receiptUrls.length - 1]?.url)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            }
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            Due:{" "}
                            {instalment?.installmentDate
                              ? new Date(instalment?.installmentDate).toLocaleDateString()
                              : "--"}
                          </div>
                          {instalment?.receiptUrls[instalment?.receiptUrls.length - 1]?.uploadedDate && 
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-2" />
                              Paid:{" "}
                              {instalment?.installmentDate
                                ? new Date(instalment?.receiptUrls[instalment?.receiptUrls.length - 1]?.uploadedDate).toLocaleDateString()
                                : "--"}
                            </div>
                          }
                        </div>
                        {/* <Button variant="outline" size="sm">
                            <UploadIcon className="h-4 w-4 mr-2" />
                            Upload Receipt
                            </Button> */}
                          {instalment?.receiptUrls[instalment?.receiptUrls.length - 1]?.url ? (
                            <Button variant="outline" size="sm" className="w-full ">
                              <Download className="h-4 w-4 mr-2" />
                              Download Receipt
                            </Button>
                          ) : 
                            lastStatus !== 'pending' && <Button variant="outline" size="sm" className="w-full ">
                              <UploadIcon className="h-4 w-4 mr-2" />
                              Upload Receipt
                            </Button>
                          } 
                          <div className="hidden">
                              {lastStatus = instalment?.verificationStatus}
                            </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {sch?.scholarshipDetails?.length > 1 && (
                <Button
                  variant="ghost" className="w-full underline"
                  onClick={() => setShowAllSemesters(!showAllSemesters)}
                >
                  {showAllSemesters ? "View Less" : "View More"}
                </Button>
              )}
            </div>
          }
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