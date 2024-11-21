"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleCheckBig, Download, Eye, FlagIcon, Upload } from "lucide-react";

interface DocumentsTabProps {
  studentId: string;
}

export function DocumentsTab({ studentId }: DocumentsTabProps) {
  // In a real application, this data would be fetched based on the studentId
  const documents = {
    required: [
      {
        name: "ID Proof",
        type: "PDF",
        size: "2.5 MB",
        status: "Verified",
        uploadDate: "2024-03-15",
      },
      {
        name: "Graduation Marks Sheet",
        type: "PDF",
        size: "5.1 MB",
        status: "",
        uploadDate: "",
      },
      {
        name: "12th Marks Sheet",
        type: "PDF",
        size: "1.8 MB",
        status: "",
        uploadDate: "",
      }, 
      {
        name: "10th Marks Sheet",
        type: "PDF",
        size: "15.2 MB",
        status: "Pending",
        uploadDate: "2024-03-17",
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Required Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Required Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {documents.required.map((doc, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between ">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{doc.name}</p>
                  {!doc.uploadDate && (
                    <Badge variant="destructive">Required</Badge>
                  )}
                </div>
                {doc.uploadDate ? (
                  <div className="text-sm text-muted-foreground">
                    {doc.type} • {doc.size} • Uploaded on{" "}
                    {new Date(doc.uploadDate).toLocaleDateString()}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                     • Upload in {doc.type} Format
                  </div>
                )}
              </div>
              {doc.uploadDate ? (
                <div className="flex items-center gap-2">
                  <Badge
                    variant={doc.status === "Verified" ? "success" : "lemon"}
                  >
                    {doc.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
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
              {doc.status === "Pending" && <div className="flex gap-4 mt-4">
                <Button variant="outline" className="flex gap-2 border-[#FF503D] text-[#FF503D] bg-[#FF503D]/[0.2] ">
                    <FlagIcon className="w-4 h-4"/> Flag Document
                </Button>
                <Button variant="outline" className="flex gap-2 border-[#2EB88A] text-[#2EB88A] bg-[#2EB88A]/[0.2] ">
                    <CircleCheckBig className="w-4 h-4"/> Mark as Verified
                </Button>
              </div>}
            </div>))}
        </CardContent>
      </Card>
    </div>
  );
}