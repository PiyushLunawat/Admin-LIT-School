"use client";

import { getCohorts } from "@/app/api/cohorts";
import { getStudents } from "@/app/api/student";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ExcelJS from "exceljs";
import { Download, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { CohortDetails } from "./cohort-details";
import { LitmusDetails } from "./litmus-details";
import { LitmusFilters } from "./litmus-filters";
import { LitmusList } from "./litmus-list";

type BadgeVariant =
  | "destructive"
  | "warning"
  | "secondary"
  | "success"
  | "pending"
  | "onhold"
  | "default";

interface LitmusQueueProps {
  initialApplications: any;
  setInitialApplications: (apps: any) => void;
}

export function LitmusQueue({
  initialApplications,
  setInitialApplications,
}: LitmusQueueProps) {
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<
    string | null
  >(null);
  const [selectedSubmissionIds, setSelectedSubmissionIds] = useState<string[]>(
    []
  );

  const [selectedApplication, setSelectedApplication] = useState<string | null>(
    null
  );
  const [selectedApplicationIds, setSelectedApplicationIds] = useState<
    string[]
  >([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [currentCohort, setCurrentCohort] = useState<any>();
  const [applications, setApplications] = useState<any>(initialApplications);
  const [loading, setLoading] = useState(true);

  const [applied, setApplied] = useState(0);
  const [intCleared, setIntCleared] = useState(0);
  const [feePaid, setFeePaid] = useState(0);

  const [searchQuery, setSearchQuery] = useState<string>(""); // added for search
  const [selectedCohort, setSelectedCohort] = useState<string>("all-cohorts");
  const [selectedStatus, setSelectedStatus] = useState<string>("all-status");
  const [sortBy, setSortBy] = useState<string>("newest");

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    async function fetchStudents() {
      try {
        const response = await getStudents();
        const mappedStudents = response.data.filter((student: any) =>
          ["reviewing", "enrolled", "dropped"].includes(
            student?.appliedCohorts?.[student?.appliedCohorts.length - 1]
              ?.status
          )
        );
        mappedStudents.sort((a: any, b: any) => {
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

        setApplications(mappedStudents);
        setInitialApplications(mappedStudents);
        const cohortsData = await getCohorts();
        setCohorts(cohortsData.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, [refreshKey]);

  const filteredAndSortedApplications = useMemo(() => {
    // Filter by cohort
    const filteredByCohort = applications.filter((app: any) => {
      if (selectedCohort === "all-cohorts") {
        return true;
      }
      const matchedCohort = cohorts.find(
        (cohort) => cohort.cohortId === selectedCohort
      );
      setCurrentCohort(matchedCohort || null);
      return (
        app?.appliedCohorts?.[app?.appliedCohorts.length - 1].cohortId
          ?.cohortId === selectedCohort
      );
    });

    setApplied(
      applications.filter(
        (student: any) =>
          student?.appliedCohorts?.[student?.appliedCohorts.length - 1]
            ?.applicationDetails?.applicationFeeDetail?.status === "paid" &&
          student?.appliedCohorts?.[student?.appliedCohorts.length - 1]
            ?.cohortId?.cohortId === selectedCohort
      ).length
    );

    setIntCleared(
      applications.filter(
        (student: any) =>
          student?.appliedCohorts?.[student?.appliedCohorts.length - 1]
            ?.applicationDetails?.applicationStatus === "selected" &&
          student?.appliedCohorts?.[student?.appliedCohorts.length - 1]
            ?.cohortId?.cohortId === selectedCohort
      ).length
    );

    setFeePaid(
      applications.filter(
        (student: any) =>
          student?.cousrseEnrolled?.[student.cousrseEnrolled?.length - 1]
            ?.tokenFeeDetails?.verificationStatus === "paid" &&
          student?.cohort?.cohortId === selectedCohort
      ).length
    );

    // a) Search filter by applicant name
    const filteredBySearch = filteredByCohort.filter((app: any) => {
      if (searchQuery.trim()) {
        const lowerSearch = searchQuery.toLowerCase();
        const name = `${app.firstName ?? ""} ${
          app.lastName ?? ""
        }`.toLowerCase();
        return name.includes(lowerSearch);
      }
      return true;
    });

    // b) Status filter
    const filteredByStatus = filteredBySearch.filter((app: any) => {
      if (selectedStatus !== "all-status") {
        const status =
          app?.appliedCohorts?.[
            app?.appliedCohorts.length - 1
          ]?.applicationDetails?.applicationStatus?.toLowerCase() || "pending";
        return status === selectedStatus;
      }
      return true;
    });

    // 2) Sort
    let sortedApplications = [...filteredByStatus];
    switch (sortBy) {
      case "newest":
        sortedApplications.sort((a: any, b: any) => {
          const dateA = new Date(
            a?.appliedCohorts?.[
              a?.appliedCohorts.length - 1
            ]?.applicationDetails?.updatedAt
          ).getTime();
          const dateB = new Date(
            b?.appliedCohorts?.[
              b?.appliedCohorts.length - 1
            ]?.applicationDetails?.updatedAt
          ).getTime();
          return dateB - dateA; // newest first
        });
        break;

      case "oldest":
        sortedApplications.sort((a: any, b: any) => {
          const dateA = new Date(
            a?.appliedCohorts?.[
              a?.appliedCohorts.length - 1
            ]?.applicationDetails?.updatedAt
          ).getTime();
          const dateB = new Date(
            b?.appliedCohorts?.[
              b?.appliedCohorts.length - 1
            ]?.applicationDetails?.updatedAt
          ).getTime();
          return dateA - dateB; // oldest first
        });
        break;

      case "name-asc":
        sortedApplications.sort((a: any, b: any) => {
          const nameA = `${a.firstName ?? ""} ${
            a.lastName ?? ""
          }`.toLowerCase();
          const nameB = `${b.firstName ?? ""} ${
            b.lastName ?? ""
          }`.toLowerCase();
          return nameA.localeCompare(nameB);
        });
        break;

      case "name-desc":
        sortedApplications.sort((a: any, b: any) => {
          const nameA = `${a.firstName ?? ""} ${
            a.lastName ?? ""
          }`.toLowerCase();
          const nameB = `${b.firstName ?? ""} ${
            b.lastName ?? ""
          }`.toLowerCase();
          return nameB.localeCompare(nameA);
        });
        break;
    }

    return sortedApplications;
  }, [applications, searchQuery, selectedStatus, sortBy, selectedCohort]);

  const handleApplicationUpdate = () => {
    setRefreshKey((prevKey) => prevKey + 1); // Increment the refresh key
  };

  const handleBulkEmail = () => {
    console.log("Sending bulk email to:", selectedSubmissionIds);
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">LITMUS Test</h2>
        <div className="flex gap-2">
          {/* <Button
            variant="outline"
            onClick={handleBulkEmail}
            disabled={selectedSubmissionIds.length === 0}
          >
            <Mail className="h-4 w-4 mr-2" />
            Bulk Email
          </Button> */}
          <Button
            variant="outline"
            onClick={() =>
              handleBulkExport(
                applications.filter((app: any) =>
                  selectedSubmissionIds.includes(app._id)
                )
              )
            }
            disabled={selectedSubmissionIds.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Selected
          </Button>
          <Button
            variant="outline"
            size={"icon"}
            onClick={handleApplicationUpdate}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <LitmusFilters
        setDateRange={setDateRange}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        cohorts={cohorts}
        selectedCohort={selectedCohort}
        onCohortChange={setSelectedCohort}
        selectedStatus={selectedStatus}
        onSelectedStatusChange={setSelectedStatus}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {selectedCohort !== "all-cohorts" && (
        <CohortDetails
          cohort={currentCohort}
          applied={applied}
          intCleared={intCleared}
          feePaid={feePaid}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LitmusList
            applications={filteredAndSortedApplications}
            onApplicationSelect={(application) =>
              setSelectedApplication(application)
            }
            selectedIds={selectedApplicationIds}
            onSelectedIdsChange={setSelectedApplicationIds}
            onApplicationUpdate={handleApplicationUpdate}
          />
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card className="h-[calc(100vh-7rem)] overflow-hidden">
              {selectedApplication ? (
                <LitmusDetails
                  application={selectedApplication}
                  onClose={() => setSelectedSubmissionId(null)}
                  onApplicationUpdate={handleApplicationUpdate}
                />
              ) : (
                <div className="h-full flex items-center justify-center p-6 text-muted-foreground">
                  <p className="text-center">
                    Select a submission to view details
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
