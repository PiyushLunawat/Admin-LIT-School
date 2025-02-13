"use client";

import { MetricsGrid } from "./metrics-grid";
import { RecentActivity } from "./recent-activity";
import { UpcomingDeadlines } from "./upcoming-deadlines";
import { QuickActions } from "./quick-actions";

export function ApplicationsHome() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Welcome back, Sarah!</h2>
        <p className="text-muted-foreground">Here&apos;s an overview of your review queue</p>
      </div>

      <MetricsGrid />

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