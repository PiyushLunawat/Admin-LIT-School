"use client";

import { getCohortById } from "@/app/api/cohorts";
import { getStudents } from "@/app/api/student";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ExcelJS from "exceljs";
import { Download, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { PaymentDetails } from "./payment-details";
import { PaymentsFilters } from "./payments-filters";
import { PaymentsList } from "./payments-list";
import { PaymentsSummary } from "./payments-summary";

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
    console.log("prevKey", refreshKey);
    setRefreshKey((prevKey) => prevKey + 1); // Increment the refresh key
  };

  // Fetch scholarships based on cohortId
  useEffect(() => {
    async function fetchScholarships() {
      try {
        const cohortsData = await getCohortById(cohortId);
        const scholarships =
          cohortsData.data?.litmusTestDetail[0]?.scholarshipSlabs || [];
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
            ["selected"].includes(
              student?.appliedCohorts?.[student?.appliedCohorts.length - 1]
                ?.applicationDetails?.applicationStatus
            ) &&
            student?.appliedCohorts?.[student?.appliedCohorts.length - 1]
              ?.cohortId?._id == cohortId
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
              (app.firstName + " " + app.lastName || "")
                .toLowerCase()
                .includes(lowerSearch) ||
              (app.email || "").toLowerCase().includes(lowerSearch) ||
              (app.phone || "").toLowerCase().includes(lowerSearch);
            if (!matchesSearch) return false;
          }

          // --- Payment Status Check ---
          if (selectedPaymentStatus !== "all") {
            if (
              (app.status || "").toLowerCase() !==
              selectedPaymentStatus.toLowerCase()
            ) {
              return false;
            }
          }

          // --- Payment Plan Check ---
          if (selectedPaymentPlan !== "all") {
            const lastCohort =
              app?.appliedCohorts?.[app?.appliedCohorts.length - 1];
            const installmentType =
              lastCohort?.paymentDetails?.paymentPlan || "";

            if (
              installmentType.toLowerCase() !==
              selectedPaymentPlan.toLowerCase()
            ) {
              return false;
            }
          }

          // --- Scholarship Check ---
          if (selectedScholarship !== "all") {
            const scholarships =
              app?.appliedCohorts?.[app?.appliedCohorts.length - 1]
                ?.litmusTestDetails?.scholarshipDetail?.scholarshipName;
            // console.log("installmentType",scholarships,selectedScholarship);
            if (
              scholarships?.toLowerCase() !== selectedScholarship.toLowerCase()
            ) {
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
  }, [
    refreshKey,
    selectedDateRange,
    searchQuery,
    selectedPaymentStatus,
    selectedPaymentPlan,
    selectedScholarship,
    cohortId,
  ]);

  const handleBulkReminder = () => {
    console.log("Sending payment reminders to:", selectedStudents);
  };

  const escapeCSV = (field: string): string => {
    if (!field) return "";
    return `"${field.replace(/"/g, '""')}"`;
  };

  const handleBulkExport = async (selectedStudents: any[]) => {
    if (selectedStudents.length === 0) {
      console.log("No students selected for export.");
      return;
    }

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Students");

    // Define columns with explicit types
    worksheet.columns = [
      { header: "Student's Name", key: "name", width: 20 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone No.", key: "phone", width: 15, style: { numFmt: "@" } },
      { header: "Address", key: "address", width: 40 },
      { header: "Fathers' Name", key: "fatherName", width: 20 },
      {
        header: "Father's Contact",
        key: "fatherContact",
        width: 15,
        style: { numFmt: "@" },
      },
      { header: "Father's Email", key: "fatherEmail", width: 30 },
      { header: "Mother's Name", key: "motherName", width: 20 },
      {
        header: "Mother's Contact",
        key: "motherContact",
        width: 15,
        style: { numFmt: "@" },
      },
      { header: "Mother's Email", key: "motherEmail", width: 30 },
      { header: "Emergency Contact Name", key: "emergencyName", width: 20 },
      {
        header: "Emergency Contact Number",
        key: "emergencyNumber",
        width: 15,
        style: { numFmt: "@" },
      },
      { header: "Emergency Contact Email", key: "emergencyEmail", width: 30 },
    ];

    // Add rows
    selectedStudents.forEach((student) => {
      const studentDetails =
        student.appliedCohorts?.[student.appliedCohorts.length - 1]
          ?.applicationDetails?.studentDetails;

      worksheet.addRow({
        name: `${student?.firstName || ""} ${student?.lastName || ""}`.trim(),
        email: student?.email || "",
        phone: student?.mobileNumber || "",
        address: `${studentDetails?.currentAddress?.streetAddress || ""} ${
          studentDetails?.currentAddress?.city || ""
        } ${studentDetails?.currentAddress?.state || ""} ${
          studentDetails?.currentAddress?.postalCode || ""
        }`.trim(),
        fatherName: `${
          studentDetails?.parentInformation?.father?.firstName || ""
        } ${studentDetails?.parentInformation?.father?.lastName || ""}`.trim(),
        fatherContact:
          studentDetails?.parentInformation?.father?.contactNumber || "",
        fatherEmail: studentDetails?.parentInformation?.father?.email || "",
        motherName: `${
          studentDetails?.parentInformation?.mother?.firstName || ""
        } ${studentDetails?.parentInformation?.mother?.lastName || ""}`.trim(),
        motherContact:
          studentDetails?.parentInformation?.mother?.contactNumber || "",
        motherEmail: studentDetails?.parentInformation?.mother?.email || "",
        emergencyName: `${studentDetails?.emergencyContact?.firstName || ""} ${
          studentDetails?.emergencyContact?.lastName || ""
        }`.trim(),
        emergencyNumber: studentDetails?.emergencyContact?.contactNumber || "",
        emergencyEmail: studentDetails?.emergencyContact?.email || "",
      });
    });

    // Force all phone number columns to be text format
    ["phone", "fatherContact", "motherContact", "emergencyNumber"].forEach(
      (column) => {
        worksheet
          .getColumn(column)
          .eachCell({ includeEmpty: false }, (cell: { numFmt: string }) => {
            cell.numFmt = "@";
          });
      }
    );

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Create blob and download
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "students_export.xlsx");
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
            size={"icon"}
            onClick={() => handleApplicationUpdate()}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Payments Summary */}
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="-mt-4">
            Payment Breakdown
          </AccordionTrigger>
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
          {applications.length === 0 && loading ? (
            <div className="h-fit flex items-center justify-center p-6 border rounded text-muted-foreground">
              <p className="text-center animate-pulse">
                All your students will appear here...
              </p>
            </div>
          ) : (
            <PaymentsList
              applications={applications}
              onStudentSelect={(id) => {
                setSelectedStudent(id);
              }}
              selectedIds={selectedStudents}
              onSelectedIdsChange={setSelectedStudents}
              onApplicationUpdate={handleApplicationUpdate}
            />
          )}
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card className="max-h-[calc(100vh-7rem)] overflow-y-auto">
              {selectedStudent ? (
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
