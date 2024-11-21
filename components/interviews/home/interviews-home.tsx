"use client";

import { MetricsGrid } from "./metrics-grid";
import { UpcomingInterviews } from "./upcoming-interviews";
import { RecentActivity } from "./recent-activity";
import { AlertsSection } from "./alerts-section";
import { QuickActions } from "./quick-actions";

export function InterviewsHome() {
  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div>
        <h2 className="text-2xl font-bold">Welcome back, Sarah!</h2>
        <p className="text-muted-foreground">Here&apos;s your interview schedule for today</p>
      </div>

      {/* Key Metrics */}
      <MetricsGrid />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <UpcomingInterviews />
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