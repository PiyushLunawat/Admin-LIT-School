"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

import { getCohorts } from "@/app/api/cohorts";
import { getPrograms } from "@/app/api/programs";

const DashboardHeader = dynamic(
  () =>
    import("@/components/dashboard/overview/dashboard-header").then(
      (m) => m.DashboardHeader
    ),
  { ssr: false }
);

const MetricsGrid = dynamic(
  () =>
    import("@/components/dashboard/overview/metrics-grid").then(
      (m) => m.MetricsGrid
    ),
  { ssr: false }
);

const ChartsSection = dynamic(
  () =>
    import("@/components/dashboard/overview/charts-section").then(
      (m) => m.ChartsSection
    ),
  { ssr: false }
);

const RecentCohorts = dynamic(
  () =>
    import("@/components/dashboard/overview/recent-cohorts").then(
      (m) => m.RecentCohorts
    ),
  { ssr: false }
);

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("all-programs");
  const [selectedCohort, setSelectedCohort] = useState("all-cohorts");
  const [programs, setPrograms] = useState<any[]>([]);
  const [cohorts, setCohorts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const cohortsData = await getCohorts();
        setCohorts(cohortsData.data);

        const programsData = await getPrograms();
        setPrograms(programsData.data);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    }
    fetchData();
  }, []);
  return (
    <div className="p-6 space-y-6">
      <DashboardHeader
        setDateRange={setDateRange}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        programs={programs}
        selectedProgram={selectedProgram}
        onProgramChange={setSelectedProgram}
        cohorts={cohorts}
        selectedCohort={selectedCohort}
        onCohortChange={setSelectedCohort}
      />

      <MetricsGrid
        selectedDateRange={dateRange}
        searchQuery={searchQuery}
        selectedProgram={selectedProgram}
        selectedCohort={selectedCohort}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartsSection
          selectedDateRange={dateRange}
          searchQuery={searchQuery}
          selectedProgram={selectedProgram}
          selectedCohort={selectedCohort}
        />
        <div className="space-y-6">
          <RecentCohorts />
        </div>
      </div>
    </div>
  );
}
