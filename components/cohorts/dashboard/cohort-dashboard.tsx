"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CohortHeader = dynamic(
  () =>
    import("@/components/cohorts/dashboard/cohort-header").then(
      (m) => m.CohortHeader
    ),
  { ssr: false }
);

const OverviewTab = dynamic(
  () =>
    import("@/components/cohorts/dashboard/tabs/overview/overview-tab").then(
      (m) => m.OverviewTab
    ),
  { ssr: false }
);

const ApplicationsTab = dynamic(
  () =>
    import(
      "@/components/cohorts/dashboard/tabs/applications/applications-tab"
    ).then((m) => m.ApplicationsTab),
  { ssr: false }
);

const LitmusTab = dynamic(
  () =>
    import("@/components/cohorts/dashboard/tabs/litmus/litmus-tab").then(
      (m) => m.LitmusTab
    ),
  { ssr: false }
);

const PaymentsTab = dynamic(
  () =>
    import("@/components/cohorts/dashboard/tabs/payments/payments-tab").then(
      (m) => m.PaymentsTab
    ),
  { ssr: false }
);

export function CohortDashboard({ cohortId }: { cohortId: string }) {
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
