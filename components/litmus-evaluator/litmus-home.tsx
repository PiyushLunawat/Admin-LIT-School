"use client";

import { MetricsGrid } from "@/components/litmus-evaluator/home/metrics-grid";
import { RecentActivity } from "@/components/litmus-evaluator/home/recent-activity";
import { UpcomingPresentations } from "@/components/litmus-evaluator/home/upcoming-presentations";
import { AlertsSection } from "@/components/litmus-evaluator/home/alerts-section";
import { QuickActions } from "@/components/litmus-evaluator/home/quick-actions";

export function LitmusHome() {
  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div>
        <h2 className="text-2xl font-bold">Welcome back, Sarah!</h2>
        <p className="text-muted-foreground">Here's your evaluation overview for today</p>
      </div>

      {/* Key Metrics */}
      <MetricsGrid />

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