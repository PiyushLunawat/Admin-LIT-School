"use client";

import { MetricsGrid } from "./metrics-grid";
import { ApplicationFunnel } from "./application-funnel";
import { StatusDistribution } from "./status-distribution";
import { ApplicationTimeline } from "./application-timeline";
import { RecentActivity } from "./recent-activity";
import { AlertsSection } from "./alerts-section";
import { useEffect, useState } from "react";
import { getStudents } from "@/app/api/student";

interface OverviewTabProps {
  cohortId: string;
}

export function OverviewTab({ cohortId }: OverviewTabProps) {
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
                student?.applicationDetails !== undefined &&
                student.cohort?._id === cohortId
            )    
  
            setApplications(mappedStudents);
          console.log("fetching students:", response.data);
        } catch (error) {
          console.error("Error fetching students:", error);
        } finally {
          setLoading(false);
        }
      }
  
      fetchStudents();
    }, []);
  
  return (
    <div className="space-y-6">
      <MetricsGrid applications={applications} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ApplicationFunnel applications={applications} />
        <StatusDistribution applications={applications} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ApplicationTimeline applications={applications} />
        <RecentActivity applications={applications} />
      </div>
      
      {/* <AlertsSection cohortId={cohortId} /> */}
    </div>
  );
}