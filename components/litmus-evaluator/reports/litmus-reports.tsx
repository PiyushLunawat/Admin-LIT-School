"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { PerformanceMetrics } from "./performance-metrics";
import { EvaluationInsights } from "./evaluation-insights";
import { ReportFilters } from "./report-filters";
import { DateRange } from "react-day-picker";
import { getStudents } from "@/app/api/student";
import { getCohorts } from "@/app/api/cohorts";

interface LitmusReportsProps {
  initialApplications: any;
  setInitialApplications: (apps: any) => void;
}

export function LitmusReports({ initialApplications, setInitialApplications }: LitmusReportsProps) {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [currentCohort, setCurrentCohort] = useState<any>();
  const [applications, setApplications] = useState<any>(initialApplications);

  const [selectedCohort, setSelectedCohort] = useState<string>("all-cohorts");

  useEffect(() => {
    setLoading(true);
    async function fetchStudents() {
      try {
        const response = await getStudents();
        const mappedStudents =
          response.data.filter(
            (student: any) =>
              ['reviewing', 'enrolled'].includes(student?.appliedCohorts?.[student?.appliedCohorts.length - 1]?.status)
          )     
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

    // Filter by date range
    const filteredByDate = filteredByCohort.filter((app: any) => {
      if (!dateRange) return true;
      const appDate = new Date(app.updatedAt);
      const { from, to } = dateRange;
      return (!from || appDate >= from) && (!to || appDate <= to);
    });

    return filteredByDate;
  }, [applications, dateRange, selectedCohort]);

  const handleExport = (format: "pdf" | "excel") => {
    console.log(`Exporting report in ${format} format`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Reports & Analytics</h2>
          <p className="text-muted-foreground">
            View insights and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("pdf")}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport("excel")}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button
            variant="outline"
            size={'icon'}
            // onClick={handleApplicationUpdate}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <ReportFilters setDateRange={setDateRange}
        cohorts={cohorts}
        selectedCohort={selectedCohort}
        onCohortChange={setSelectedCohort}
        />

      <div className="grid gap-6">
        <PerformanceMetrics applications={filteredAndSortedApplications}/>
        <EvaluationInsights applications={filteredAndSortedApplications} />
      </div>
    </div>
  );
}
