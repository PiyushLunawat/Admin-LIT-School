"use client";

import { MetricsGrid } from "@/components/litmus-evaluator/home/metrics-grid";
import { RecentActivity } from "@/components/litmus-evaluator/home/recent-activity";
import { UpcomingPresentations } from "@/components/litmus-evaluator/home/upcoming-presentations";
import { AlertsSection } from "@/components/litmus-evaluator/home/alerts-section";
import { QuickActions } from "@/components/litmus-evaluator/home/quick-actions";
import { useEffect, useState } from "react";
import { getStudents } from "@/app/api/student";

export function LitmusHome() {
  const [loadint, setLoading] = useState(false);
  const [applications, setApplications] = useState<any>([]);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await getStudents();
        const mappedStudents = response.data.filter((student: any) => (
          ['reviewing', 'enrolled'].includes(student?.appliedCohorts?.[student?.appliedCohorts.length - 1]?.status)
        ));
          
        setApplications(mappedStudents);
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
      {/* Welcome Message */}
      <div>
        <h2 className="text-2xl font-bold">Welcome back, Sarah!</h2>
        <p className="text-muted-foreground">Here&apos;s your evaluation overview for today</p>
      </div>

      {/* Key Metrics */}
      <MetricsGrid applications={applications}/>

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