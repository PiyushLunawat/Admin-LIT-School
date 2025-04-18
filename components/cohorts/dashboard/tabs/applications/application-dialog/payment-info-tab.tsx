"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, CircleCheckBig, Download, Eye, EyeIcon, FlagIcon, LoaderCircle, Mail, MessageSquare, Upload, UploadIcon, XIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { uploadFeeReceipt, verifyFeeStatus, verifyTokenAmount } from "@/app/api/student";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { formatAmount } from "@/lib/utils/helpers";

type BadgeVariant = 'onhold' | "pending" | "warning" | "secondary" | "success" | "default";

interface UploadState {
  uploading: boolean;
  uploadProgress: number;
  fileName: string;
}

interface PaymentInformationTabProps {
  student: any;
  onUpdateStatus: () => void;
}

export function PaymentInformationTab({ student, onUpdateStatus }: PaymentInformationTabProps) {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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

  const [uploadStates, setUploadStates] = useState<{ [key: string]: UploadState }>({});
  const [instalment, setInstalment] = useState<any>();
  const [instalmentNo, setInstalmentNo] = useState<any>();
  const [semesterNo, setSemesterNo] = useState<any>();
  const [vopen, setVopen] = useState(false);

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

  const handleDownload = async (url: string) => {
    try {
      // 1. Fetch the file as Blob
      const response = await fetch(url);
      const blob = await response.blob();
  
      // 2. Create a temporary object URL for that Blob
      const blobUrl = URL.createObjectURL(blob);
  
      // 3. Create a hidden <a> and force download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "Receipt.pdf";  // or "myImage.png"
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed", err);
    }
  };
  

  async function handleTokenVerify(tokenId: any, comment: string, verificationStatus: string) {
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

  const handleVerifyDialog = (instalment: any, insIndex: any, semIndex: any) => {
    setInstalment(instalment);
    setInstalmentNo(insIndex);
    setSemesterNo(semIndex);
    setVopen(true);
  };

  async function handleFeeVerify(ins: any, sem: any,  comment: string, verificationStatus: string) {      
    const payload = {
      studentPaymentId: paymentDetails?._id,
      semesterNumber: sem,
      installmentNumber: ins,
      feedbackData: comment,
      verificationStatus: verificationStatus,
    };
    console.log("payloadvdvd", payload);
    
    try {
      if (!payload) {
        console.error("Fee ID is not available");
        return;
      }  
      setLoading(true)
      const response = await verifyFeeStatus(payload);
      console.log("response", response);
      setPaymentDetails(response.updatedPayment); 
      setFlagOpen(false);
      setVopen(false)
      onUpdateStatus();
    } catch (error) {
      console.error("Error verifying token amount:", error);
    } finally {
      setLoading(false)
    }
  } 


  const handleFileChange = async ( e: React.ChangeEvent<HTMLInputElement>, paymentId: string, oneShot: boolean, inst?: number, sem?: number) => {
      setError(null);

      let key: any;

      if(oneShot) key = "oneshot";
      else key = `${inst}${sem}`
  
      setUploadStates(prev => ({
        ...prev,
        [key]: { uploading: true, uploadProgress: 0, fileName: "" }
      }));
  
      const file = e.target.files?.[0];
      if (!file) return;
      const fileKey = generateUniqueFileName(file.name);
      
      // Update fileName for this document
      setUploadStates(prev => ({
        ...prev,
        [key]: { ...prev[key], fileName: fileKey }
      }));
  
      const CHUNK_SIZE = 100 * 1024 * 1024;
      e.target.value = "";
  
      try {
        let fileUrl = "";
        if (file.size <= CHUNK_SIZE) {
          fileUrl = await uploadDirect(file, fileKey, key);
          console.log("uploadDirect File URL:", fileUrl);
        } else {
          fileUrl = await uploadMultipart(file, fileKey, CHUNK_SIZE, key);
          console.log("uploadMultipart File URL:", fileUrl);
        }
        let payload;
        if(oneShot) {
          payload = {
            studentPaymentId: paymentId,
            oneShotPayment: true,
            receiptUrl: fileUrl,
          }
        } else {
          payload = {
            studentPaymentId: paymentId,
            semesterNumber: sem,
            installmentNumber: inst,
            receiptUrl: fileUrl,
          }
        }
        console.log("payload", payload);
      
        // Call the API function with FormData
        const response = await uploadFeeReceipt(payload);
        console.log("Upload response:", response);
        onUpdateStatus()
        setPaymentDetails(response.updatedPayment);
  
      } catch (error: any) {
        console.error("Error uploading file:", error);
        toast({
          title: "Document Upload Failed",
          description: error.message || "Error updating document. Please try again.",
          variant: "warning",
        });
      } finally {
        setUploadStates(prev => ({
          ...prev,
          [key]: { ...prev[key], uploading: false, fileName: "" }
        }));
        e.target.value = "";
      }
    };
  
    const uploadDirect = async (file: File, fileKey: string, key: string) => {
      const { data } = await axios.post(`https://dev.apply.litschool.in/student/generate-presigned-url`, {
        bucketName: "dev-application-portal",
        key: fileKey,
      });
      const { url } = data;
      await axios.put(url, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (evt: any) => {
          if (!evt.total) return;
          const percentComplete = Math.round((evt.loaded / evt.total) * 100);
          setUploadStates(prev => ({
            ...prev,
            [key]: { ...prev[key], uploadProgress: Math.min(percentComplete, 100)}
          }));
        },
      });
      return `${url.split("?")[0]}`;
    };
  
    const uploadMultipart = async (file: File, fileKey: string, chunkSize: number, key: string) => {
      const uniqueKey = fileKey;
  
      const initiateRes = await axios.post(`https://dev.apply.litschool.in/student/initiate-multipart-upload`, {
        bucketName: "dev-application-portal",
        key: uniqueKey,
      });
      const { uploadId } = initiateRes.data;
      const totalChunks = Math.ceil(file.size / chunkSize);
      let totalBytesUploaded = 0;
      const parts: { ETag: string; PartNumber: number }[] = [];
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);
        const partRes = await axios.post(`https://dev.apply.litschool.in/student/generate-presigned-url-part`, {
          bucketName: "dev-application-portal",
          key: uniqueKey,
          uploadId,
          partNumber: i + 1,
        });
        const { url } = partRes.data;
        const uploadRes = await axios.put(url, chunk, {
          headers: { "Content-Type": file.type },
          onUploadProgress: (evt: any) => {
            if (!evt.total) return;
            totalBytesUploaded += evt.loaded;
            const percent = Math.round((totalBytesUploaded / file.size) * 100);
            setUploadStates(prev => ({
              ...prev,
              [key]: { ...prev[key], uploadProgress: Math.min(percent, 100)}
            }));
          },
        });
        parts.push({ PartNumber: i + 1, ETag: uploadRes.headers.etag });
      }
      await axios.post(`https://dev.apply.litschool.in/student/complete-multipart-upload`, {
        bucketName: "dev-application-portal",
        key: uniqueKey,
        uploadId,
        parts,
      });
      return `https://dev-application-portal.s3.amazonaws.com/${uniqueKey}`;
    };
  
    const generateUniqueFileName = (originalName: string) => {
      const timestamp = Date.now();
      const sanitizedName = originalName.replace(/\s+/g, '-');
      return `${timestamp}-${sanitizedName}`;
    };  

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
    const finalScholarship = paymentDetails?.installments;
    if (finalScholarship) {
      setFeeStructure(finalScholarship);
    }
    
    setSch((matchedScholarship || fallbackScholarship));
  }, [student, paymentDetails]);
  
  const visibleSemesters = showAllSemesters
  ? (feeStructure || sch?.installmentDetails)
  : (feeStructure || sch?.installmentDetails)?.slice(0, 1); 
  
  const tokenAmount = Number(cohortDetails?.cohortFeesDetail?.tokenFee) || 0;
  const installments = (feeStructure?.installmentDetails || sch?.installmentDetails)?.flatMap((semester: any) => semester.installments) || [];
  const installmentTotal = installments.reduce((sum: number, installment: any) => sum + (installment.amountPayable || 0), 0);
  const scholarshipAmount = cohortDetails?.baseFee * scholarshipDetails?.scholarshipPercentage * 0.01;;
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
                  <Button variant="ghost" size="sm" onClick={() => handleView(tokenFeeDetails?.receipts?.[tokenFeeDetails?.receipts.length - 1]?.url)}>
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
                    <img src={tokenFeeDetails?.receipts?.[tokenFeeDetails?.receipts.length - 1]?.url} alt={tokenFeeDetails?.receipts?.[tokenFeeDetails?.receipts.length - 1]?.url.split('/').pop()} className='w-full h-[200px] object-contain rounded-t-xl' />
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
                        onClick={() => handleTokenVerify(tokenFeeDetails?._id, reason, "flagged")}>Mark as Flagged</Button>
                    </div>
                  </div> :
                  <div className="flex gap-4 mt-4">
                    <Button variant="outline" className="flex gap-2 border-[#FF503D] text-[#FF503D] bg-[#FF503D]/[0.2] "
                      onClick={() => setFlagOpen(true)} disabled={latestCohort?.status === 'dropped'}>
                        <FlagIcon className="w-4 h-4"/> Flag Reciept
                    </Button>
                    <Button variant="outline" className="flex gap-2 border-[#2EB88A] text-[#2EB88A] bg-[#2EB88A]/[0.2]"
                      onClick={() => handleTokenVerify(tokenFeeDetails?._id, "", "paid")} disabled={latestCohort?.status === 'dropped'}>
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
                <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => handleDownload(tokenFeeDetails?.receipts?.[tokenFeeDetails?.receipts.length - 1]?.url)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
              </>
              }
              {(tokenFeeDetails?.feedback && tokenFeeDetails?.feedback.length > 0) && 
                <div className="space-y-3">
                  <Separator />
                    {tokenFeeDetails?.feedback.slice().reverse().map((feedback: any, index: any) => (
                      <div key={index} className="sapce-y-4 text-muted-foreground text-sm">
                        <div className="flex justify-between items-center">
                          <div className="">
                            Reason:
                          </div>
                          <div className="text-[#FF503D]">Rejected on {new Date(feedback?.date).toLocaleDateString()}</div>
                        </div>
                        <div className="">
                          {feedback?.text?.map((item: string, index: number) => (
                            <div className="" key={index}>{item}</div>
                          ))}
                        </div>
                        <Button variant="ghost" className="px-0 text-white" size="sm" onClick={() => handleView(tokenFeeDetails?.receipts?.[tokenFeeDetails?.feedback.length - 1 - index]?.url)}>
                          <Eye className="h-4 w-4 mr-2" /> Acknowledgement Receipt
                        </Button>
                      </div>
                    ))}
                </div>
              }
            </div>

            {paymentDetails?.paymentPlan === 'one-shot' ? 
              <Card className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium">One Shot Payment</h5>
                  </div>
                  <div className="flex items-center gap-2">
                    {(new Date(paymentDetails?.oneShotPayment?.installmentDate) < new Date() && paymentDetails?.oneShotPayment?.verificationStatus === 'pending' ) ?
                      <Badge variant={getStatusColor('overdue')}>
                        overdue
                      </Badge>
                    :
                    <Badge variant={getStatusColor(paymentDetails?.oneShotPayment?.verificationStatus || '')}>
                      {paymentDetails?.oneShotPayment?.verificationStatus}
                    </Badge>
                    }
                    {paymentDetails?.oneShotPayment?.receiptUrls[paymentDetails?.oneShotPayment?.receiptUrls.length - 1]?.url && 
                      <Button variant="ghost" size="sm" onClick={() => handleView(paymentDetails?.oneShotPayment?.receiptUrls[paymentDetails?.oneShotPayment?.receiptUrls.length - 1]?.url)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    }
                  </div>
                </div>
                <div>
                  <p className="text-sm ">Amount: ₹{formatAmount(paymentDetails?.oneShotPayment?.amountPayable)}</p>
                  <p className="text-sm text-muted-foreground">Base Amount: ₹{formatAmount(paymentDetails?.oneShotPayment?.baseFee)}</p>
                  <p className="text-sm text-muted-foreground">One Shot Discount: ₹{formatAmount(paymentDetails?.oneShotPayment?.OneShotPaymentAmount)}</p>
                  <p className="text-sm text-muted-foreground">Scholarship Waiver: ₹{formatAmount(paymentDetails?.oneShotPayment?.baseFee*scholarshipDetails?.scholarshipPercentage*0.01)}</p>
                </div>
                <div className="flex justify-between items-center gap-2">
                  {paymentDetails?.oneShotPayment?.verificationStatus === 'paid' ?
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      Paid: {new Date(paymentDetails?.oneShotPayment?.receiptUrls?.[paymentDetails?.oneShotPayment?.receiptUrls.length - 1]?.uploadedAt).toLocaleDateString()}
                    </div> :
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      Due: {new Date(paymentDetails?.oneShotPayment?.installmentDate).toLocaleDateString()}
                    </div>
                  }
                </div>
                {paymentDetails?.oneShotPayment?.receiptUrls[paymentDetails?.oneShotPayment?.receiptUrls.length - 1]?.url ? (
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                ) : 
                uploadStates[`oneshot`]?.uploading ?
                  <div className="flex justify-between items-center gap-4">
                    {/* <div className="flex flex-1 truncate">{uploadStates[`oneshot`]?.fileName}</div> */}
                    <div className="flex items-center gap-2">
                      {uploadStates[`oneshot`]?.uploadProgress === 100 ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Progress className="h-2 w-20" states={[ { value: uploadStates[`oneshot`]?.uploadProgress, widt: uploadStates[`oneshot`]?.uploadProgress, color: '#ffffff' }]} />
                          <span>{uploadStates[`oneshot`]?.uploadProgress}%</span>
                        </>
                      )}
                      <Button variant="ghost" size="sm">
                        <XIcon className="w-4" />
                      </Button>
                    </div>
                  </div> :
                  <label className="cursor-pointer w-full">
                  <Button variant="outline" size="sm" className="w-full mt-2" 
                    onClick={() => document.getElementById(`file-input-oneshot`)?.click()} disabled={latestCohort?.status === 'dropped'}>
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Upload Receipt
                  </Button>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id={`file-input-oneshot`}
                    onChange={(e) => {
                      handleFileChange(e, paymentDetails?._id, true);
                    }}
                  />
                </label>
              }             
              </Card> : 
              <div className="space-y-2">
              {visibleSemesters?.map((semesterDetails: any, semesterIndex: number) => (
                <div key={semesterIndex}>
                  <Badge variant="blue" className="capitalize mb-3">
                    Semester {semesterDetails.semester}
                  </Badge>
                  <div className="space-y-4">
                    {semesterDetails.installments?.map((instalment: any, instalmentIndex: number) => (
                      <div key={instalmentIndex} className="border rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Instalment {instalmentIndex + 1}</h4>
                            <p className="text-sm text-muted-foreground">
                              Amount: ₹{formatAmount(instalment?.amountPayable)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {(paymentDetails && lastStatus !== 'pending') && (
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
                          {instalment.verificationStatus === 'paid' ? (
                            <Button variant="outline" size="sm" className="w-full mt-2"
                              onClick={() => window.open(instalment.receiptUrls?.[instalment?.receiptUrls.length - 1]?.url, "_blank")}>
                              <Download className="h-4 w-4 mr-2" />
                              Download Receipt
                            </Button>
                          ) : instalment.verificationStatus === 'verifying' ? (
                            <Button variant="outline" size="sm" className="w-full mt-2"
                              onClick={() => handleVerifyDialog(instalment, instalmentIndex + 1,semesterDetails.semester)}>
                              <EyeIcon className="h-4 w-4 mr-2" />
                              Acknowledgement Receipt
                            </Button>
                          ) : uploadStates[`${instalmentIndex + 1}${semesterDetails.semester}`]?.uploading ?
                          <div className="flex flex-1 justify-between items-center gap-4 truncate">
                            {/* <div className="flex flex-1 truncate">{uploadStates[`${installmentIndex + 1}${semesterDetail.semester}`]?.fileName}</div> */}
                            <div className="flex items-center gap-2">
                              {uploadStates[`${instalmentIndex + 1}${semesterDetails.semester}`]?.uploadProgress === 100 ? (
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Progress className="h-2 w-20" states={[ { value: uploadStates[`${instalmentIndex + 1}${semesterDetails.semester}`]?.uploadProgress, widt: uploadStates[`${instalmentIndex + 1}${semesterDetails.semester}`]?.uploadProgress, color: '#ffffff' }]} />
                                  <span>{uploadStates[`${instalmentIndex + 1}${semesterDetails.semester}`]?.uploadProgress}%</span>
                                </>
                              )}
                              <Button variant="ghost" size="sm">
                                <XIcon className="w-4" />
                              </Button>
                            </div>
                          </div> : (
                          (paymentDetails && lastStatus !== 'pending') &&
                            <label className="cursor-pointer w-full">
                              <Button variant="outline" size="sm" className="w-full mt-2" 
                                onClick={() => document.getElementById(`file-input-${instalmentIndex + 1}${semesterDetails.semester}`)?.click()}
                                disabled={latestCohort?.status === 'dropped'}>
                                <UploadIcon className="h-4 w-4 mr-2" />
                                Upload Receipt
                              </Button>

                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id={`file-input-${instalmentIndex + 1}${semesterDetails.semester}`}
                                onChange={(e) => {
                                  handleFileChange(e, paymentDetails?._id, false, instalmentIndex + 1, semesterDetails.semester);
                                }}
                              />
                            </label>
                          )} 
                          <div className="hidden">
                              {lastStatus = instalment?.verificationStatus}
                            </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
                <Button
                  variant="ghost" className="w-full underline"
                  onClick={() => setShowAllSemesters(!showAllSemesters)}
                >
                  {showAllSemesters ? "View Less" : "View More"}
                </Button>
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

    <Dialog open={vopen} onOpenChange={setVopen}>
      <DialogTitle></DialogTitle>
        <DialogContent className="max-w-4xl py-2 px-6 overflow-y-auto">
          <div className="flex items-center gap-4">
            <div className="space-y-1">
              <h2 className="text-base font-semibold">{student?.firstName} {student?.lastName}</h2>
              <div className="flex gap-2 h-5 items-center">
                <p className="text-sm text-muted-foreground">{student?.email}</p>
                <Separator orientation="vertical" />
                <p className="text-sm text-muted-foreground">{student?.mobileNumber}</p>
              </div>
            </div>
          </div>
          {flagOpen && 
            <Button variant="outline" className="flex gap-2 items-center" onClick={() => setFlagOpen(false)} disabled={loading}>
              <ArrowLeft className="w-4 h-4" />Back to Payment Approval
            </Button>
          }
          <Card className="p-4 space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <h5 className="font-medium">Instalment {instalmentNo}</h5>
                <p className="text-xs text-[#00A3FF]">Semester {semesterNo}</p>
              </div>
            </div>
            <div>
              <p className="text-sm ">
                Amount Payable: ₹{formatAmount(instalment?.amountPayable)}
              </p>
              <p className="text-sm text-muted-foreground">
                Base Amount: ₹{formatAmount(instalment?.baseFee + instalment?.scholarshipAmount)}
              </p>
              <p className="text-sm text-muted-foreground">
                Scholarship Waiver: ₹{formatAmount(instalment?.scholarshipAmount)}
              </p>
            </div>
            <div className="flex justify-start items-center gap-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                Due: {new Date(instalment?.installmentDate).toLocaleDateString()}
              </div>
              {instalment?.receiptUrls?.[instalment?.receiptUrls.length - 1]?.uploadedAt && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Paid: {new Date(instalment?.receiptUrls?.[instalment.receiptUrls.length - 1]?.uploadedAt).toLocaleDateString()}
                </div>
              )}
            </div>
            {instalment ? (
                <div className="w-full flex bg-[#64748B33] flex-col items-center rounded-xl">
                  <img src={instalment?.receiptUrls?.[instalment?.receiptUrls.length - 1]?.url} alt={'Fee_Receipt'} className='w-full h-[160px] object-contain rounded-t-xl' />
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No receipt found.</p>
              )}
          </Card>

          {flagOpen ?
            <div className="space-y-4 ">
              <div className="mt-2 space-y-2">
                <label className="text-sm">Provide Reasons for Rejection</label>
                <Textarea className="h-[100px]" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Type your reasons here..."/>
              </div>
              <Button className="flex-1" disabled={!reason.trim() || loading}
                onClick={() => handleFeeVerify(instalmentNo, semesterNo , reason, "flagged")}
                >
                Confirm and Update Status
              </Button>
            </div> :
            <div className="flex gap-2 mt-2">
              <Button variant="outline" className="flex-1 border-[#FF503D] text-[#FF503D] bg-[#FF503D]/[0.2] " disabled={loading || latestCohort?.status === 'dropped'}
                onClick={() => setFlagOpen(true)}> Reject
              </Button>
              <Button variant="outline" className="flex-1 bg-[#2EB88A]" disabled={loading || latestCohort?.status === 'dropped'}
                onClick={() => handleFeeVerify(instalmentNo, semesterNo, "", "paid")}> Approve
              </Button>
            </div>
          }
        </DialogContent>
      </Dialog>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle></DialogTitle>
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