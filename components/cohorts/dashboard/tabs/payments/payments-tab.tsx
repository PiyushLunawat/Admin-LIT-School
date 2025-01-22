"use client";

import { useEffect, useState } from "react";
import { PaymentsSummary } from "./payments-summary";
import { PaymentsList } from "./payments-list";
import { PaymentsFilters } from "./payments-filters";
import { PaymentDetails } from "./payment-details";
import { Button } from "@/components/ui/button";
import { Mail, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { getStudents } from "@/app/api/student";
import { getCohortById } from "@/app/api/cohorts";

interface PaymentsTabProps {
  cohortId: string;
  selectedDateRange: DateRange | undefined;
}

export function PaymentsTab({ cohortId, selectedDateRange }: PaymentsTabProps) {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [scholarship, setScholarship] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [refreshKey, setRefreshKey] = useState(0); 

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState("all");
  const [selectedScholarship, setSelectedScholarship] = useState("all");

  const handleApplicationUpdate = () => {
    setRefreshKey((prevKey) => prevKey + 1); // Increment the refresh key
  };

  // Fetch scholarships based on cohortId
  useEffect(() => {
    async function fetchScholarships() {
      try {
        const cohortsData = await getCohortById(cohortId);
        const scholarships = cohortsData.data?.litmusTestDetail[0]?.scholarshipSlabs || [];
        setScholarship(scholarships);
      } catch (error) {
        console.error("Error fetching scholarship data:", error);
      }
    }
    fetchScholarships();
  }, [cohortId]);

  // Fetch and filter students
  useEffect(() => {
    async function fetchAndFilterStudents() {
      setLoading(true);
      try {
        const response = await getStudents();
        const mappedStudents: any[] = response.data.filter(
          (student: any) =>
            student?.litmusTestDetails[0]?.litmusTaskId?.status === 'completed' &&
            student.cohort?._id === cohortId
        );

        const filteredApplications = mappedStudents.filter((app: any) => {
          // --- Date Range Check ---
          if (selectedDateRange) {
            const appDate = new Date(app.updatedAt);
            const { from, to } = selectedDateRange;
            if ((from && appDate < from) || (to && appDate > to)) {
              return false;
            }
          }

          // --- Search Query (Name, Email, Phone) ---
          if (searchQuery) {
            const lowerSearch = searchQuery.toLowerCase();
            const matchesSearch =
              ((app.firstName+' '+app.lastName) || "").toLowerCase().includes(lowerSearch) ||
              (app.email || "").toLowerCase().includes(lowerSearch) ||
              (app.phone || "").toLowerCase().includes(lowerSearch);
            if (!matchesSearch) return false;
          }

          // --- Payment Status Check ---
          if (selectedPaymentStatus !== "all") {
            if ((app.status || "").toLowerCase() !== selectedPaymentStatus.toLowerCase()) {
              return false;
            }
          }

          // --- Payment Plan Check ---
          if (selectedPaymentPlan !== "all") {
            const lastCourse = app.cousrseEnrolled?.[app.cousrseEnrolled.length - 1];
            const installmentType = lastCourse?.feeSetup?.installmentType || "";
            
            if (installmentType.toLowerCase() !== selectedPaymentPlan.toLowerCase()) {
              return false;
            }
          }

          // --- Scholarship Check ---
          if (selectedScholarship !== "all") {
            const scholarships = app.cousrseEnrolled?.[app.cousrseEnrolled.length - 1]?.semesterFeeDetails?.scholarshipName;
            console.log("installmentType",scholarships,selectedScholarship);
            
            if (scholarships?.toLowerCase() !== selectedScholarship.toLowerCase()) {
              return false;
            }
          }

          return true;
        });

        setApplications(filteredApplications);
        console.log("Fetched & Filtered Students:", filteredApplications);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAndFilterStudents();
  }, [
    selectedDateRange,
    searchQuery,
    selectedPaymentStatus,
    selectedPaymentPlan,
    selectedScholarship,
    cohortId,
  ]);

  const handleBulkReminder = () => {
    console.log("Sending payment reminders to:", selectedStudentIds);
  };

  const handleBulkExport = () => {
    console.log("Exporting payment data for:", selectedStudentIds);
  };

  return (
    <div className="space-y-6">
      {/* Header and Action Buttons */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payments</h2>
        <div className="flex gap-2">
          {/* <Button
            variant="outline"
            onClick={handleBulkReminder}
            disabled={selectedStudentIds.length === 0}
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Reminders
          </Button> */}
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

      {/* Payments Summary */}
      <PaymentsSummary applications={applications} cohortId={cohortId} />

      {/* Payments Filters */}
      <PaymentsFilters
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        scholarship={scholarship}
        selectedScholarship={selectedScholarship}
        onScholarshipChange={setSelectedScholarship}
        selectedPaymentStatus={selectedPaymentStatus}
        onPaymentStatusChange={setSelectedPaymentStatus}
        selectedPaymentPlan={selectedPaymentPlan}
        onPaymentPlanChange={setSelectedPaymentPlan}
      />

      {/* Payments List and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PaymentsList
            applications={applications}
            onStudentSelect={(id) => { setSelectedStudent(id); }}
            selectedIds={selectedStudentIds}
            onSelectedIdsChange={setSelectedStudentIds}
            onApplicationUpdate={handleApplicationUpdate} 
          />
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card className="h-[calc(100vh-7rem)] overflow-hidden">
              {selectedStudent? (
                <PaymentDetails
                  student={selectedStudent}
                  onClose={() => setSelectedStudent(null)}
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
