"use client";

import { useState } from "react";
import { SubmissionsList } from "./submissions/submissions-list";
import { SubmissionsFilters } from "./submissions/submissions-filters";
import { SubmissionDetails } from "./submissions/submission-details";
import { Button } from "@/components/ui/button";
import { Mail, Download } from "lucide-react";
import { Card } from "@/components/ui/card";

export function LitmusSubmissions() {
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [selectedSubmissionIds, setSelectedSubmissionIds] = useState<string[]>([]);

  const handleBulkEmail = () => {
    console.log("Sending bulk email to:", selectedSubmissionIds);
  };

  const handleBulkExport = () => {
    console.log("Exporting data for:", selectedSubmissionIds);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">LITMUS Test Submissions</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleBulkEmail}
            disabled={selectedSubmissionIds.length === 0}
          >
            <Mail className="h-4 w-4 mr-2" />
            Bulk Email
          </Button>
          <Button
            variant="outline"
            onClick={handleBulkExport}
            disabled={selectedSubmissionIds.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Selected
          </Button>
        </div>
      </div>

      <SubmissionsFilters />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SubmissionsList
            onSubmissionSelect={(id) => setSelectedSubmissionId(id)}
            selectedIds={selectedSubmissionIds}
            onSelectedIdsChange={setSelectedSubmissionIds}
          />
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card className="h-[calc(100vh-7rem)] overflow-hidden">
              {selectedSubmissionId ? (
                <SubmissionDetails
                  submissionId={selectedSubmissionId}
                  onClose={() => setSelectedSubmissionId(null)}
                />
              ) : (
                <div className="h-full flex items-center justify-center p-6 text-muted-foreground">
                  <p className="text-center">
                    Select a submission to view details
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}