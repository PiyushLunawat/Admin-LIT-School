"use client";

import { StudentsList } from "@/components/students/students-list";
import { StudentsFilters } from "@/components/students/students-filters";
import { Button } from "@/components/ui/button";
import { Mail, Download } from "lucide-react";
import { useState } from "react";

export default function StudentsPage() {
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const handleBulkEmail = () => {
    console.log("Sending bulk email to:", selectedStudentIds);
  };

  const handleBulkExport = () => {
    console.log("Exporting data for:", selectedStudentIds);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Students</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleBulkEmail}
            disabled={selectedStudentIds.length === 0}
          >
            <Mail className="h-4 w-4 mr-2" />
            Bulk Email
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

      <StudentsFilters />
      
      <StudentsList
        selectedIds={selectedStudentIds}
        onSelectedIdsChange={setSelectedStudentIds}
      />
    </div>
  );
}