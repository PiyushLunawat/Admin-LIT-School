"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Eye, Upload } from "lucide-react";

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
        name: "Academic Records",
        type: "PDF",
        size: "5.1 MB",
        status: "Pending",
        required: true,
      },
      {
        name: "Work Experience",
        type: "PDF",
        size: "1.8 MB",
        status: "Verified",
        uploadDate: "2024-03-16",
      },
    ],
    additional: [
      {
        name: "Portfolio",
        type: "PDF",
        size: "15.2 MB",
        uploadDate: "2024-03-17",
      },
      {
        name: "Certificates",
        type: "ZIP",
        size: "8.7 MB",
        uploadDate: "2024-03-18",
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
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{doc.name}</p>
                  {doc.required && !doc.uploadDate && (
                    <Badge variant="destructive">Required</Badge>
                  )}
                </div>
                {doc.uploadDate ? (
                  <div className="text-sm text-muted-foreground">
                    {doc.type} • {doc.size} • Uploaded on{" "}
                    {new Date(doc.uploadDate).toLocaleDateString()}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Input type="file" className="max-w-[300px]" />
                    <Button size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                )}
              </div>
              {doc.uploadDate && (
                <div className="flex items-center gap-2">
                  <Badge
                    variant={doc.status === "Verified" ? "success" : "secondary"}
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
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Additional Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {documents.additional.map((doc, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
                <p className="font-medium">{doc.name}</p>
                <p className="text-sm text-muted-foreground">
                  {doc.type} • {doc.size} • Uploaded on{" "}
                  {new Date(doc.uploadDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upload New Document */}
      <Card>
        <CardHeader>
          <CardTitle>Upload New Document</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input type="file" />
            <Button className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}