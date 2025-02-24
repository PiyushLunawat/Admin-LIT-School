"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleCheckBig, Download, Eye, FlagIcon, Upload } from "lucide-react";
import { updateDocumentStatus, uploadStudentDocuments } from "@/app/api/student";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface DocumentsTabProps {
  student: any;
  onUpdateStatus: () => void;
}

export function DocumentsTab({ student, onUpdateStatus }: DocumentsTabProps) {
  
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});
  
  // State for "Upload New Document" section
  const [newDocName, setNewDocName] = useState<string>("");
  const [newDocFile, setNewDocFile] = useState<File | null>(null);
  
  // State for the dialog (to preview the PDF)
  const [open, setOpen] = useState(false);
  const [viewDoc, setViewDoc] = useState("");

  const latestCohort = student?.appliedCohorts?.[student?.appliedCohorts.length - 1];
  const personalDocsDetails = latestCohort?.personalDocsDetails; 

  const [document, setDocument] = useState<any>(personalDocsDetails);
  
  const documents = [
      {
        id: "aadharDocument",
        name: "ID Proof (Aadhar card)",
        type: "PDF",
        size: "2.5 MB",
        docDetails: document?.aadharDocument || [],
      },
      {
        id: "secondarySchoolMarksheet",
        name: "10th Marks Sheet",
        type: "PDF",
        size: "15.2 MB",
        docDetails: document?.secondarySchoolMarksheet || [],
      },
      {
        id: "higherSecondaryMarkSheet",
        name: "12th Marks Sheet",
        type: "PDF",
        size: "1.8 MB",
        docDetails: document?.higherSecondaryMarkSheet || [],
      }, 
      {
        id: "graduationMarkSheet",
        name: "Graduation Marks Sheet",
        type: "PDF",
        size: "5.1 MB",
        docDetails: document?.graduationMarkSheet || [],
      },
    ];

    const handleDocumentAction = async (
      studentId: string,
      docType: string,
      docId: string,
      status: string
    ) => {
      try {
        const response = await updateDocumentStatus(studentId, docType, docId, "", status);
        console.log("ress",response);
        setDocument(response.data)
        // onUpdateStatus();
      } catch (error) {
        console.error("Error updating document status:", error);
      }
    };

    const handleRequiredDocFileChange = (docId: string, file: File | null) => {
      setSelectedFiles((prev) => ({ ...prev, [docId]: file }));
    };
  
    // Upload required document (API logic to be added)
    const handleRequiredDocUpload = async (docId: string, file: File) => {
      try {
        console.log("Uploading document:",student._id, docId, file);
        const formData = new FormData();
        formData.append("studentId", student._id); 
        formData.append("documentType", docId);
        formData.append("docFile", file);
    
        const response = await uploadStudentDocuments(formData);
        console.log("Upload successful:", response);
    
        // Clear the file input after successful upload
        handleRequiredDocFileChange(docId, null);
        
        // Optionally, re-fetch the student document details to update the UI
        // fetchStudent();
      } catch (error) {
        console.error("Error uploading document:", error);
      }
    };    
  
    // Handle file selection for a new document
    const handleNewDocFileChange = (file: File | null) => {
      setNewDocFile(file);
    };

  return (
    <div className="space-y-6">
          {/* Required Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {documents.map((doc) => {
                // Get the latest document details (if any)
                const docDetails = doc.docDetails[doc.docDetails.length - 1] || null;
                const isUploaded = !!docDetails;
                const status = docDetails?.status || "Pending";
                const url = docDetails?.url || "";
                const docFile = selectedFiles[doc.id] || null;
    
                return (
                  <div key={doc.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      {/* Document Information */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{doc.name}</p>
                        </div>
                        {isUploaded ? (
                          <div className="text-sm text-muted-foreground">
                            {doc.type} • {doc.size} • Uploaded on{" "}
                            {new Date(docDetails.uploadDate || Date.now()).toLocaleDateString()}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            • Upload in {doc.type} Format
                          </div>
                        )}
                      </div>
    
                      {/* Actions */}
                      {isUploaded ? (
                        <div className="flex items-center gap-2">
                          {(status === "verified" || status === "flagged") && (
                            <Badge
                              className="capitalize"
                              variant={status === "verified" ? "success" : "warning"}
                            >
                              {status}
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // Open dialog and set the URL with inline disposition
                              setOpen(true);
                              setViewDoc(url);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="border rounded-lg p-1.5">
                            <label className="w-full px-3 text-muted-foreground">
                              <input
                                type="file"
                                className="hidden"
                                key={docFile ? docFile.name : ""}
                                onChange={(e) => {
                                  const file = e.target.files?.[0] || null;
                                  handleRequiredDocFileChange(doc.id, file);
                                }}
                              />
                              <span className="cursor-pointer">
                                {docFile ? (
                                  <span className="text-white">{docFile.name}</span>
                                ) : (
                                  "Choose File"
                                )}
                              </span>
                            </label>
                          </div>
                          {docFile && (
                            <Button size="sm" onClick={() => handleRequiredDocUpload(doc.id, docFile)}>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
    
                    {/* Show Flag/Verify actions if the document is uploaded and marked as "updated" */}
                    {status === "updated" && isUploaded && (
                      <div className="flex gap-4 mt-4">
                        <Button
                          variant="outline"
                          className="flex gap-2 border-[#FF503D] text-[#FF503D] bg-[#FF503D]/[0.2]"
                          onClick={() =>
                            handleDocumentAction(student._id, doc.id, docDetails._id, "flagged")
                          }
                        >
                          <FlagIcon className="w-4 h-4" />
                          Flag Document
                        </Button>
                        <Button
                          variant="outline"
                          className="flex gap-2 border-[#2EB88A] text-[#2EB88A] bg-[#2EB88A]/[0.2]"
                          onClick={() =>
                            handleDocumentAction(student._id, doc.id, docDetails._id, "verified")
                          }
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
    
            {/* Additional Documents */}
          {student?.personalDocsDetails?.adminUploadedocuments !== undefined &&
          <>
            <CardHeader>
              <CardTitle>Additional Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {personalDocsDetails?.adminUploadedocuments?.map((doc: any) => (
                <div key={doc._id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium capitalize">{doc?.documentName}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        • Uploaded on {new Date(doc?.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Assumes that the admin-uploaded document has a URL property
                          setOpen(true);
                          setViewDoc(doc.url);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </>
          }
        </Card>
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl py-2 px-6 h-[90vh] overflow-y-auto">
            <div>hello</div>
          </DialogContent>
        </Dialog>
    </div>
  );
}