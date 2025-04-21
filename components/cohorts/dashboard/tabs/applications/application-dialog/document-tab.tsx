"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleCheckBig, Download, Eye, FlagIcon, LoaderCircle, Upload, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { updateDocumentStatus, uploadStudentDocuments, } from "@/app/api/student";
import axios from "axios";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

type BadgeVariant = "warning" | "success" | "pending" | "default";
interface UploadState {
  uploading: boolean;
  uploadProgress: number;
  fileName: string;
}

interface DocumentsTabProps {
  student: any;
  onUpdateStatus: () => void;
}

export function DocumentsTab({ student, onUpdateStatus }: DocumentsTabProps) {
    
  const latestCohort = student?.appliedCohorts?.[student?.appliedCohorts.length - 1];
  const cohortDetails = latestCohort?.cohortId;

  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [uploadStates, setUploadStates] = useState<{ [docId: string]: UploadState }>({});
  const [docs, setDocs] = useState<any[]>([]);

  const [flagOpen, setFlagOpen] = useState(false);
  const [reason, setReason] = useState("");
  
  const [open, setOpen] = useState(false);
  const [viewDoc, setViewDoc] = useState("");

  const reqDocuments = [
    {
      id: "aadharDocument",
      name: "ID Proof (Aadhar card)",
      type: "PDF",
      size: "5 MB",
    },
    {
      id: "secondarySchoolMarksheet",
      name: "10th Marks Sheet",
      type: "PDF",
      size: "5 MB",
    },
    {
      id: "higherSecondaryMarkSheet",
      name: "12th Marks Sheet",
      type: "PDF",
      size: "5 MB",
    },
    {
      id: "higherSecondaryTC",
      name: "12th Transfer Certificate",
      type: "PDF",
      size: "5 MB",
    },
    {
      id: "graduationMarkSheet",
      name: "Graduation Marks Sheet",
      type: "PDF",
      size: "5 MB",
    },
  ];

  const parentDocuments = [
    {
      id: "fatherIdProof",
      name: "Father’s ID Proof (Aadhar/PAN Card/Passport)",
      type: "PDF",
      size: "5 MB",
    },
    {
      id: "motherIdProof",
      name: "Father’s ID Proof (Aadhar/PAN Card/Passport)",
      type: "PDF",
      size: "5 MB",
    },
  ];

  useEffect(() => {
    setDocs(latestCohort?.personalDocs?.documents || []);
  }, [student]);

  // Handle document action (flag/verify)
  const handleDocumentVerification = async ( personalDocId: string, docId: string, status: string, feedback?: string ) => {
    try {
      setLoading(true);
      const payLoad = {
        personalDocId: personalDocId,
        docId: docId,
        status: status,
        feedback: [feedback]
      }
      console.log("Updated document status:", payLoad);
      const response = await updateDocumentStatus(payLoad);
      console.log("Updated document status:", response);
      // setDocs(response.data.documents)
      toast({
        title: `Document ${status}`,
        description: response.message || `Document ${status} successfully`,
        variant: "success",
      });
      onUpdateStatus();
    } catch (error: any) {
      console.error("Error updating document status:", error);
      toast({
        title: "Document Verification Failed",
        description: error.message || "Error updating document status. Please try again.",
        variant: "warning",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileDownload = async (url: string, docName: string) => {
    setDownloading(true);
    try {
      // 1. Fetch the file as Blob
      const response = await fetch(url);
      const blob = await response.blob();

      // 2. Create a temporary object URL for that Blob
      const blobUrl = URL.createObjectURL(blob);

      // 3. Create a hidden <a> and force download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${docName}.pdf`;  // or "myImage.png"
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed", err);
    } finally {
      setDownloading(false)
    }
  };

  const handleFileChange = async ( e: React.ChangeEvent<HTMLInputElement>, docId: string) => {
    setError(null);

    setUploadStates(prev => ({
      ...prev,
      [docId]: { uploading: true, uploadProgress: 0, fileName: "" }
    }));

    const file = e.target.files?.[0];
    if (!file) return;
    const fileKey = generateUniqueFileName(file.name);
    
    // Update fileName for this document
    setUploadStates(prev => ({
      ...prev,
      [docId]: { ...prev[docId], fileName: fileKey }
    }));

    const CHUNK_SIZE = 100 * 1024 * 1024;
    e.target.value = "";

    try {
      let fileUrl = "";
      if (file.size <= CHUNK_SIZE) {
        fileUrl = await uploadDirect(file, fileKey, docId);
        console.log("uploadDirect File URL:", fileUrl);
      } else {
        fileUrl = await uploadMultipart(file, fileKey, CHUNK_SIZE, docId);
        console.log("uploadMultipart File URL:", fileUrl);
      }

      const payload = {
        studentId: student?._id,
        cohortId: cohortDetails?._id,
        fieldName: docId,
        fileUrl: fileUrl,
      };

      console.log("payload", payload);
    
      // Call the API function with FormData
      const response = await uploadStudentDocuments(payload);
      console.log("Upload response:", response);
      onUpdateStatus()
      setDocs(response.data.documents);

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
        [docId]: { ...prev[docId], uploading: false }
      }));
      e.target.value = "";
    }
  };

  const uploadDirect = async (file: File, fileKey: string, docId: string) => {
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
          [docId]: { ...prev[docId], uploadProgress: Math.min(percentComplete, 100) }
        }));
      },
    });
    return `${url.split("?")[0]}`;
  };

  const uploadMultipart = async (file: File, fileKey: string, chunkSize: number, docId: string) => {
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
            [docId]: { ...prev[docId], uploadProgress: Math.min(percent, 100) }
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

  const getStatusColor = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "pending":
        return "pending";
      case "verified":
        return "success";
      case "flagged":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Required Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Required Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reqDocuments.map((doc: any, index: any) => {

            const docDetails = docs.length > 0 ? docs.find((d: any) => d.name === doc.id) : null;
            
            return (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  {/* Document Information */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{doc.name}</p>
                    </div>
                    {docDetails ? (
                      <div className="text-sm text-muted-foreground">
                        {doc.type} • {doc.size} • Uploaded on {new Date(docDetails?.date).toLocaleDateString()}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        • Upload in {doc.type} Format
                      </div>
                    )}
                  </div>


                {uploadStates[doc.id]?.uploading ?
                  <div className="flex items-center gap-2">
                    {uploadStates[doc.id]?.uploadProgress === 100 ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Progress className="h-2 w-20" states={[ { value: uploadStates[doc.id]?.uploadProgress, widt: uploadStates[doc.id]?.uploadProgress, color: '#ffffff' }]} />
                        <span>{uploadStates[doc.id]?.uploadProgress}%</span>
                      </>
                    )}
                    <Button variant="ghost" size="sm">
                      <XIcon className="w-4" />
                    </Button>
                  </div> :
                  docDetails ? (
                    <div className="flex items-center gap-2">
                      <Badge className="capitalize" variant={getStatusColor(docDetails?.status)}>
                        {docDetails?.status === 'pending' ? 'verification pending' : docDetails?.status}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => { setOpen(true); setViewDoc(docDetails?.url)}}>
                        <Eye className="h-4 w-4 mr-2" /> View
                      </Button>
                      {docDetails?.status === 'flagged' ?
                        <div className="flex items-center gap-2">
                          <label htmlFor={`file-input-${doc.id}`} className="cursor-pointer">
                            <Button variant="outline" asChild disabled={latestCohort?.status === 'dropped'}>
                              <span>Choose File</span>
                            </Button>
                            <input
                              type="file"
                              accept="application/pdf"
                              className="hidden"
                              id={`file-input-${doc.id}`}
                              onChange={(e) => handleFileChange(e, doc.id)}
                            />
                          </label>
                        </div> :
                        <Button variant="ghost" size="sm" onClick={() => handleFileDownload(docDetails?.url, doc.name)} disabled={downloading}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      }
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <label htmlFor={`file-input-${doc.id}`} className="cursor-pointer">
                        <Button variant="outline" asChild disabled={latestCohort?.status === 'dropped'}>
                          <span>Choose File</span>
                        </Button>
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          id={`file-input-${doc.id}`}
                          onChange={(e) => handleFileChange(e, doc.id)}
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Show Flag/Verify actions if the document is uploaded and marked as "updated" */}
                {docDetails?.status === "pending" && (
                  flagOpen ?
                    <div className="space-y-4 ">
                      <div className="mt-2 space-y-2">
                        <label className="text-base">Provide Reasons</label>
                        <Textarea className="h-[100px]" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Type your reasons here..."/>
                      </div>
                      <div className="flex gap-2" >
                        <Button variant="outline" className="flex" onClick={() => setFlagOpen(false)}>Back</Button>
                        <Button className="flex-1" disabled={!reason.trim()}
                          onClick={() => handleDocumentVerification(latestCohort?.personalDocs?._id, docDetails._id, "flagged", reason)}>Mark as Flagged</Button>
                      </div>
                    </div> :
                  <div className="flex gap-4 mt-4">
                    <Button variant="outline" className="flex gap-2 border-[#FF503D] text-[#FF503D] bg-[#FF503D]/[0.2]" disabled={loading || latestCohort?.status === 'dropped'}
                      onClick={() => setFlagOpen(true)}
                    >
                      <FlagIcon className="w-4 h-4" />
                      Flag Document
                    </Button>
                    <Button variant="outline" className="flex gap-2 border-[#2EB88A] text-[#2EB88A] bg-[#2EB88A]/[0.2]" disabled={loading || latestCohort?.status === 'dropped'}
                      onClick={() => handleDocumentVerification(latestCohort?.personalDocs?._id, docDetails._id, "verified")}
                    >
                      <CircleCheckBig className="w-4 h-4" />
                      Mark as Verified
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Parent's Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {parentDocuments.map((doc: any, index: any) => {

            const docDetails = docs.length > 0 ? docs.find((d: any) => d.name === doc.id) : null;
            
            return (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  {/* Document Information */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{doc.name}</p>
                    </div>
                    {docDetails ? (
                      <div className="text-sm text-muted-foreground">
                        {doc.type} • {doc.size} • Uploaded on {new Date(docDetails?.date).toLocaleDateString()}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        • Upload in {doc.type} Format
                      </div>
                    )}
                  </div>


                {uploadStates[doc.id]?.uploading ?
                  <div className="flex items-center gap-2">
                    {uploadStates[doc.id]?.uploadProgress === 100 ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Progress className="h-2 w-20" states={[ { value: uploadStates[doc.id]?.uploadProgress, widt: uploadStates[doc.id]?.uploadProgress, color: '#ffffff' }]} />
                        <span>{uploadStates[doc.id]?.uploadProgress}%</span>
                      </>
                    )}
                    <Button variant="ghost" size="sm">
                      <XIcon className="w-4" />
                    </Button>
                  </div> :
                  docDetails ? (
                    <div className="flex items-center gap-2">
                      <Badge className="capitalize" variant={getStatusColor(docDetails?.status)}>
                        {docDetails?.status === 'pending' ? 'verification pending' : docDetails?.status}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => { setOpen(true); setViewDoc(docDetails?.url)}}>
                        <Eye className="h-4 w-4 mr-2" /> View
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleFileDownload(docDetails?.url, doc.name)} disabled={downloading}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <label htmlFor={`file-input-${doc.id}`} className="cursor-pointer">
                        <Button variant="outline" asChild disabled={latestCohort?.status === 'dropped'}>
                          <span>Choose File</span>
                        </Button>
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          id={`file-input-${doc.id}`}
                          onChange={(e) => handleFileChange(e, doc.id)}
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Show Flag/Verify actions if the document is uploaded and marked as "updated" */}
                {docDetails?.status === "pending" && (
                  flagOpen ?
                    <div className="space-y-4 ">
                      <div className="mt-2 space-y-2">
                        <label className="text-base">Provide Reasons</label>
                        <Textarea className="h-[100px]" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Type your reasons here..."/>
                      </div>
                      <div className="flex gap-2" >
                        <Button variant="outline" className="flex" onClick={() => setFlagOpen(false)}>Back</Button>
                        <Button className="flex-1" disabled={!reason.trim()}
                          onClick={() => handleDocumentVerification(latestCohort?.personalDocs?._id, docDetails._id, "flagged", reason)}>Mark as Flagged</Button>
                      </div>
                    </div> :
                  <div className="flex gap-4 mt-4">
                    <Button variant="outline" className="flex gap-2 border-[#FF503D] text-[#FF503D] bg-[#FF503D]/[0.2]" disabled={loading || latestCohort?.status === 'dropped'}
                      onClick={() => setFlagOpen(true)}
                    >
                      <FlagIcon className="w-4 h-4" />
                      Flag Document
                    </Button>
                    <Button variant="outline" className="flex gap-2 border-[#2EB88A] text-[#2EB88A] bg-[#2EB88A]/[0.2]" disabled={loading || latestCohort?.status === 'dropped'}
                      onClick={() => handleDocumentVerification(latestCohort?.personalDocs?._id, docDetails._id, "verified")}
                    >
                      <CircleCheckBig className="w-4 h-4" />
                      Mark as Verified
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

        {/* Additional Documents */}
      {docs?.filter((doc: any) =>![ "graduationMarkSheet", "higherSecondaryMarkSheet", "secondarySchoolMarksheet", "aadharDocument", , "aadharDocument", "higherSecondaryTC", "fatherIdProof", "motherIdProof"].includes(doc.name)).length > 0 &&
      <>
        <Card>
          <CardHeader>
            <CardTitle>Additional Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {docs?.filter((doc: any) =>![ "graduationMarkSheet", "higherSecondaryMarkSheet", "secondarySchoolMarksheet", "aadharDocument", "higherSecondaryTC", "fatherIdProof", "motherIdProof" ].includes(doc.name)).map((doc: any) => (
              <div key={doc._id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium capitalize">{doc?.name}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      • Uploaded on {new Date(doc?.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { setOpen(true); setViewDoc(doc?.url) }}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleFileDownload(doc?.url, doc?.name)} disabled={downloading}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        </>
      }

      {/* PDF Preview Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle></DialogTitle>
        <DialogContent className="max-w-4xl py-2 px-6 h-[90vh] overflow-y-auto">
          {viewDoc ? (
            <div className="max-w-7xl justify-center flex items-center ">
              <iframe src={viewDoc} className="mx-auto w-[70%] h-full" style={{ border: 'none' }}></iframe>
            </div>
          ) : (
            <div>No document to preview</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}