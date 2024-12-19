"use client";

import { useState } from "react";
import { PaymentsSummary } from "./payments-summary";
import { PaymentsList } from "./payments-list";
import { PaymentsFilters } from "./payments-filters";
import { PaymentDetails } from "./payment-details";
import { Button } from "@/components/ui/button";
import { Mail, Download } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PaymentsTabProps {
  cohortId: string;
}

export function PaymentsTab({ cohortId }: PaymentsTabProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const handleBulkReminder = () => {
    console.log("Sending payment reminders to:", selectedStudentIds);
  };

  const handleBulkExport = () => {
    console.log("Exporting payment data for:", selectedStudentIds);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payments</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleBulkReminder}
            disabled={selectedStudentIds.length === 0}
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Reminders
          </Button>
          <Button
            variant="outline"
            onClick={handleBulkExport}
            disabled={selectedStudentIds.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Selected
          </Button>
        </div>
      </div>

      <PaymentsSummary cohortId={cohortId} />
      
      <PaymentsFilters />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PaymentsList
            cohortId={cohortId}
            onStudentSelect={(id) => {
              console.log("Selected student:", id);
              setSelectedStudentId(id);
            }}
            selectedIds={selectedStudentIds}
            onSelectedIdsChange={setSelectedStudentIds}
          />
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card className="h-[calc(100vh-7rem)] overflow-hidden">
              {selectedStudentId ? (
                <PaymentDetails
                  studentId={selectedStudentId}
                  onClose={() => setSelectedStudentId(null)}
                />
              ) : (
                <div className="h-full flex items-center justify-center p-6 text-muted-foreground">
                  <p className="text-center">
                    Select a student to view payment details
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