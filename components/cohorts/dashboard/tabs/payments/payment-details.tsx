"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  UserMinus,
  X,
  Download,
  Calendar,
  UploadIcon,
  DownloadIcon,
  Star,
  Eye,
  EyeIcon,
  ArrowLeft,
  LoaderCircle,
  XIcon,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { MarkedAsDialog } from "@/components/students/sections/drop-dialog";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { AwardScholarship } from "../litmus/litmus-test-dialog/award-scholarship";
import { Textarea } from "@/components/ui/textarea";
import { uploadFeeReceipt, verifyFeeStatus, verifyTokenAmount } from "@/app/api/student";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

type BadgeVariant = "lemon" | "pending" | "warning" | "secondary" | "success" | "default";

interface UploadState {
  uploading: boolean;
  uploadProgress: number;
  fileName: string;
}

interface PaymentDetailsProps {
  student: any;
  onClose: () => void;
  onApplicationUpdate: () => void;
}

export function PaymentDetails({ student, onClose, onApplicationUpdate }: PaymentDetailsProps) {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [markedAsDialogOpen, setMarkedAsDialogOpen] = useState(false);
  const [schOpen, setSchOpen] = useState(false);
  const [showAllSemesters, setShowAllSemesters] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [instalment, setInstalment] = useState<any>();
  const [instalmentNo, setInstalmentNo] = useState<any>();
  const [semesterNo, setSemesterNo] = useState<any>();
  const [open, setOpen] = useState(false);
  const [vopen, setVopen] = useState(false);

  const [uploadStates, setUploadStates] = useState<{ [key: string]: UploadState }>({});
  
  const handleView = (url: string) => {
    setImageUrl(url);
    setOpen(true);
  };

  const handleVerifyDialog = (instalment: any, insIndex: any, semIndex: any) => {
    setInstalment(instalment);
    setInstalmentNo(insIndex);
    setSemesterNo(semIndex);
    setVopen(true);
  };

  const latestCohort = student?.appliedCohorts?.[student?.appliedCohorts.length - 1];
  const cohortDetails = latestCohort?.cohortId; 
  const litmusTestDetails = latestCohort?.litmusTestDetails;
  const scholarshipDetails = litmusTestDetails?.scholarshipDetail;
  const [tokenFeeDetails, setTokenFeeDetails] = useState<any>(latestCohort?.tokenFeeDetails);
  const [paymentDetails, setPaymentDetails] = useState<any>(latestCohort?.paymentDetails);

  useEffect(() => {
    setTokenFeeDetails(latestCohort?.tokenFeeDetails)
    setPaymentDetails(latestCohort?.paymentDetails);
    console.log("Dvd",student);
    
  }, [student]);

  const tokenAmount = Number(latestCohort?.cohortId?.cohortFeesDetail?.tokenFee) || 0;
  const applicationDetails = latestCohort?.applicationDetails;
  
    ////////////////////////////
    const [flagOpen, setFlagOpen] = useState(false);
    const [reason, setReason] = useState("");

    
    const handleDownload = (url: string) => {
        const link = document.createElement("a");
          link.href = url;
          link.download = "Receipt.pdf"; // Default filename for the download
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      };
    
      async function handleTokenVerify(tokenId: any, comment: string, verificationStatus: string) {
        try {
          if (!tokenId) {
            console.error("Admission Fee ID is not available");
            return;
          }  
          setLoading(true)
          const response = await verifyTokenAmount(tokenId, comment, verificationStatus);
          setTokenFeeDetails(response.token);
          setFlagOpen(false);
          onApplicationUpdate();
        } catch (error) {
          console.error("Error verifying token amount:", error);
        } finally {
          setLoading(false)
        }
      } 

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
          onApplicationUpdate();
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
            onApplicationUpdate()
            setPaymentDetails(response.updatedPayment
            );
      
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

    ////////////////////////
  let lastStatus = '';

  const visibleSemesters = paymentDetails?.installments
  // ?.slice(0, 1); 


  const colorClasses = ['text-emerald-600', 'text-[#3698FB]', 'text-[#FA69E5]', 'text-orange-600'];

  let paidAmount = 0;
  let notPaidAmount = 0;

  if(tokenFeeDetails?.verificationStatus === 'paid'){
    paidAmount += tokenAmount;
  } else {
    notPaidAmount += tokenAmount;
  }

  if (paymentDetails?.paymentPlan === 'one-shot') {
    const oneShotDetails = paymentDetails?.oneShotPayment;
    if (oneShotDetails) {
      if (oneShotDetails?.verificationStatus === 'paid') {
        paidAmount += oneShotDetails?.amountPayable;
      } else{
        notPaidAmount += oneShotDetails?.amountPayable;
      }
    }
  } else if (paymentDetails?.paymentPlan === 'instalments') {
    paymentDetails?.installments.forEach((semesterDetail: any) => {
      const installments = semesterDetail?.installments;
      installments.forEach((instalment: any) => {
        if (instalment?.verificationStatus === 'paid') {
          paidAmount += instalment?.amountPayable;
        } else {
          notPaidAmount += instalment?.amountPayable;
        }    
      });
    });
  } else {
    const matchedScholarship = litmusTestDetails?.scholarshipDetail;
    const fallbackScholarship = cohortDetails.feeStructureDetails.find(
      (scholarship: any) => scholarship.scholarshipName === "No Scholarship"
    );
    const installments = (matchedScholarship?.installmentDetails || fallbackScholarship?.installmentDetails)?.flatMap((semester: any) => semester.installments) || [];
    notPaidAmount += installments.reduce((sum: number, installment: any) => sum + (installment.amountPayable || 0), 0);
  }

  const getStatusColor = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "paid":
        return "success";
      case "pending":
        return "default";
      case "overdue":
      case "flagged":
        return "warning";
      case "verifying":
      case "verification pending":
        return "pending";
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


  const formatAmount = (value: number) =>
    value === 0
      ? "--" :
      new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(value));

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-start justify-between ">
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
                <p className={`font-medium ${getColor(scholarshipDetails?.scholarshipName)}`}>
                  {scholarshipDetails ? 
                  `${scholarshipDetails?.scholarshipName+' ('+scholarshipDetails?.scholarshipPercentage+'%)'}` : 
                  <span className="text-muted-foreground">Not Assigned</span>}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Admission Fee Status</p>
                <span className="text-base mr-2">₹{formatAmount(latestCohort?.cohortId?.cohortFeesDetail?.tokenFee)}</span>
                {tokenFeeDetails?.verificationStatus &&
                  <Badge className="capitalize" variant={getStatusColor(tokenFeeDetails?.verificationStatus || '')}>
                    {tokenFeeDetails?.verificationStatus}
                  </Badge>
                }
              </div>
            </div>
            <div className="space-y-1 mt-2">
              <div className="flex justify-between text-sm">
                <span>Payment Progress</span>
                <span className="pr-3">
                  {notPaidAmount ? 
                  `${((paidAmount / (paidAmount+notPaidAmount)) * 100).toFixed(0)}%` :
                  '--'}
                </span>
              </div>
              <Progress states={[
                { value: (paidAmount), widt: ((paidAmount / (paidAmount+notPaidAmount)) * 100), color: '#2EB88A' }
              ]} />
            </div>
          </div>

          <Separator />

          {/* Quick Actions */}
          {latestCohort?.status === 'dropped' ?
            <div className="bg-[#FF503D1A] px-4 py-3 rounded-lg space-y-2">
              <div className="flex justify-between gap-2">
                <div className="flex gap-2 items-center justify-start text-destructive">
                  <UserMinus className="h-4 w-4 text-red-500" />
                  Mark as Dropped
                </div>
                <div className="">By Admin</div>
              </div>
              <div className="">
                {latestCohort?.reasonForDropped?.[latestCohort?.reasonForDropped.length - 1]?.notes && 
                latestCohort?.reasonForDropped?.[latestCohort?.reasonForDropped.length - 1]?.notes.map((reason: any, index: any) => (
                  <div key={index} className="text-sm">{reason}</div>
                ))} 
              </div>  
            </div> :
            <div className="space-y-2">
              <h4 className="font-medium">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start" disabled>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Presen...
                </Button>
                <Button variant="outline" className="justify-start" disabled>
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Download Files
                </Button>
                {scholarshipDetails ? 
                    <Button variant="outline" className={`justify-start ${getColor(scholarshipDetails?.scholarshipName)}`} onClick={() => setSchOpen(true)}>
                      <div className="flex gap-2 items-center">
                        <span className="text-lg pb-[2px]">★ </span> {scholarshipDetails?.scholarshipName+' ('+scholarshipDetails?.scholarshipPercentage+'%)'}
                      </div> 
                    </Button>
                      :
                    <Button variant="outline" className="justify-start" disabled>
                      <div className="flex gap-2 items-center">
                        <Star className="h-4 w-4" />
                        Award Scholarship
                      </div>
                    </Button>
                  }
                <Button variant="outline" className="border-none bg-[#FF503D1A] hover:bg-[#FF503D]/20 justify-start text-destructive" onClick={()=>setMarkedAsDialogOpen(true)}>
                  <UserMinus className="h-4 w-4 mr-2" />
                  Mark as Dropped
                </Button>

                <Dialog open={markedAsDialogOpen} onOpenChange={setMarkedAsDialogOpen}>
                <DialogTitle></DialogTitle>
                  <DialogContent className="max-w-4xl py-4 px-6">
                    <MarkedAsDialog student={student} onUpdateStatus={() => onApplicationUpdate()} onClose={() => setMarkedAsDialogOpen(false)}/>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          }

          <Separator />

          {/* Instalments */}
          <div className="space-y-4">
            <h4 className="font-medium">Payment Schedule</h4>

            <div className="border rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h4 className="font-medium">Admission Fee</h4>
                <p className="text-sm ">Amount Payable: ₹{formatAmount(tokenAmount)}</p>
                
                  {tokenFeeDetails && (
                    <p className="flex text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      Uploaded on {new Date( tokenFeeDetails?.updatedAt ).toLocaleDateString()}
                    </p>
                  )}
              </div>
              <div className="flex items-center gap-2">
                {applicationDetails?.applicationStatus === 'selected' && 
                  <Badge className="capitalize" variant={getStatusColor(tokenFeeDetails?.verificationStatus || '')}>
                    {tokenFeeDetails?.verificationStatus || 'pending'}
                  </Badge>
                }
                {tokenFeeDetails?.verificationStatus === 'paid' && 
                <Button variant="ghost" size="sm" className="px-0 py-1 text-white text-xs" onClick={() => handleView(tokenFeeDetails?.receipts?.[tokenFeeDetails?.receipts.length - 1]?.url)}>
                  <Eye className="h-3 w-3 mr-2" />
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
                  <img src={tokenFeeDetails?.receipts?.[tokenFeeDetails?.receipts.length - 1]?.url} alt={tokenFeeDetails?.receipts?.[tokenFeeDetails?.receipts.length - 1]?.url.split('/').pop()} className='w-full h-[160px] object-contain rounded-t-xl' />
                </div>
                {flagOpen ?
                <div className="space-y-4 ">
                  <div className="mt-2 space-y-2">
                    <label className="text-sm">Provide Reasons</label>
                    <Textarea className="h-[100px]" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Type your reasons here..."/>
                  </div>
                  <div className="flex gap-2" >
                    <Button variant="outline" className="flex" disabled={loading} onClick={() => setFlagOpen(false)}>Back</Button>
                    <Button className="flex-1" disabled={!reason.trim() || loading}
                      onClick={() => handleTokenVerify(tokenFeeDetails?._id, reason, "flagged")}>Mark as Flagged</Button>
                  </div>
                </div> :
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" className="flex-1 border-[#FF503D] text-[#FF503D] bg-[#FF503D]/[0.2] hover:bg-[#FF503D]/[0.1] " disabled={loading}
                    onClick={() => setFlagOpen(true)}> Reject
                  </Button>
                  <Button variant="outline" className="flex-1 bg-[#2EB88A] hover:bg-[#2EB88A]/90" disabled={loading}
                    onClick={() => handleTokenVerify(tokenFeeDetails?._id, "", "paid")}> Approve
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
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Due: {new Date(paymentDetails?.oneShotPayment?.installmentDate).toLocaleDateString()}
                </div>
                {paymentDetails?.oneShotPayment?.receiptUrls[paymentDetails?.oneShotPayment?.receiptUrls.length - 1]?.uploadedDate && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Paid: {new Date(paymentDetails?.oneShotPayment?.receiptUrls[paymentDetails?.oneShotPayment?.receiptUrls.length - 1]?.uploadedDate).toLocaleDateString()}
                  </div>
                )}
              </div>
              {paymentDetails?.oneShotPayment?.receiptUrls[paymentDetails?.oneShotPayment?.receiptUrls.length - 1]?.url ? (
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
              ) : uploadStates[`oneshot`]?.uploading ?
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
                <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => document.getElementById(`file-input-oneshot`)?.click()}>
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
              <Tabs defaultValue={'1'} className="space-y-4">
              {visibleSemesters?.map( (semesterDetail: any, semesterIndex: number) => (
                <TabsList variant='ghost'>
                  <TabsTrigger key={`${semesterDetail.semester}`} variant="xs" value={`${semesterDetail.semester}`}>Sem {semesterDetail.semester}</TabsTrigger>
                </TabsList>
              ))}
              {visibleSemesters?.map( (semesterDetail: any, semesterIndex: number) => (
                <TabsContent value={`${semesterDetail.semester}`}>
                  <div key={semesterIndex} className="space-y-2">
                  {semesterDetail?.installments?.map((instalment: any, installmentIndex: number) => (
                    <Card key={installmentIndex} className="p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="font-medium">instalment {installmentIndex + 1}</h5>
                          <p className="text-xs text-[#00A3FF]">Semester {semesterDetail.semester}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {lastStatus !== 'pending' && (
                            (new Date(instalment?.installmentDate) < new Date() && instalment?.verificationStatus === 'pending' && !(instalment.receiptUrls?.[instalment?.receiptUrls.length - 1]?.uploadedDate)) ?
                              <Badge variant={getStatusColor('overdue')}>
                                overdue
                              </Badge>
                            :
                              <Badge className="capitalize" variant={getStatusColor(instalment.verificationStatus || '')}>
                                {instalment.verificationStatus}
                              </Badge>
                          )}
                          {instalment.verificationStatus === 'paid' && 
                            <Button variant="ghost" size="sm" onClick={() => handleView(instalment.receiptUrls?.[instalment.receiptUrls.length - 1]?.url)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm">
                          Amount Payable: ₹{formatAmount(instalment.amountPayable)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Base Amount: ₹{formatAmount(instalment.baseFee + instalment.scholarshipAmount)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Scholarship Waiver: ₹{formatAmount(instalment.scholarshipAmount)}
                        </p>
                      </div>
                      <div className="justify-between items-center gap-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          Due: {new Date(instalment.installmentDate).toLocaleDateString()}
                        </div>
                        {instalment?.receiptUrls?.[instalment?.receiptUrls.length - 1]?.uploadedAt && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            Paid: {new Date(instalment.receiptUrls[instalment.receiptUrls.length - 1]?.uploadedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      {instalment.verificationStatus === 'paid' ? (
                        <Button variant="outline" size="sm" className="w-full mt-2"
                          onClick={() => window.open(instalment.receiptUrls?.[instalment?.receiptUrls.length - 1]?.url, "_blank")}>
                          <Download className="h-4 w-4 mr-2" />
                          Download Receipt
                        </Button>
                      ) : instalment.verificationStatus === 'verifying' ? (
                        <Button variant="outline" size="sm" className="w-full mt-2"
                          onClick={() => handleVerifyDialog(instalment, installmentIndex + 1,semesterDetail.semester)}>
                          <EyeIcon className="h-4 w-4 mr-2" />
                          Acknowledgement Receipt
                        </Button>
                      ) : uploadStates[`${installmentIndex + 1}${semesterDetail.semester}`]?.uploading ?
                      <div className="flex flex-1 justify-between items-center gap-4 truncate">
                        {/* <div className="flex flex-1 truncate">{uploadStates[`${installmentIndex + 1}${semesterDetail.semester}`]?.fileName}</div> */}
                        <div className="flex items-center gap-2">
                          {uploadStates[`${installmentIndex + 1}${semesterDetail.semester}`]?.uploadProgress === 100 ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Progress className="h-2 w-20" states={[ { value: uploadStates[`${installmentIndex + 1}${semesterDetail.semester}`]?.uploadProgress, widt: uploadStates[`${installmentIndex + 1}${semesterDetail.semester}`]?.uploadProgress, color: '#ffffff' }]} />
                              <span>{uploadStates[`${installmentIndex + 1}${semesterDetail.semester}`]?.uploadProgress}%</span>
                            </>
                          )}
                          <Button variant="ghost" size="sm">
                            <XIcon className="w-4" />
                          </Button>
                        </div>
                      </div> : (
                      lastStatus !== 'pending' &&
                        <label className="cursor-pointer w-full">
                          <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => document.getElementById(`file-input-${installmentIndex + 1}${semesterDetail.semester}`)?.click()}>
                            <UploadIcon className="h-4 w-4 mr-2" />
                            Upload Receipt
                          </Button>

                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id={`file-input-${installmentIndex + 1}${semesterDetail.semester}`}
                            onChange={(e) => {
                              handleFileChange(e, paymentDetails?._id, false, installmentIndex + 1, semesterDetail.semester);
                            }}
                          />
                        </label>
                      )}
                      <div className="hidden">
                        {lastStatus = instalment.verificationStatus}
                      </div>
                    </Card>
                  ))}
                </div>
                </TabsContent>
              ))}
                </Tabs>
              {/* {visibleSemesters?.map( (semesterDetail: any, semesterIndex: number) => (
                
              )
            )} */}
              {/* {paymentDetails?.paymentPlan === 'instalments' && (
                <Button
                  variant="ghost" className="w-full underline"
                  onClick={() => setShowAllSemesters(!showAllSemesters)}
                >
                  {showAllSemesters ? "View Less" : "View More"}
                </Button>
              )} */}
            </div>
            }
          </div>

          <Dialog open={schOpen} onOpenChange={setSchOpen}>
          <DialogTitle></DialogTitle>
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
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle></DialogTitle>
        <DialogContent className="max-w-4xl py-2 px-6 overflow-y-auto">
          {imageUrl ? (
            <img src={imageUrl} alt="Receipt" className="mx-auto h-[50vh] object-contain"/>
          ) : (
            <p className="text-center text-muted-foreground">No receipt found.</p>
          )}
        </DialogContent>
      </Dialog>

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
              <Button variant="outline" className="flex-1 border-[#FF503D] text-[#FF503D] bg-[#FF503D]/[0.2] " disabled={loading}
                onClick={() => setFlagOpen(true)}> Reject
              </Button>
              <Button variant="outline" className="flex-1 bg-[#2EB88A]" disabled={loading}
                onClick={() => handleFeeVerify(instalmentNo, semesterNo, "", "paid")}> Approve
              </Button>
            </div>
          }
        </DialogContent>
      </Dialog>
    </div>
  );
}