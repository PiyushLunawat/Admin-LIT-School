"use client";

import { useEffect, useState } from "react";
import { LitmusTestList } from "./litmus-test-list";
import { LitmusTestFilters } from "./litmus-test-filters";
import { LitmusTestDetails } from "./litmus-test-details";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Card } from "@/components/ui/card";

interface LitmusTabProps {
  cohortId: string;
}

export function LitmusTab({ cohortId }: LitmusTabProps) {
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<any>(null);
  const [selectedSubmissionIds, setSelectedSubmissionIds] = useState<string[]>([]);
  const [application, setApplication] = useState<any>(null);  
  const [refreshKey, setRefreshKey] = useState(0); 

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const handleApplicationUpdate = () => {
    setRefreshKey((prevKey) => prevKey + 1); // Increment the refresh key
  };

  useEffect(() => {
    if (application) {
      console.log("Fetched application:", application);
    }
  }, [application]);

  const handleBulkExport = () => {
    console.log("Exporting data for:", selectedSubmissionIds);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">LITMUS Test Submissions</h2>
        <Button
          variant="outline"
          onClick={handleBulkExport}
          disabled={selectedSubmissionIds.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Export Selected
        </Button>
      </div>

      <LitmusTestFilters
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onSelectedStatusChange={setSelectedStatus}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LitmusTestList
            cohortId={cohortId}
            key={refreshKey} 
            onSubmissionSelect={(id) => {setSelectedSubmissionId(id);}}
            selectedIds={selectedSubmissionIds}
            onSelectedIdsChange={setSelectedSubmissionIds}
            onApplicationUpdate={handleApplicationUpdate} 
            searchTerm={searchTerm}
            selectedStatus={selectedStatus}
            sortBy={sortBy}
          />
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card className="h-[calc(100vh-7rem)] overflow-hidden">
              {selectedSubmissionId ? (
                <LitmusTestDetails
                  application={selectedSubmissionId}
                  onClose={() => setSelectedSubmissionId(null)}
                  onApplicationUpdate={handleApplicationUpdate} 
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