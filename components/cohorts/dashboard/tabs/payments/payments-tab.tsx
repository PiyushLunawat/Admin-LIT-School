"use client";

import { Download, RefreshCw, Wallet } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

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
import { handleBulkExport } from "@/lib/utils/helpers";
import { PaymentsTabProps } from "@/types/components/cohorts/dashboard/tabs/payments/payments-tab";

const PaymentDetails = dynamic(
  () => import("./payment-details").then((m) => m.PaymentDetails),
  {
    ssr: false,
  }
);

const PaymentsFilters = dynamic(
  () => import("./payments-filters").then((m) => m.PaymentsFilters),
  {
    ssr: false,
  }
);

const PaymentsList = dynamic(
  () => import("./payments-list").then((m) => m.PaymentsList),
  {
    ssr: false,
  }
);

const PaymentsSummary = dynamic(
  () => import("./payments-summary").then((m) => m.PaymentsSummary),
  {
    ssr: false,
  }
);

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
    // console.log("prevKey", refreshKey);
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
            <span className="truncate w-[50px] sm:w-auto">Export Selected</span>
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

      {/* Payments Summary */}
      <Card className="bg-[#00AB7B14] px-6">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="">
              <div className="flex gap-2 items-center">
                <Wallet className="w-6 h-6 text-[#00AB7B]" />
                Payment Breakdown
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <PaymentsSummary
                applications={applications}
                cohortId={cohortId}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

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
