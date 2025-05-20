"use client";

import { getStudents } from "@/app/api/student";
import { AlertsSection } from "@/components/litmus-evaluator/home/alerts-section";
import { MetricsGrid } from "@/components/litmus-evaluator/home/metrics-grid";
import { QuickActions } from "@/components/litmus-evaluator/home/quick-actions";
import { RecentActivity } from "@/components/litmus-evaluator/home/recent-activity";
import { UpcomingPresentations } from "@/components/litmus-evaluator/home/upcoming-presentations";
import { useEffect, useState } from "react";

interface LitmusHomeProps {
  initialApplications: any;
  setInitialApplications: (apps: any) => void;
}

export function LitmusHome({
  initialApplications,
  setInitialApplications,
}: LitmusHomeProps) {
  const [loadint, setLoading] = useState(false);
  const [applications, setApplications] = useState<any>(initialApplications);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await getStudents();
        const mappedStudents = response.data.filter((student: any) =>
          ["reviewing", "enrolled", "dropped"].includes(
            student?.appliedCohorts?.[student?.appliedCohorts.length - 1]
              ?.status
          )
        );

        setApplications(mappedStudents);
        setInitialApplications(mappedStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, [setInitialApplications]);

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div>
        <h2 className="text-2xl font-bold">Welcome back, Sarah!</h2>
        <p className="text-muted-foreground">
          Here&apos;s your evaluation overview for today
        </p>
      </div>

      {/* Key Metrics */}
      <MetricsGrid applications={applications} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <UpcomingPresentations />
          <QuickActions />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <AlertsSection />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
