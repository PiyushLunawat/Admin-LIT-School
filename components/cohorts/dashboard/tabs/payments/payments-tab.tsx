"use client";

import { useEffect, useState } from "react";
import { PaymentsSummary } from "./payments-summary";
import { PaymentsList } from "./payments-list";
import { PaymentsFilters } from "./payments-filters";
import { PaymentDetails } from "./payment-details";
import { Button } from "@/components/ui/button";
import { Mail, Download, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { getStudents } from "@/app/api/student";
import { getCohortById } from "@/app/api/cohorts";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface PaymentsTabProps {
  cohortId: string;
  selectedDateRange: DateRange | undefined;
}

export function PaymentsTab({ cohortId, selectedDateRange }: PaymentsTabProps) {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [scholarship, setScholarship] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0); 

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState("all");
  const [selectedScholarship, setSelectedScholarship] = useState("all");

  const handleApplicationUpdate = () => {
    console.log("prevKey",refreshKey)
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
            ['selected'].includes(student?.appliedCohorts?.[student?.appliedCohorts.length - 1]?.applicationDetails?.applicationStatus) &&
            student?.appliedCohorts?.[student?.appliedCohorts.length - 1]?.cohortId?._id == cohortId
        );

        mappedStudents?.sort((a: any, b: any) => {
          const dateA = new Date(a?.updatedAt);
          const dateB = new Date(b?.updatedAt);
      
          if (dateA > dateB) return -1;
          if (dateA < dateB) return 1;
      
          const monthA = dateA.getMonth();
          const monthB = dateB.getMonth();
      
          if (monthA > monthB) return -1;
          if (monthA < monthB) return 1;
      
          const yearA = dateA.getFullYear(); 
          const yearB = dateB.getFullYear(); 
      
          if (yearA > yearB) return -1; 
          if (yearA < yearB) return 1; 
      
          return 0;
        });

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
            const lastCohort = app?.appliedCohorts?.[app?.appliedCohorts.length - 1];
            const installmentType = lastCohort?.paymentDetails?.paymentPlan || "";
            
            if (installmentType.toLowerCase() !== selectedPaymentPlan.toLowerCase()) {
              return false;
            }
          }

          // --- Scholarship Check ---
          if (selectedScholarship !== "all") {
            const scholarships = app?.appliedCohorts?.[app?.appliedCohorts.length - 1]?.litmusTestDetails?.scholarshipDetail?.scholarshipName;
            // console.log("installmentType",scholarships,selectedScholarship);
            if (scholarships?.toLowerCase() !== selectedScholarship.toLowerCase()) {
              return false;
            }
          }
          return true;
        });

        setApplications(filteredApplications);
        // console.log("Fetched & Filtered Students:", filteredApplications);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAndFilterStudents();
  }, [ refreshKey, selectedDateRange, searchQuery, selectedPaymentStatus, selectedPaymentPlan, selectedScholarship, cohortId,]);

  const handleBulkReminder = () => {
    console.log("Sending payment reminders to:", selectedStudents);
  };

  const escapeCSV = (field: string): string => {
    if (!field) return "";
    return `"${field.replace(/"/g, '""')}"`;
  };
  
  const handleBulkExport = (selectedStudents: any[]) => {
    if (selectedStudents.length === 0) {
      console.log("No students selected for export.");
      return;
    }
    // Define CSV headers.
    const headers = [
      "Student's Name",
      "Email",
      "Phone No.",
      "Address",
      "Fathers' Name",
      "Father's Contact",
      "Father's Email",
      "Mother's Name",
      "Mother's Contact",
      "Mother's Email",
      "Emergency Contact Name",
      "Emergency Contact Number",
      "Emergency Contact Email",
    ];
  
    // Map each selected student to a CSV row.
    const rows = selectedStudents.map((student) => {
      const studentDetails = student.appliedCohorts?.[student.appliedCohorts.length - 1]?.applicationDetails?.studentDetails;

      const studentName = `${student?.firstName || ""} ${student?.lastName || ""}`.trim();
      const email = student?.email || "";
      const phone = student?.mobileNumber || "";
      const address = `${studentDetails?.currentAddress?.streetAddress || ""} ${studentDetails?.currentAddress?.city || ""} ${studentDetails?.currentAddress?.state || ""} ${studentDetails?.currentAddress?.postalCode || ""}`.trim();
      const fatherName = `${studentDetails?.parentInformation?.father?.firstName || ""} ${studentDetails?.parentInformation?.father?.lastName || ""}`.trim();
      const fatherContact = studentDetails?.parentInformation?.father?.contactNumber || "";
      const fatherEmail = studentDetails?.parentInformation?.father?.email || "";
      const motherName = `${studentDetails?.parentInformation?.mother?.firstName || ""} ${studentDetails?.parentInformation?.mother?.lastName || ""}`.trim();
      const motherContact = studentDetails?.parentInformation?.mother?.contactNumber || "";
      const motherEmail = studentDetails?.parentInformation?.mother?.email || "";
      const emergencyContactName = `${studentDetails?.emergencyContact?.firstName || ""} ${studentDetails?.emergencyContact?.lastName || ""}`.trim();
      const emergencyContactNumber = studentDetails?.emergencyContact?.contactNumber || "";
      const emergencyContactEmail = studentDetails?.emergencyContact?.email || "";
      return [
        escapeCSV(studentName),
        escapeCSV(email),
        escapeCSV(phone),
        escapeCSV(address),
        escapeCSV(fatherName),
        escapeCSV(fatherContact),
        escapeCSV(fatherEmail),
        escapeCSV(motherName),
        escapeCSV(motherContact),
        escapeCSV(motherEmail),
        escapeCSV(emergencyContactName),
        escapeCSV(emergencyContactNumber),
        escapeCSV(emergencyContactEmail),
      ].join(",");
    });
  
    // Combine header and rows into one CSV string.
    const csvContent = [headers.join(","), ...rows].join("\n");
  
    // Create a Blob from the CSV string and trigger the download.
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "students_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
            disabled={selectedStudents.length === 0}
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Reminders
          </Button> */}
          <Button
            variant="outline"
            onClick={() => handleBulkExport(selectedStudents)}
            disabled={selectedStudents.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Selected
          </Button>
          <Button
            variant="outline"
            size={'icon'}
            onClick={() => handleApplicationUpdate()}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Payments Summary */}
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="-mt-4">Payment Breakdown</AccordionTrigger>
          <AccordionContent>
            <PaymentsSummary applications={applications} cohortId={cohortId} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

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
            selectedIds={selectedStudents}
            onSelectedIdsChange={setSelectedStudents}
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
                  onApplicationUpdate={handleApplicationUpdate}
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
