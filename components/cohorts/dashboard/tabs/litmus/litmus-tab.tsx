"use client";

import { Download, RefreshCw } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";

import { getStudents } from "@/app/api/student";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { handleBulkExport } from "@/lib/utils/helpers";
import { LitmusTabProps } from "@/types/components/cohorts/dashboard/tabs/litmus/litmus-tab";

const LitmusTestDetails = dynamic(
  () => import("./litmus-test-details").then((m) => m.LitmusTestDetails),
  { ssr: false }
);

const LitmusTestFilters = dynamic(
  () => import("./litmus-test-filters").then((m) => m.LitmusTestFilters),
  { ssr: false }
);

const LitmusTestList = dynamic(
  () => import("./litmus-test-list").then((m) => m.LitmusTestList),
  { ssr: false }
);

export function LitmusTab({ cohortId, selectedDateRange }: LitmusTabProps) {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<any>([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<any>(null);
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);

  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>(""); // added for search
  const [selectedStatus, setSelectedStatus] = useState<string>("all-status");
  const [sortBy, setSortBy] = useState<string>("newest");

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function fetchStudents() {
      setLoading(true);
      try {
        const response = await getStudents();
        const mappedStudents = response.data.filter(
          (student: any) =>
            ["enrolled", "dropped"].includes(
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
  }, [cohortId, refreshKey]);

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
            ]?.litmusTestDetails?.status?.toLowerCase() || "pending";
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
            ]?.litmusTestDetails?.updatedAt
          ).getTime();
          const dateB = new Date(
            b?.appliedCohorts[
              b.appliedCohorts.length - 1
            ]?.litmusTestDetails?.updatedAt
          ).getTime();
          return dateB - dateA; // newest first
        });
        break;

      case "oldest":
        filtered.sort((a: any, b: any) => {
          const dateA = new Date(
            a?.appliedCohorts[
              a.appliedCohorts.length - 1
            ]?.litmusTestDetails?.updatedAt
          ).getTime();
          const dateB = new Date(
            b?.appliedCohorts[
              b.appliedCohorts.length - 1
            ]?.litmusTestDetails?.updatedAt
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

  const escapeCSV = (field: string): string => {
    if (!field) return "";
    return `"${field.replace(/"/g, '""')}"`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">LITMUS Test Submissions</h2>
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

      <LitmusTestFilters
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
            <LitmusTestList
              applications={filteredAndSortedApplications}
              onSubmissionSelect={(id) => {
                setSelectedSubmissionId(id);
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
              {selectedSubmissionId ? (
                <LitmusTestDetails
                  application={selectedSubmissionId}
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
