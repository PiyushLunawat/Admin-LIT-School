"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCohorts } from "@/app/api/cohorts";
import { getPrograms } from "@/app/api/programs";
import { getCentres } from "@/app/api/centres";
import { StudentsList } from "@/components/students/students-list";
import { StudentsFilters } from "@/components/students/students-filters";
import { Button } from "@/components/ui/button";
import { Mail, Download } from "lucide-react";

export default function StudentsPage() {
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // --- FILTER STATES ---  
  // Search text
  const [searchQuery, setSearchQuery] = useState("");
  // Program, Cohort, Application Status, Payment Status
  const [selectedProgram, setSelectedProgram] = useState("all-programs");
  const [selectedCohort, setSelectedCohort] = useState("all-cohorts");
  const [selectedAppStatus, setSelectedAppStatus] = useState("all-statuses");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all-payments");

  // Option data (used for the <Select> items)
  const [programs, setPrograms] = useState<any[]>([]);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [centres, setCentres] = useState<any[]>([]);

  const router = useRouter();

  // Fetch programs, cohorts, centres for the filter dropdowns
  useEffect(() => {
    async function fetchData() {
      try {
        const cohortsData = await getCohorts();
        setCohorts(cohortsData.data);

        const programsData = await getPrograms();
        setPrograms(programsData.data);

        const centresData = await getCentres();
        setCentres(centresData.data);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    }
    fetchData();
  }, []);

  // --- ACTION HANDLERS ---
  const handleBulkEmail = () => {
    console.log("Sending bulk email to:", selectedStudentIds);
  };

  const handleBulkExport = () => {
    console.log("Exporting data for:", selectedStudentIds);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
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

      {/* Filters */}
      <StudentsFilters
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        programs={programs}
        selectedProgram={selectedProgram}
        onProgramChange={setSelectedProgram}
        cohorts={cohorts}
        selectedCohort={selectedCohort}
        onCohortChange={setSelectedCohort}
        selectedAppStatus={selectedAppStatus}
        onAppStatusChange={setSelectedAppStatus}
        selectedPaymentStatus={selectedPaymentStatus}
        onPaymentStatusChange={setSelectedPaymentStatus}
        // You can pass centres if you need them
      />

      {/* Students List */}
      <StudentsList
        selectedIds={selectedStudentIds}
        onSelectedIdsChange={setSelectedStudentIds}
        searchQuery={searchQuery}
        selectedProgram={selectedProgram}
        selectedCohort={selectedCohort}
        selectedAppStatus={selectedAppStatus}
        selectedPaymentStatus={selectedPaymentStatus}
      />
    </div>
  );
}
