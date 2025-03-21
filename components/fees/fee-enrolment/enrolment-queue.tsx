"use client";

import { useEffect, useMemo, useState } from "react";
import { EnrolmentList } from "./enrolment-list";
import { EnrolmentFilters } from "./enrolment-filters";
import { EnrolmentDetails } from "./enrolment-details";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Mail } from "lucide-react";
import { MetricsGrid } from "./metrics-grid";
import { DateRange } from "react-day-picker";
import { getStudents } from "@/app/api/student";
import { getCohorts } from "@/app/api/cohorts";

type BadgeVariant = "destructive" | "warning" | "secondary" | "success" | "pending" | "onhold" | "default";

export function EnrolmentQueue() {
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [selectedApplicationIds, setSelectedApplicationIds] = useState<string[]>([]);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [currentCohort, setCurrentCohort] = useState<any>();
  const [applications, setApplications] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState<string>(""); // added for search
  const [selectedCohort, setSelectedCohort] = useState<string>("all-cohorts");
  const [selectedStatus, setSelectedStatus] = useState<string>("all-status");
  const [sortBy, setSortBy] = useState<string>("newest");

  const [refreshKey, setRefreshKey] = useState(0); 

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await getStudents();
        const mappedStudents =
          response.data.filter(
            (student: any) =>
              ['enrolled', 'dropped'].includes(student?.appliedCohorts?.[student?.appliedCohorts.length - 1]?.status)
          )    
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
        const cohortsData = await getCohorts();
        setCohorts(cohortsData.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  const filteredAndSortedApplications = useMemo(() => {
    
    // Filter by cohort
    const filteredByCohort = applications.filter((app: any) => {
      if (selectedCohort === "all-cohorts") {
        return true;
      }
      const matchedCohort = cohorts.find((cohort) => cohort.cohortId === selectedCohort);
      setCurrentCohort(matchedCohort || null);
      return app?.appliedCohorts?.[app?.appliedCohorts.length - 1].cohortId?.cohortId === selectedCohort;
    });

    // a) Search filter by applicant name
    const filteredBySearch = filteredByCohort.filter((app: any) => {
      if (searchQuery.trim()) {
        const lowerSearch = searchQuery.toLowerCase();
        const name = `${app.firstName ?? ""} ${app.lastName ?? ""}`.toLowerCase();
        return name.includes(lowerSearch);
      }
      return true;
    });

    // b) Status filter
    const filteredByStatus = filteredBySearch.filter((app: any) => {
      if (selectedStatus !== "all-status") {
        const status = app?.appliedCohorts?.[app?.appliedCohorts.length - 1]?.litmusTestDetails?.tokenFeeDetails?.verificationStatus?.toLowerCase() || "pending";
        return status === selectedStatus;
      }
      return true;
    });

    // 2) Sort
    let sortedApplications = [...filteredByStatus];
    switch (sortBy) {
      case "newest":
        sortedApplications.sort((a: any, b: any) => {
          const dateA = new Date(a?.applicationDetails?.updatedAt).getTime();
          const dateB = new Date(b?.applicationDetails?.updatedAt).getTime();
          return dateB - dateA; // newest first
        });
        break;

      case "oldest":
        sortedApplications.sort((a: any, b: any) => {
          const dateA = new Date(a?.applicationDetails?.updatedAt).getTime();
          const dateB = new Date(b?.applicationDetails?.updatedAt).getTime();
          return dateA - dateB; // oldest first
        });
        break;

      case "name-asc":
        sortedApplications.sort((a: any, b: any) => {
          const nameA = `${a.firstName ?? ""} ${a.lastName ?? ""}`.toLowerCase();
          const nameB = `${b.firstName ?? ""} ${b.lastName ?? ""}`.toLowerCase();
          return nameA.localeCompare(nameB);
        });
        break;

      case "name-desc":
        sortedApplications.sort((a: any, b: any) => {
          const nameA = `${a.firstName ?? ""} ${a.lastName ?? ""}`.toLowerCase();
          const nameB = `${b.firstName ?? ""} ${b.lastName ?? ""}`.toLowerCase();
          return nameB.localeCompare(nameA);
        });
        break;
    }

    return sortedApplications;
  }, [applications, searchQuery, selectedStatus, sortBy, selectedCohort]);

  const getStatusColor = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "initiated":
        return "default";
      case "under review":
        return "secondary";
      case "accepted":
      case "selected":
        return "success";
      case "rejected":
      case "not qualified":
        return "warning";
      case "on hold":
      case "waitlist":
        return "onhold";
      case "interview scheduled":
        case "interview rescheduled":
        return "default";
      case "interview concluded":
        return "pending";
      default:
        return "secondary";
    }
  };

  const handleApplicationUpdate = () => {
    setRefreshKey((prevKey) => prevKey + 1); // Increment the refresh key
  };
  
  const handleBulkReminder = () => {
    console.log("Sending payment reminders to:", selectedApplicationIds);
  };

  const handleBulkExport = () => {
    console.log("Exporting payment data for:", selectedApplicationIds);
  };

  return (
    <div className="space-y-6">
      {/* <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payment Management</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleBulkReminder}
            disabled={selectedApplicationIds.length === 0}
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Reminders
          </Button>
          <Button
            variant="outline"
            onClick={handleBulkExport}
            disabled={selectedApplicationIds.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Selected
          </Button>
        </div>
      </div> */}

      <MetricsGrid applications={filteredAndSortedApplications}/>

      <EnrolmentFilters 
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EnrolmentList
            applications={filteredAndSortedApplications}
            onApplicationSelect={(application) => setSelectedApplication(application)}
            selectedIds={selectedApplicationIds}
            onSelectedIdsChange={setSelectedApplicationIds}
            onApplicationUpdate={handleApplicationUpdate} 
          />
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card className="h-[calc(100vh-7rem)] overflow-hidden">
              {selectedApplication ? (
                <EnrolmentDetails
                  application={selectedApplication}
                  onClose={() => setSelectedApplication(null)}
                  onApplicationUpdate={handleApplicationUpdate}
                />
              ) : (
                <div className="h-full flex items-center justify-center p-6 text-muted-foreground">
                  <p className="text-center">
                    Select a payment to view details
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