"use client";

import { getCentres } from "@/app/api/centres";
import { getCohorts } from "@/app/api/cohorts";
import { getPrograms } from "@/app/api/programs";
import { getStudents } from "@/app/api/student";
import { StudentsFilters } from "@/components/students/students-filters";
import { StudentsList } from "@/components/students/students-list";
import { Button } from "@/components/ui/button";
import ExcelJS from "exceljs";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function StudentsPage() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<any>([]);
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);

  // --- FILTER STATES ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("all-programs");
  const [selectedCohort, setSelectedCohort] = useState("all-cohorts");
  const [selectedAppStatus, setSelectedAppStatus] = useState("all-statuses");
  const [selectedPaymentStatus, setSelectedPaymentStatus] =
    useState("all-payments");

  const [refreshKey, setRefreshKey] = useState(0);

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

  useEffect(() => {
    async function fetchStudents() {
      setLoading(true);
      try {
        const response = await getStudents();
        const mappedStudents = response.data.filter((student: any) =>
          ["initiated", "applied", "reviewing", "enrolled", "dropped"].includes(
            student?.appliedCohorts?.[student?.appliedCohorts.length - 1]
              ?.status
          )
        );

        setApplications(mappedStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, [refreshKey]);

  const handleApplicationUpdate = () => {
    setRefreshKey((prevKey) => prevKey + 1); // Increment the refresh key
  };

  const filteredAndSortedApplications = useMemo(() => {
    applications?.sort((a: any, b: any) => {
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
    return applications.filter((student: any) => {
      const latestCohort =
        student?.appliedCohorts?.[student?.appliedCohorts.length - 1];
      const cohortDetails = latestCohort?.cohortId;
      const applicationDetails = latestCohort?.applicationDetails;
      // 1) Search check: by name OR email OR phone
      const lowerSearch = searchQuery.toLowerCase();
      const matchesSearch =
        (student?.firstName + " " + student?.lastName)
          .toLowerCase()
          .includes(lowerSearch) ||
        student?.email.toLowerCase().includes(lowerSearch) ||
        student?.mobileNumber.toLowerCase().includes(lowerSearch);

      if (!matchesSearch) {
        return false;
      }

      // 2) Program check
      if (selectedProgram !== "all-programs") {
        if (
          cohortDetails?.programDetail?.name.toLowerCase() !==
          selectedProgram.toLowerCase()
        ) {
          return false;
        }
      }

      // 3) Cohort check
      if (selectedCohort !== "all-cohorts") {
        if (
          cohortDetails?.cohortId.toLowerCase() !== selectedCohort.toLowerCase()
        ) {
          return false;
        }
      }

      // 4) Application Status check
      if (selectedAppStatus !== "all-statuses") {
        if (
          ["under review", "accepted", "rejected"].includes(
            selectedAppStatus.toLowerCase()
          )
        ) {
          if (
            applicationDetails?.applicationStatus?.toLowerCase() !==
            selectedAppStatus.toLowerCase()
          ) {
            return false;
          }
        } else {
          if (
            latestCohort?.status?.toLowerCase() !==
            selectedAppStatus.toLowerCase()
          ) {
            return false;
          }
        }
      }

      // 5) Payment Status check
      if (selectedPaymentStatus !== "all-payments") {
        if (selectedPaymentStatus === "token-paid") {
          if (latestCohort?.tokenFeeDetails?.verificationStatus !== "paid")
            return false;
        } else {
          let paymentStatus = "";
          const paymentDetails = latestCohort?.paymentDetails;

          if (paymentDetails?.paymentPlan === "one-shot") {
            const oneShotDetails = paymentDetails?.oneShotPayment;
            if (oneShotDetails) {
              if (oneShotDetails?.verificationStatus === "paid") {
                paymentStatus = "complete";
              } else if (
                new Date(oneShotDetails?.installmentDate) < new Date()
              ) {
                paymentStatus = "overdue";
              } else {
                paymentStatus = oneShotDetails?.verificationStatus;
              }
            }
          } else if (paymentDetails?.paymentPlan === "instalments") {
            const installmentsDetails = paymentDetails?.installments;
            let earliestUnpaid = installmentsDetails?.[0]?.installments?.[0];
            let allPaid = true;

            for (const installment of installmentsDetails || []) {
              if (installment.verificationStatus !== "paid") {
                allPaid = false;
                earliestUnpaid = installment;
                break;
              }
            }
            if (allPaid) {
              paymentStatus = "complete";
            } else if (new Date(earliestUnpaid.installmentDate) < new Date()) {
              paymentStatus = "overdue";
            } else {
              paymentStatus = earliestUnpaid.verificationStatus;
            }
          }
          if (selectedPaymentStatus !== paymentStatus) return false;
        }
      }
      return true;
    });
  }, [
    applications,
    searchQuery,
    selectedProgram,
    selectedCohort,
    selectedAppStatus,
    selectedPaymentStatus,
  ]);

  // --- ACTION HANDLERS ---
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
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Students</h1>
        <div className="flex gap-2">
          {/* <Button
            variant="outline"
            onClick={handleBulkEmail}
            disabled={selectedStudents.length === 0}
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
      {loading ? (
        <div className="h-fit flex items-center justify-center p-6 border rounded text-muted-foreground">
          <p className="text-center animate-pulse">Loading...</p>
        </div>
      ) : (
        <StudentsList
          selectedIds={selectedStudents}
          onSelectedIdsChange={setSelectedStudents}
          applications={filteredAndSortedApplications}
          onApplicationUpdate={handleApplicationUpdate}
        />
      )}
    </div>
  );
}
