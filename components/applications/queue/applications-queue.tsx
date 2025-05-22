"use client";

import { Download, RefreshCw } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";

import { getCohorts } from "@/app/api/cohorts";
import { getStudents } from "@/app/api/student";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ApplicationsQueueProps,
  BadgeVariant,
} from "@/types/components/applications/queue/applications-queue";

const ApplicationDetails = dynamic(
  () => import("./application-details").then((m) => m.ApplicationDetails),
  { ssr: false }
);

const ApplicationFilters = dynamic(
  () => import("./application-filters").then((m) => m.ApplicationFilters),
  { ssr: false }
);

const ApplicationsList = dynamic(
  () => import("./applications-list").then((m) => m.ApplicationsList),
  { ssr: false }
);

const CohortDetails = dynamic(
  () => import("./cohort-details").then((m) => m.CohortDetails),
  { ssr: false }
);

export function ApplicationsQueue({
  initialApplications,
  setInitialApplications,
}: ApplicationsQueueProps) {
  const [applications, setApplications] = useState<any>(initialApplications);
  const [selectedApplication, setSelectedApplication] = useState<string | null>(
    null
  );
  const [selectedApplicationIds, setSelectedApplicationIds] = useState<
    string[]
  >([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [currentCohort, setCurrentCohort] = useState<any>();
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
          ["applied", "reviewing", "enrolled", "dropped"].includes(
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
  }, [refreshKey, setInitialApplications]);

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
          student?.appliedCohorts?.[student?.appliedCohorts.length - 1]
            ?.tokenFeeDetails?.verificationStatus === "paid" &&
          student?.appliedCohorts?.[student?.appliedCohorts.length - 1]
            ?.cohortId?.cohortId === selectedCohort
      ).length
    );

    // Filter by date range
    const filteredByDate = filteredByCohort.filter((app: any) => {
      if (!dateRange) return true;
      const appDate = new Date(app.updatedAt);
      const { from, to } = dateRange;
      return (!from || appDate >= from) && (!to || appDate <= to);
    });

    // a) Search filter by applicant name
    const filteredBySearch = filteredByDate.filter((app: any) => {
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
  }, [
    applications,
    sortBy,
    selectedCohort,
    cohorts,
    dateRange,
    searchQuery,
    selectedStatus,
  ]);

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
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleBulkEmail = () => {
    console.log("Sending bulk email to:", selectedApplicationIds);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Applications Queue</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            //TODO add handle bulk export later
            // onClick={handleBulkExport()}
            disabled={selectedApplicationIds.length === 0}
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
          <ApplicationsList
            applications={filteredAndSortedApplications} // Pass filtered and sorted applications to the list
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
