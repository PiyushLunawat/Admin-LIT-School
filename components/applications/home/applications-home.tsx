"use client";

import { useEffect, useState } from "react";

import { getStudents } from "@/app/api/student";
import { ApplicationsHomeProps } from "@/types/components/applications/home/application-home";
import { MetricsGrid } from "./metrics-grid";
import { RecentActivity } from "./recent-activity";
import { UpcomingDeadlines } from "./upcoming-deadlines";

export function ApplicationsHome({
  initialApplications,
  setInitialApplications,
}: ApplicationsHomeProps) {
  const [applications, setApplications] = useState<any>(initialApplications);

  useEffect(() => {
    async function fetchAndFilterStudents() {
      try {
        // 1) Fetch All Students
        const response = await getStudents();

        // 2) Filter Out Students with No Application Details
        const validStudents = response.data.filter((student: any) =>
          ["applied", "reviewing", "enrolled", "dropped"].includes(
            student?.appliedCohorts?.[student?.appliedCohorts.length - 1]
              ?.status
          )
        );
        setApplications(validStudents);
        setInitialApplications(validStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    }
    fetchAndFilterStudents();
  }, [setInitialApplications]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Welcome back, Sarah!</h2>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your review queue
        </p>
      </div>

      <MetricsGrid applications={applications} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <RecentActivity />
          {/* <QuickActions /> */}
        </div>

        <div>
          <UpcomingDeadlines />
        </div>
      </div>
    </div>
  );
}
