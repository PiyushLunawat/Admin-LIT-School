"use client";

import { useState } from "react";
import { StudentsList } from "./students-list";
import { StudentFilters } from "./student-filters";
import { StudentDetails } from "./student-details";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Mail } from "lucide-react";

export function StudentAccounts() {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const handleBulkReminder = () => {
    console.log("Sending payment reminders to:", selectedStudentIds);
  };

  const handleBulkExport = () => {
    console.log("Exporting student data for:", selectedStudentIds);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Student Accounts</h2>
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

      <StudentFilters />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StudentsList
            onStudentSelect={(id) => setSelectedStudentId(id)}
            selectedIds={selectedStudentIds}
            onSelectedIdsChange={setSelectedStudentIds}
          />
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card className="h-[calc(100vh-7rem)] overflow-hidden">
              {selectedStudentId ? (
                <StudentDetails
                  studentId={selectedStudentId}
                  onClose={() => setSelectedStudentId(null)}
                />
              ) : (
                <div className="h-full flex items-center justify-center p-6 text-muted-foreground">
                  <p className="text-center">
                    Select a student to view account details
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