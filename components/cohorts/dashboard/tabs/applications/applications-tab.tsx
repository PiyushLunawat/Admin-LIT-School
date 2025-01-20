"use client";

import { useEffect, useState } from "react";
import { ApplicationsList } from "./applications-list";
import { ApplicationFilters } from "./application-filters";
import { ApplicationDetails } from "./application-details";
import { Button } from "@/components/ui/button";
import { Mail, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getCurrentStudents } from "@/app/api/student";
import { DateRange } from "react-day-picker";

interface ApplicationsTabProps {
  cohortId: string;
  selectedDateRange: DateRange | undefined;
}

export function ApplicationsTab({ cohortId, selectedDateRange }: ApplicationsTabProps) {
  const [selectedApplicationId, setSelectedApplicationId] = useState("");
  const [selectedApplicationIds, setSelectedApplicationIds] = useState<string[]>([]);
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

  const handleBulkEmail = () => {
    console.log("Sending bulk email to:", selectedApplicationIds);
  };

  const handleBulkExport = () => {
    console.log("Exporting data for:", selectedApplicationIds);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Applications</h2>
        <div className="flex gap-2">
          {/* <Button
            variant="outline"
            onClick={handleBulkEmail}
            disabled={selectedApplicationIds.length === 0}
          >
            <Mail className="h-4 w-4 mr-2" />
            Bulk Email
          </Button> */}
          <Button
            variant="outline"
            onClick={handleBulkExport}
            disabled={selectedApplicationIds.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Selected
          </Button>
        </div>
      </div>

      <ApplicationFilters 
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onSelectedStatusChange={setSelectedStatus}
        sortBy={sortBy}
        onSortByChange={setSortBy}/>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ApplicationsList
            cohortId={cohortId}
            key={refreshKey} 
            selectedDateRange={selectedDateRange}
            onApplicationSelect={(id) => {setSelectedApplicationId(id);}}
            selectedIds={selectedApplicationIds}
            onSelectedIdsChange={setSelectedApplicationIds}
            onApplicationUpdate={handleApplicationUpdate} 
            searchTerm={searchTerm}
            selectedStatus={selectedStatus}
            sortBy={sortBy}
            />
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card className="max-h-[calc(100vh-7rem)]  overflow-y-auto">
              {selectedApplicationId ? (
                <ApplicationDetails
                  applicationId={selectedApplicationId}
                  onClose={() => setSelectedApplicationId("")}
                  onApplicationUpdate={handleApplicationUpdate} 
                />
              ) : (
                <div className="h-full flex items-center justify-center p-6 text-muted-foreground">
                  <p className="text-center">
                    Select an application to view details
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
