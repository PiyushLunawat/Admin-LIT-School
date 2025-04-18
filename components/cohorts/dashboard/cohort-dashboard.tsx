"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CohortHeader } from "@/components/cohorts/dashboard/cohort-header";
import { OverviewTab } from "@/components/cohorts/dashboard/tabs/overview/overview-tab";
import { ApplicationsTab } from "@/components/cohorts/dashboard/tabs/applications/applications-tab";
import { LitmusTab } from "@/components/cohorts/dashboard/tabs/litmus/litmus-tab";
import { PaymentsTab } from "@/components/cohorts/dashboard/tabs/payments/payments-tab";
import { CommunicationsTab } from "@/components/cohorts/dashboard/tabs/communications/communications-tab";

import { DateRange } from "react-day-picker";

interface CohortDashboardProps {
  cohortId: string;
}

export function CohortDashboard({ cohortId }: CohortDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabQueryParam = searchParams.get("tab") || "overview";
  const [tab, setTab] = useState(tabQueryParam);

  useEffect(() => {
    setTab(tabQueryParam);
  }, [tabQueryParam]);

  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const handleTabChange = (newValue: string) => {
    setTab(newValue);
    router.replace(`/dashboard/cohorts/${cohortId}?tab=${newValue}`);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <CohortHeader cohortId={cohortId} setDateRange={setDateRange} />

      <Tabs value={tab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="litmus">LITMUS Test</TabsTrigger>
          {/* <TabsTrigger value="communication">Communication</TabsTrigger> */}
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab cohortId={cohortId} selectedDateRange={dateRange} />
        </TabsContent>
        <TabsContent value="applications">
          <ApplicationsTab cohortId={cohortId} selectedDateRange={dateRange} />
        </TabsContent>
        <TabsContent value="payments">
          <PaymentsTab cohortId={cohortId} selectedDateRange={dateRange} />
        </TabsContent>
        <TabsContent value="litmus">
          <LitmusTab cohortId={cohortId} selectedDateRange={dateRange} />
        </TabsContent>
        {/* <TabsContent value="communication">
          <CommunicationsTab cohortId={cohortId} />
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
