"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CircleCheckBig,
  Download,
  Eye,
  FlagIcon,
  Upload,
} from "lucide-react";
import { getCurrentStudents, updateDocumentStatus } from "@/app/api/student";
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Mocked Upload API for demonstration
async function uploadDocumentAPI(
  studentId: string,
  docId: string,
  formData: FormData
) {
  // Replace with your actual upload logic
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(
        `Mock Upload for studentId=${studentId}, docId=${docId}, file=${
          (formData.get("document") as File)?.name
        }`
      );
      resolve({ success: true });
    }, 1000);
  });
}

interface DocumentsTabProps {
  studentId: string;
}

export function DocumentsTab({ studentId }: DocumentsTabProps) {
  const [student, setStudent] = useState<any>(null);
  // For each required document, store the selected file in an object keyed by docId
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>(
    {}
  );

  // Separate state for the "Upload New Document" section
  const [newDocName, setNewDocName] = useState<string>("");
  const [newDocFile, setNewDocFile] = useState<File | null>(null);

  // Dialog open state
  const [open, setOpen] = useState(false);

  // Fetch Student
  useEffect(() => {
    if (studentId) {
      fetchStudent();
    }
  }, [studentId]);

  async function fetchStudent() {
    try {
      const application = await getCurrentStudents(studentId);
      setStudent(application?.data || null);
    } catch (error) {
      console.error("Failed to fetch student data:", error);
    }
  }

  // Required documents
  const documents = [
    {
      id: "aadharDocument",
      name: "ID Proof (Aadhar card)",
      type: "PDF",
      size: "2.5 MB",
      docDetails: student?.personalDocsDetails?.aadharDocument || [],
    },
    {
      id: "secondarySchoolMarksheet",
      name: "10th Marks Sheet",
      type: "PDF",
      size: "15.2 MB",
      docDetails: student?.personalDocsDetails?.secondarySchoolMarksheet || [],
    },
    {
      id: "higherSecondaryMarkSheet",
      name: "12th Marks Sheet",
      type: "PDF",
      size: "1.8 MB",
      docDetails: student?.personalDocsDetails?.higherSecondaryMarkSheet || [],
    },
    {
      id: "graduationMarkSheet",
      name: "Graduation Marks Sheet",
      type: "PDF",
      size: "5.1 MB",
      docDetails: student?.personalDocsDetails?.graduationMarkSheet || [],
    },
  ];

  // Handle "Flag" or "Verified" actions
  const handleDocumentAction = async (
    studentId: string,
    docType: string,
    docId: string,
    status: string
  ) => {
    try {
      const response = await updateDocumentStatus(
        studentId,
        docType,
        docId,
        "",
        status
      );
      console.log("Updated doc status:", response);
      // Optionally refetch student
      fetchStudent();
    } catch (error) {
      console.error("Error updating document status:", error);
    }
  };

  // Handle file selection for each required document
  const handleRequiredDocFileChange = (docId: string, file: File | null) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [docId]: file,
    }));
  };

  // Handle uploading a required document
  const handleRequiredDocUpload = async (docId: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append("document", file);

      // Your API call
      const response = await uploadDocumentAPI(studentId, docId, formData);
      console.log("Upload successful:", response);

      // Reset the file selection for this doc
      handleRequiredDocFileChange(docId, null);
      // Optionally refresh the document data
      fetchStudent();
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  // Handle "Upload New Document" (separate from required documents)
  const handleNewDocFileChange = (file: File | null) => {
    setNewDocFile(file);
  };

  const handleNewDocUpload = async () => {
    if (!newDocFile) return;

    try {
      const formData = new FormData();
      formData.append("document", newDocFile);

      // Your separate API logic for new docs
      const response = await uploadDocumentAPI(studentId, "newDoc", formData);
      console.log("New doc upload successful:", response);

      // Clear the input fields
      setNewDocName("");
      setNewDocFile(null);
      fetchStudent();
    } catch (error) {
      console.error("New doc upload failed:", error);
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
          {documents.map((doc) => {
            const docDetails = doc.docDetails[0] || null;
            const isUploaded = !!docDetails;
            const status = docDetails?.status || "Pending";

            // Get this doc's selected file
            const docFile = selectedFiles[doc.id] || null;

            return (
              <div key={doc.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  {/* Document Heading */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{doc.name}</p>
                    </div>
                    {isUploaded ? (
                      <div className="text-sm text-muted-foreground">
                        {doc.type} • {doc.size} • Uploaded on{" "}
                        {new Date(
                          docDetails.uploadDate || Date.now()
                        ).toLocaleDateString()}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        • Upload in {doc.type} Format
                      </div>
                    )}
                  </div>

                  {/* Already Uploaded? */}
                  {isUploaded ? (
                    <div className="flex items-center gap-2">
                      {(status === "verified" || status === "flagged") && (
                        <Badge
                          className="capitalize"
                          variant={
                            status === "verified" ? "success" : "warning"
                          }
                        >
                          {status}
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setOpen(true)}
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
                    // Not Uploaded => Show file input + Upload button
                    <div className="flex items-center gap-2">
                      <div className="border rounded-lg p-1.5">
                        <label className="w-full px-3 text-muted-foreground">
                          <input
                            type="file"
                            className="hidden"
                            // Reset the input key if docFile changes
                            key={docFile ? docFile.name : ""}
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              handleRequiredDocFileChange(doc.id, file);
                            }}
                          />
                          <span className="cursor-pointer">
                            {docFile ? (
                              <span className="text-white ">
                                {docFile.name}
                              </span>
                            ) : (
                              "Choose File"
                            )}
                          </span>
                        </label>
                      </div>
                      {docFile && (
                        <Button
                          size="sm"
                          onClick={() => handleRequiredDocUpload(doc.id, docFile)}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Show "Flag" / "Verify" if doc status is "updated" and is uploaded */}
                {status === "updated" && isUploaded && (
                  <div className="flex gap-4 mt-4">
                    <Button
                      variant="outline"
                      className="flex gap-2 border-[#FF503D] text-[#FF503D] bg-[#FF503D]/[0.2]"
                      onClick={() =>
                        handleDocumentAction(
                          student._id,
                          doc.id,
                          docDetails._id,
                          "flagged"
                        )
                      }
                    >
                      <FlagIcon className="w-4 h-4" /> Flag Document
                    </Button>
                    <Button
                      variant="outline"
                      className="flex gap-2 border-[#2EB88A] text-[#2EB88A] bg-[#2EB88A]/[0.2]"
                      onClick={() =>
                        handleDocumentAction(
                          student._id,
                          doc.id,
                          docDetails._id,
                          "verified"
                        )
                      }
                    >
                      <CircleCheckBig className="w-4 h-4" /> Mark as Verified
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Upload New Document */}
      <Card>
        <CardHeader>
          <CardTitle>Upload New Document</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Input
            className="w-full"
            placeholder="Document Name"
            value={newDocName}
            onChange={(e) => setNewDocName(e.target.value)}
          />
          <div className="flex gap-2 items-center">
            <div className="min-w-[150px] border rounded-lg p-1.5">
              <label className="w-full px-3 text-muted-foreground">
                <input
                  type="file"
                  className="hidden"
                  key={newDocFile ? newDocFile.name : ""}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    handleNewDocFileChange(file);
                  }}
                />
                <span className="cursor-pointer">
                  {newDocFile ? (
                    <span className="text-white">{newDocFile.name}</span>
                  ) : (
                    "Choose File"
                  )}
                </span>
              </label>
            </div>
            {newDocFile && (
              <Button onClick={handleNewDocUpload}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl py-2 px-6 h-[90vh] overflow-y-auto">
          <div>Preview Document Here</div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
