"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CohortHeader } from "@/components/cohorts/dashboard/cohort-header";
import { OverviewTab } from "@/components/cohorts/dashboard/tabs/overview/overview-tab";
import { ApplicationsTab } from "@/components/cohorts/dashboard/tabs/applications/applications-tab";
import { LitmusTab } from "@/components/cohorts/dashboard/tabs/litmus/litmus-tab";
import { PaymentsTab } from "@/components/cohorts/dashboard/tabs/payments/payments-tab";
import { CommunicationsTab } from "@/components/cohorts/dashboard/tabs/communications/communications-tab";

interface CohortDashboardProps {
  cohortId: string;
}

export function CohortDashboard({ cohortId }: CohortDashboardProps) {
  return (
    <div className="p-6 space-y-6">
      <CohortHeader cohortId={cohortId} />
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="litmus">LITMUS Test</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab cohortId={cohortId} />
        </TabsContent>
        
        <TabsContent value="applications">
          <ApplicationsTab cohortId={cohortId} />
        </TabsContent>
        
        <TabsContent value="litmus">
          <LitmusTab cohortId={cohortId} />
        </TabsContent>
        
        <TabsContent value="payments">
          <PaymentsTab cohortId={cohortId} />
        </TabsContent>
        
        <TabsContent value="communication">
          <CommunicationsTab cohortId={cohortId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}