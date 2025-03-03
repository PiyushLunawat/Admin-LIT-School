"use client";

import { MetricsGrid } from "./metrics-grid";
import { ApplicationFunnel } from "./application-funnel";
import { StatusDistribution } from "./status-distribution";
import { ApplicationTimeline } from "./application-timeline";
import { RecentActivity } from "./recent-activity";
import { AlertsSection } from "./alerts-section";
import { useEffect, useState } from "react";
import { getStudents } from "@/app/api/student";
import { DateRange } from "react-day-picker";

interface OverviewTabProps {
  cohortId: string;
  selectedDateRange: DateRange | undefined;
}

export function OverviewTab({ cohortId, selectedDateRange }: OverviewTabProps) {
    const [applications, setApplications] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  
    useEffect(() => {
      async function fetchStudents() {
        try {
          const response = await getStudents();
          const mappedStudents =
            response.data.filter(
              (student: any) =>
                ['applied', 'reviewing', 'enrolled'].includes(student?.appliedCohorts?.[student?.appliedCohorts.length - 1]?.status) &&
                student?.appliedCohorts?.[student?.appliedCohorts.length - 1]?.cohortId?._id == cohortId
            )
            const filteredApplications = mappedStudents.filter((app: any) => {
              if (!selectedDateRange) return true;
              const appDate = new Date(app.updatedAt);
              const { from, to } = selectedDateRange;
              return (!from || appDate >= from) && (!to || appDate <= to);
            });
  
            setApplications(filteredApplications);
        } catch (error) {
          console.error("Error fetching students:", error);
        } finally {
          setLoading(false);
        }
      }
  
      fetchStudents();
    }, [selectedDateRange]);
  
  return (
    <div className="space-y-6">
      <MetricsGrid applications={applications} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ApplicationFunnel applications={applications} />
        <StatusDistribution applications={applications} />
      </div>
      
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ApplicationTimeline applications={applications} />
        <RecentActivity applications={applications} />
      </div> */}
      
      {/* <AlertsSection cohortId={cohortId} /> */}
    </div>
  );
}