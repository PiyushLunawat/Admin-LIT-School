"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getCohorts } from "@/app/api/cohorts";
import { getPrograms } from "@/app/api/programs";
import { getCentres } from "@/app/api/centres";
import { StudentsList } from "@/components/students/students-list";
import { StudentsFilters } from "@/components/students/students-filters";
import { Button } from "@/components/ui/button";
import { Mail, Download } from "lucide-react";
import { getStudents } from "@/app/api/student";

export default function StudentsPage() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<any>([]);
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);

  // --- FILTER STATES ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("all-programs");
  const [selectedCohort, setSelectedCohort] = useState("all-cohorts");
  const [selectedAppStatus, setSelectedAppStatus] = useState("all-statuses");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all-payments");

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
          try {
            const response = await getStudents();
            const mappedStudents = response.data.filter((student: any) => (
              ['initiated', 'applied', 'reviewing', 'enrolled', 'dropped'].includes(student?.appliedCohorts?.[student?.appliedCohorts.length - 1]?.status)
            ));
                        
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

          const latestCohort = student?.appliedCohorts?.[student?.appliedCohorts.length - 1];
          const cohortDetails = latestCohort?.cohortId;
          const applicationDetails = latestCohort?.applicationDetails;
          // 1) Search check: by name OR email OR phone
          const lowerSearch = searchQuery.toLowerCase();
          const matchesSearch =
            (student?.firstName+' '+student?.lastName).toLowerCase().includes(lowerSearch) ||
            student?.email.toLowerCase().includes(lowerSearch) ||
            student?.mobileNumber.toLowerCase().includes(lowerSearch);
    
          if (!matchesSearch) {
            return false;
          }
    
          // 2) Program check
          if (selectedProgram !== "all-programs") {
            if (cohortDetails?.programDetail?.name.toLowerCase() !== selectedProgram.toLowerCase()) {
              return false;
            }
          }
    
          // 3) Cohort check
          if (selectedCohort !== "all-cohorts") {
            if (cohortDetails?.cohortId.toLowerCase() !== selectedCohort.toLowerCase()) {
              return false;
            }
          }
    
          // 4) Application Status check
          if (selectedAppStatus !== "all-statuses") {
            if (["under review", "accepted", "rejected"].includes(selectedAppStatus.toLowerCase())) {
              if (applicationDetails?.applicationStatus?.toLowerCase() !== selectedAppStatus.toLowerCase()) {
                return false;
              }
            } else {
              if (latestCohort?.status?.toLowerCase() !== selectedAppStatus.toLowerCase()) {
                return false;
              }
            }
          }          
    
          // 5) Payment Status check
          if (selectedPaymentStatus !== "all-payments") {
            if (latestCohort?.paymentStatus !== selectedPaymentStatus) {
              return false;
            }
          }
    
          return true;
        });
      }, [applications, searchQuery, selectedProgram, selectedCohort, selectedAppStatus, selectedPaymentStatus]);

  // --- ACTION HANDLERS ---
  const handleBulkEmail = () => {
    console.log("Sending bulk email to:", selectedStudents);
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
      <StudentsList
        selectedIds={selectedStudents}
        onSelectedIdsChange={setSelectedStudents}
        applications={filteredAndSortedApplications}
        onApplicationUpdate={handleApplicationUpdate} 
      />
    </div>
  );
}
