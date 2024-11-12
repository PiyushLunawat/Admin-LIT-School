"use client";

import { MetricsGrid } from "./metrics-grid";
import { ApplicationFunnel } from "./application-funnel";
import { StatusDistribution } from "./status-distribution";
import { ApplicationTimeline } from "./application-timeline";
import { RecentActivity } from "./recent-activity";
import { AlertsSection } from "./alerts-section";

interface OverviewTabProps {
  cohortId: string;
}

export function OverviewTab({ cohortId }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <MetricsGrid cohortId={cohortId} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ApplicationFunnel cohortId={cohortId} />
        <StatusDistribution cohortId={cohortId} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ApplicationTimeline cohortId={cohortId} />
        <RecentActivity cohortId={cohortId} />
      </div>
      
      {/* <AlertsSection cohortId={cohortId} /> */}
    </div>
  );
}