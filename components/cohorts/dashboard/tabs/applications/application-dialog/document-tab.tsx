"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleCheckBig, Download, Eye, FlagIcon, Upload } from "lucide-react";
import { updateDocumentStatus } from "@/app/api/student";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface DocumentsTabProps {
  student: any;
}

export function DocumentsTab({ student }: DocumentsTabProps) {
  
  const [open, setOpen] = useState(false);

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

    const handleDocumentAction = async (
      studentId: string,
      docType: string,
      docId: string,
      status: string
    ) => {
      try {
        const response = await updateDocumentStatus(studentId, docType, docId, "", status);
        console.log("ress",response);        
        alert(`Document status updated to "${status}" successfully.`);
        // Optionally, refresh the document list or update the UI dynamically
      } catch (error) {
        console.error("Error updating document status:", error);
        alert("Failed to update document status. Please try again.");
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
          {documents.map((doc: any, index: any) => {
          const docDetails = doc.docDetails[0] || null; 
          const isUploaded = !!docDetails; 
          const status = docDetails?.status || "Pending";
          console.log("docs", docDetails,isUploaded,status)

          return (

          <div key={index} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between ">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{doc.name}</p>
                </div>
                {isUploaded  ? (
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
              {isUploaded  ? (
                <div className="flex items-center gap-2">
                  {(status === "verified" || status === "flagged") &&
                    <Badge className="capitalize" variant={status === "verified" ? "success" : "warning"}>
                    {status}
                  </Badge>}
                  <Button variant="ghost" size="sm" onClick={() =>setOpen(true)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ) : 
              <div className="flex items-center gap-2">
                    <Input type="file" className="max-w-[300px]" />
                    <Button size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>}
              </div>
              {(status === "updated" && isUploaded) &&
               <div className="flex gap-4 mt-4">
                <Button variant="outline" className="flex gap-2 border-[#FF503D] text-[#FF503D] bg-[#FF503D]/[0.2] "
                onClick={() => handleDocumentAction( student._id, doc.id, docDetails._id, "flagged" )}>
                    <FlagIcon className="w-4 h-4"/> Flag Document
                </Button>
                <Button variant="outline" className="flex gap-2 border-[#2EB88A] text-[#2EB88A] bg-[#2EB88A]/[0.2] "
                onClick={() => handleDocumentAction( student._id, doc.id, docDetails._id, "verified")}>
                    <CircleCheckBig className="w-4 h-4"/> Mark as Verified
                </Button>
              </div>}
            </div>)})}
        </CardContent>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl py-2 px-6 h-[90vh] overflow-y-auto">
          <div>hello</div>
        </DialogContent>
      </Dialog>
    </div>
  );
}