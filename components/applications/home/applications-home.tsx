"use client";

import { MetricsGrid } from "./metrics-grid";
import { RecentActivity } from "./recent-activity";
import { UpcomingDeadlines } from "./upcoming-deadlines";
import { QuickActions } from "./quick-actions";

export function ApplicationsHome() {
  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div>
        <h2 className="text-2xl font-bold">Welcome back, Sarah!</h2>
        <p className="text-muted-foreground">Here&apos;s an overview of your review queue</p>
      </div>

      {/* Key Metrics */}
      <MetricsGrid />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <RecentActivity />
          <QuickActions />
        </div>

        {/* Right Column */}
        <div>
          <UpcomingDeadlines />
        </div>
      </div>
    </div>
  );
}