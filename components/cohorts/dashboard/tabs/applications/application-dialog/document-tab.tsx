"use client";

import {
  CircleCheckBig,
  Download,
  Eye,
  FlagIcon,
  LoaderCircle,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

import { uploadDirect } from "@/app/api/aws";
import {
  updateDocumentStatus,
  uploadStudentDocuments,
} from "@/app/api/student";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateUniqueFileName } from "@/lib/utils/helpers";
import {
  BadgeVariant,
  DocumentsTabProps,
  UploadState,
} from "@/types/components/cohorts/dashboard/tabs/applications/application-dialog/document-tab";

export function DocumentsTab({ student, onUpdateStatus }: DocumentsTabProps) {
  const latestCohort =
    student?.appliedCohorts?.[student?.appliedCohorts.length - 1];
  const cohortDetails = latestCohort?.cohortId;

  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [uploadStates, setUploadStates] = useState<{
    [docId: string]: UploadState;
  }>({});
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
      folder: "student_identity_proof",
    },
    {
      id: "secondarySchoolMarksheet",
      name: "10th Marks Sheet",
      type: "PDF",
      size: "5 MB",
      folder: "10th-grade-marksheet",
    },
    {
      id: "higherSecondaryMarkSheet",
      name: "12th Marks Sheet",
      type: "PDF",
      size: "5 MB",
      folder: "12th-grade-marksheet",
    },
    {
      id: "higherSecondaryTC",
      name: "12th Transfer Certificate",
      type: "PDF",
      size: "5 MB",
      folder: "12th-grade-transfer-certificate",
    },
    {
      id: "graduationMarkSheet",
      name: "Graduation Marks Sheet",
      type: "PDF",
      size: "5 MB",
      folder: "graduation_marksheet",
    },
  ];

  const parentDocuments = [
    {
      id: "fatherIdProof",
      name: "Father’s ID Proof (Aadhar/PAN Card/Passport)",
      type: "PDF",
      size: "5 MB",
      folder: "parent-id-proof",
    },
    {
      id: "motherIdProof",
      name: "Father’s ID Proof (Aadhar/PAN Card/Passport)",
      type: "PDF",
      size: "5 MB",
      folder: "parent-id-proof",
    },
  ];

  useEffect(() => {
    setDocs(latestCohort?.personalDocs?.documents || []);
  }, [latestCohort?.personalDocs?.documents, student]);

  // Handle document action (flag/verify)
  const handleDocumentVerification = async (
    personalDocId: string,
    docId: string,
    status: string,
    feedback?: string
  ) => {
    try {
      setLoading(true);
      const payLoad = {
        personalDocId: personalDocId,
        docId: docId,
        status: status,
        feedback: [feedback],
      };
      const response = await updateDocumentStatus(payLoad);
      // console.log("Updated document status:", response);
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
        description:
          error.message || "Error updating document status. Please try again.",
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
      link.download = `${docName}.pdf`; // or "myImage.png"
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    docId: string,
    folder: string
  ) => {
    setError(null);

    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setUploadStates((prev) => ({
        ...prev,
        [docId]: {
          ...prev[docId],
          error: "File size exceeds 5 MB",
        },
      }));
      return;
    }
    const fileKey = generateUniqueFileName(file.name, folder);

    // Update fileName for this document
    setUploadStates((prev) => ({
      ...prev,
      [docId]: {
        uploading: true,
        uploadProgress: 0,
        fileName: fileKey,
        error: "",
        flagOpen: false,
        reason: "",
      },
    }));

    try {
      const fileUrl = await uploadDirect({
        file,
        fileKey,
        onProgress: (percentComplete) => {
          setUploadStates((prev) => ({
            ...prev,
            [docId]: {
              ...prev[docId],
              uploadProgress: Math.min(percentComplete, 100),
            },
          }));
        },
      });

      const payload = {
        studentId: student?._id,
        cohortId: cohortDetails?._id,
        fieldName: docId,
        fileUrl: fileUrl,
      };

      // Call the API function with FormData
      const response = await uploadStudentDocuments(payload);
      // console.log("Upload response:", response);
      onUpdateStatus();
      setDocs(response.data.documents);
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast({
        title: "Document Upload Failed",
        description:
          error.message || "Error updating document. Please try again.",
        variant: "warning",
      });
    } finally {
      setUploadStates((prev) => ({
        ...prev,
        [docId]: { ...prev[docId], uploading: false },
      }));
      e.target.value = "";
    }
  };

  const getStatusColor = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "verification pending":
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
        <CardContent className="px-4 sm:px-6 space-y-4">
          {reqDocuments.map((doc: any, index: any) => {
            const docDetails =
              docs.length > 0 ? docs.find((d: any) => d.name === doc.id) : null;

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
                        {doc.type} • {doc.size} • Uploaded on{" "}
                        {new Date(docDetails?.date).toLocaleDateString()}
                      </div>
                    ) : uploadStates[doc.id]?.error ? (
                      <div className="text-sm text-destructive">
                        • {uploadStates[doc.id]?.error}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        • Upload in {doc.type} Format
                      </div>
                    )}
                  </div>

                  {uploadStates[doc.id]?.uploading ? (
                    <div className="flex items-center gap-2">
                      {uploadStates[doc.id]?.uploadProgress === 100 ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Progress
                            className="h-2 w-20"
                            states={[
                              {
                                value: uploadStates[doc.id]?.uploadProgress,
                                widt: uploadStates[doc.id]?.uploadProgress,
                                color: "#ffffff",
                              },
                            ]}
                          />
                          <span>{uploadStates[doc.id]?.uploadProgress}%</span>
                        </>
                      )}
                      <Button variant="ghost" size="sm">
                        <XIcon className="w-4" />
                      </Button>
                    </div>
                  ) : docDetails ? (
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                      <Badge
                        className="capitalize"
                        variant={getStatusColor(docDetails?.status)}
                      >
                        {docDetails?.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setOpen(true);
                          setViewDoc(
                            `${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${docDetails?.url}`
                          );
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" /> View
                      </Button>
                      {docDetails?.status === "flagged" ? (
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor={`file-input-${doc.id}`}
                            className="cursor-pointer"
                          >
                            <Button
                              variant="outline"
                              asChild
                              disabled={latestCohort?.status === "dropped"}
                            >
                              <span>Choose File</span>
                            </Button>
                            <input
                              type="file"
                              accept="application/pdf"
                              className="hidden"
                              disabled={latestCohort?.status === "dropped"}
                              id={`file-input-${doc.id}`}
                              onChange={(e) =>
                                handleFileChange(e, doc.id, doc.folder)
                              }
                            />
                          </label>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleFileDownload(
                              `${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${docDetails?.url}`,
                              doc.name
                            )
                          }
                          disabled={downloading}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor={`file-input-${doc.id}`}
                        className="cursor-pointer"
                      >
                        <Button
                          variant="outline"
                          asChild
                          disabled={latestCohort?.status === "dropped"}
                        >
                          <span>Choose File</span>
                        </Button>
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          disabled={latestCohort?.status === "dropped"}
                          id={`file-input-${doc.id}`}
                          onChange={(e) =>
                            handleFileChange(e, doc.id, doc.folder)
                          }
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Show Flag/Verify actions if the document is uploaded and marked as "updated" */}
                {docDetails?.status === "verification pending" &&
                  (flagOpen ? (
                    <div className="space-y-4 ">
                      <div className="mt-2 space-y-2">
                        <label className="text-base">Provide Reasons</label>
                        <Textarea
                          className="h-[100px]"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          placeholder="Type your reasons here..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex"
                          onClick={() => setFlagOpen(false)}
                        >
                          Back
                        </Button>
                        <Button
                          className="flex-1"
                          disabled={!reason.trim()}
                          onClick={() =>
                            handleDocumentVerification(
                              latestCohort?.personalDocs?._id,
                              docDetails._id,
                              "flagged",
                              reason
                            )
                          }
                        >
                          Mark as Flagged
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                      <Button
                        variant="outline"
                        className="order-2 sm:order-1 flex gap-2 border-[#FF503D] text-[#FF503D] bg-[#FF503D]/[0.2]"
                        disabled={loading || latestCohort?.status === "dropped"}
                        onClick={() => setFlagOpen(true)}
                      >
                        <FlagIcon className="w-4 h-4" />
                        Flag Document
                      </Button>
                      <Button
                        variant="outline"
                        className="order-1 sm:order-2 flex gap-2 border-[#2EB88A] text-[#2EB88A] bg-[#2EB88A]/[0.2]"
                        disabled={loading || latestCohort?.status === "dropped"}
                        onClick={() =>
                          handleDocumentVerification(
                            latestCohort?.personalDocs?._id,
                            docDetails._id,
                            "verified"
                          )
                        }
                      >
                        <CircleCheckBig className="w-4 h-4" />
                        Mark as Verified
                      </Button>
                    </div>
                  ))}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Parent&apos;s Documents</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 space-y-4">
          {parentDocuments.map((doc: any, index: any) => {
            const docDetails =
              docs.length > 0 ? docs.find((d: any) => d.name === doc.id) : null;

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
                        {doc.type} • {doc.size} • Uploaded on{" "}
                        {new Date(docDetails?.date).toLocaleDateString()}
                      </div>
                    ) : uploadStates[doc.id]?.error ? (
                      <div className="text-sm text-destructive">
                        • {uploadStates[doc.id]?.error}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        • Upload in {doc.type} Format
                      </div>
                    )}
                  </div>

                  {uploadStates[doc.id]?.uploading ? (
                    <div className="flex items-center gap-2">
                      {uploadStates[doc.id]?.uploadProgress === 100 ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Progress
                            className="h-2 w-20"
                            states={[
                              {
                                value: uploadStates[doc.id]?.uploadProgress,
                                widt: uploadStates[doc.id]?.uploadProgress,
                                color: "#ffffff",
                              },
                            ]}
                          />
                          <span>{uploadStates[doc.id]?.uploadProgress}%</span>
                        </>
                      )}
                      <Button variant="ghost" size="sm">
                        <XIcon className="w-4" />
                      </Button>
                    </div>
                  ) : docDetails ? (
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                      <Badge
                        className="capitalize"
                        variant={getStatusColor(docDetails?.status)}
                      >
                        {docDetails?.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setOpen(true);
                          setViewDoc(
                            `${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${docDetails?.url}`
                          );
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" /> View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleFileDownload(
                            `${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${docDetails?.url}`,
                            doc.name
                          )
                        }
                        disabled={downloading}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor={`file-input-${doc.id}`}
                        className="cursor-pointer"
                      >
                        <Button
                          variant="outline"
                          asChild
                          disabled={latestCohort?.status === "dropped"}
                        >
                          <span>Choose File</span>
                        </Button>
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          id={`file-input-${doc.id}`}
                          disabled={latestCohort?.status === "dropped"}
                          onChange={(e) =>
                            handleFileChange(e, doc.id, doc.folder)
                          }
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Show Flag/Verify actions if the document is uploaded and marked as "updated" */}
                {docDetails?.status === "verification pending" &&
                  (flagOpen ? (
                    <div className="space-y-4 ">
                      <div className="mt-2 space-y-2">
                        <label className="text-base">Provide Reasons</label>
                        <Textarea
                          className="h-[100px]"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          placeholder="Type your reasons here..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex"
                          onClick={() => setFlagOpen(false)}
                        >
                          Back
                        </Button>
                        <Button
                          className="flex-1"
                          disabled={!reason.trim()}
                          onClick={() =>
                            handleDocumentVerification(
                              latestCohort?.personalDocs?._id,
                              docDetails._id,
                              "flagged",
                              reason
                            )
                          }
                        >
                          Mark as Flagged
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                      <Button
                        variant="outline"
                        className="order-2 sm:order-1 flex gap-2 border-[#FF503D] text-[#FF503D] bg-[#FF503D]/[0.2]"
                        disabled={loading || latestCohort?.status === "dropped"}
                        onClick={() => setFlagOpen(true)}
                      >
                        <FlagIcon className="w-4 h-4" />
                        Flag Document
                      </Button>
                      <Button
                        variant="outline"
                        className="order-1 sm:order-2 flex gap-2 border-[#2EB88A] text-[#2EB88A] bg-[#2EB88A]/[0.2]"
                        disabled={loading || latestCohort?.status === "dropped"}
                        onClick={() =>
                          handleDocumentVerification(
                            latestCohort?.personalDocs?._id,
                            docDetails._id,
                            "verified"
                          )
                        }
                      >
                        <CircleCheckBig className="w-4 h-4" />
                        Mark as Verified
                      </Button>
                    </div>
                  ))}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Additional Documents */}
      {docs?.filter(
        (doc: any) =>
          ![
            "graduationMarkSheet",
            "higherSecondaryMarkSheet",
            "secondarySchoolMarksheet",
            "aadharDocument",
            ,
            "aadharDocument",
            "higherSecondaryTC",
            "fatherIdProof",
            "motherIdProof",
          ].includes(doc.name)
      ).length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Additional Documents</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 space-y-4">
              {docs
                ?.filter(
                  (doc: any) =>
                    ![
                      "graduationMarkSheet",
                      "higherSecondaryMarkSheet",
                      "secondarySchoolMarksheet",
                      "aadharDocument",
                      "higherSecondaryTC",
                      "fatherIdProof",
                      "motherIdProof",
                    ].includes(doc.name)
                )
                .map((doc: any) => (
                  <div key={doc._id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium capitalize">{doc?.name}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          • Uploaded on{" "}
                          {new Date(doc?.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setOpen(true);
                            setViewDoc(
                              `${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${doc?.url}`
                            );
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleFileDownload(
                              `${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${doc?.url}`,
                              doc?.name
                            )
                          }
                          disabled={downloading}
                        >
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
      )}

      {/* PDF Preview Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle></DialogTitle>
        <DialogContent className="max-w-[90vw] sm:max-w-4xl py-2 px-6 h-[90vh] overflow-y-auto">
          {viewDoc ? (
            <div className="max-w-7xl justify-center flex items-center ">
              <iframe
                src={viewDoc}
                className="mx-auto w-[70%] h-full"
                style={{ border: "none" }}
              ></iframe>
            </div>
          ) : (
            <div>No document to preview</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
