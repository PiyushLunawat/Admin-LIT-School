"use client";

import { getStudents } from "@/app/api/student";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ExcelJS from "exceljs";
import { Download, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { ApplicationDetails } from "./application-details";
import { ApplicationFilters } from "./application-filters";
import { ApplicationsList } from "./applications-list";

interface ApplicationsTabProps {
  cohortId: string;
  selectedDateRange: DateRange | undefined;
}

export function ApplicationsTab({
  cohortId,
  selectedDateRange,
}: ApplicationsTabProps) {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<any>([]);
  const [selectedApplication, setSelectedApplication] = useState<string | null>(
    null
  );
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);

  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>(""); // added for search
  const [selectedStatus, setSelectedStatus] = useState<string>("all-status");
  const [sortBy, setSortBy] = useState<string>("newest");

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    async function fetchStudents() {
      setLoading(true);
      try {
        const response = await getStudents();
        const mappedStudents = response.data.filter(
          (student: any) =>
            ["initiated", "applied", "reviewing", "dropped"].includes(
              student?.appliedCohorts?.[student?.appliedCohorts.length - 1]
                ?.status
            ) &&
            student?.appliedCohorts?.[student?.appliedCohorts.length - 1]
              ?.cohortId?._id == cohortId
        );

        setApplications(mappedStudents);
        // setInitialApplications(mappedStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, [refreshKey]);

  const filteredAndSortedApplications = useMemo(() => {
    const filteredApplications = applications?.filter((app: any) => {
      if (!selectedDateRange) return true;
      const appDate = new Date(app.updatedAt);
      const { from, to } = selectedDateRange;
      return (!from || appDate >= from) && (!to || appDate <= to);
    });
    // 1) Filter

    filteredApplications?.sort((a: any, b: any) => {
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

    let filtered = filteredApplications;

    // a) Search filter by applicant name
    if (searchQuery.trim()) {
      const lowerSearch = searchQuery.toLowerCase();
      filtered = filtered?.filter((app: any) => {
        const name = `${app.firstName ?? ""} ${
          app.lastName ?? ""
        }`.toLowerCase();
        return name.includes(lowerSearch);
      });
    }

    // b) Status filter
    if (selectedStatus !== "all-status") {
      filtered = filtered?.filter((app: any) => {
        let status;
        if (selectedStatus === "dropped") {
          status =
            app?.appliedCohorts[
              app.appliedCohorts.length - 1
            ]?.status?.toLowerCase();
        } else {
          status =
            app?.appliedCohorts[
              app.appliedCohorts.length - 1
            ]?.applicationDetails?.applicationStatus?.toLowerCase() ||
            "pending";
        }
        return status === selectedStatus;
      });
    }

    // 2) Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a: any, b: any) => {
          const dateA = new Date(
            a?.appliedCohorts[
              a.appliedCohorts.length - 1
            ]?.applicationDetails?.updatedAt
          ).getTime();
          const dateB = new Date(
            b?.appliedCohorts[
              b.appliedCohorts.length - 1
            ]?.applicationDetails?.updatedAt
          ).getTime();
          return dateB - dateA; // newest first
        });
        break;

      case "oldest":
        filtered.sort((a: any, b: any) => {
          const dateA = new Date(
            a?.appliedCohorts[
              a.appliedCohorts.length - 1
            ]?.applicationDetails?.updatedAt
          ).getTime();
          const dateB = new Date(
            b?.appliedCohorts[
              b.appliedCohorts.length - 1
            ]?.applicationDetails?.updatedAt
          ).getTime();
          return dateA - dateB; // oldest first
        });
        break;

      case "name-asc":
        filtered.sort((a: any, b: any) => {
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
        filtered.sort((a: any, b: any) => {
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

    return filtered;
  }, [applications, searchQuery, selectedStatus, sortBy, selectedDateRange]);

  const handleApplicationUpdate = () => {
    setRefreshKey((prevKey) => prevKey + 1); // Increment the refresh key
  };

  const handleBulkEmail = () => {
    console.log("Sending bulk email to:", selectedStudents);
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
          .eachCell({ includeEmpty: false }, (cell) => {
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
        <h2 className="text-2xl font-bold">Applications</h2>
        <div className="flex gap-2">
          {/* <Button
            variant="outline"
            onClick={handleBulkEmail}
            disabled={selectedApplicationIds.length === 0}
          >
            <Mail className="h-4 w-4 mr-2" />
            Bulk Email
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
            onClick={handleApplicationUpdate}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <ApplicationFilters
        searchTerm={searchQuery}
        onSearchTermChange={setSearchQuery}
        selectedStatus={selectedStatus}
        onSelectedStatusChange={setSelectedStatus}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {applications.length === 0 && loading ? (
            <div className="h-fit flex items-center justify-center p-6 border rounded text-muted-foreground">
              <p className="text-center animate-pulse">
                All your students will appear here...
              </p>
            </div>
          ) : (
            <ApplicationsList
              applications={filteredAndSortedApplications}
              onApplicationSelect={(application) =>
                setSelectedApplication(application)
              }
              selectedIds={selectedStudents}
              onSelectedIdsChange={setSelectedStudents}
              onApplicationUpdate={handleApplicationUpdate}
            />
          )}
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card className="max-h-[calc(100vh-7rem)] overflow-y-auto">
              {selectedApplication ? (
                <ApplicationDetails
                  application={selectedApplication}
                  onClose={() => setSelectedApplication(null)}
                  onApplicationUpdate={handleApplicationUpdate}
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
