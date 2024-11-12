"use client";

import { useState } from "react";
import { ApplicationsList } from "./applications-list";
import { ApplicationFilters } from "./application-filters";
import { ApplicationDetails } from "./application-details";
import { Button } from "@/components/ui/button";
import { Mail, Download } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ApplicationsTabProps {
  cohortId: string;
}

export function ApplicationsTab({ cohortId }: ApplicationsTabProps) {
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [selectedApplicationIds, setSelectedApplicationIds] = useState<string[]>([]);

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
          <Button
            variant="outline"
            onClick={handleBulkEmail}
            disabled={selectedApplicationIds.length === 0}
          >
            <Mail className="h-4 w-4 mr-2" />
            Bulk Email
          </Button>
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

      <ApplicationFilters />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ApplicationsList
            cohortId={cohortId}
            onApplicationSelect={(id) => {
              console.log("Selected application:", id);
              setSelectedApplicationId(id);
            }}
            selectedIds={selectedApplicationIds}
            onSelectedIdsChange={setSelectedApplicationIds}
          />
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card className="h-[calc(100vh-20rem)] overflow-hidden">
              {selectedApplicationId ? (
                <ApplicationDetails
                  applicationId={selectedApplicationId}
                  onClose={() => setSelectedApplicationId(null)}
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