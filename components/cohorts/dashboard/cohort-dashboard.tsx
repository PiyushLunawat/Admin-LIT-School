"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CohortHeader } from "@/components/cohorts/dashboard/cohort-header";
import { OverviewTab } from "@/components/cohorts/dashboard/tabs/overview/overview-tab";
import { ApplicationsTab } from "@/components/cohorts/dashboard/tabs/applications/applications-tab";
import { LitmusTab } from "@/components/cohorts/dashboard/tabs/litmus/litmus-tab";
import { PaymentsTab } from "@/components/cohorts/dashboard/tabs/payments/payments-tab";
import { CommunicationsTab } from "@/components/cohorts/dashboard/tabs/communications/communications-tab";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";
import { useState } from "react";

interface CohortDashboardProps {
  cohortId: string;
}

export function CohortDashboard({ cohortId }: CohortDashboardProps) {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  return (
    <div className="p-6 space-y-6">
      {/* <div className="flex gap-2 items-center cursor-pointer" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4"/>
        Back to Cohorts 
      </div> */}
      <CohortHeader cohortId={cohortId} setDateRange={setDateRange}/>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="litmus">LITMUS Test</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          {/* <TabsTrigger value="communication">Communication</TabsTrigger> */}
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab cohortId={cohortId} />
        </TabsContent>
        
        <TabsContent value="applications">
          <ApplicationsTab cohortId={cohortId} selectedDateRange={dateRange} />
        </TabsContent>
        
        <TabsContent value="litmus">
          <LitmusTab cohortId={cohortId} selectedDateRange={dateRange}/>
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