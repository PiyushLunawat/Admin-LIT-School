"use client";

import { DashboardHeader } from "@/components/dashboard/overview/dashboard-header";
import { MetricsGrid } from "@/components/dashboard/overview/metrics-grid";
import { ChartsSection } from "@/components/dashboard/overview/charts-section";
import { RecentCohorts } from "@/components/dashboard/overview/recent-cohorts";
import { ScholarshipDistribution } from "@/components/dashboard/overview/scholarship-distribution";
import { DateRange } from "react-day-picker";
import { useState } from "react";

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  return (
    <div className="p-6 space-y-6">
      <DashboardHeader setDateRange={setDateRange}/>
      <MetricsGrid selectedDateRange={dateRange}/>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartsSection selectedDateRange={dateRange}/>
        <div className="space-y-6">
          <RecentCohorts />
        </div>
      </div>
    </div>
  );
}