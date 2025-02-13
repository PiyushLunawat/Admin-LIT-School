"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LitmusHome } from "./home/litmus-home";
import { LitmusQueue } from "./queue/litmus-queue";
import { LitmusPresentations } from "./presentations/litmus-presentations";
import { LitmusCommunications } from "./communications/litmus-communications";
import { LitmusReports } from "./reports/litmus-reports";
import { LitmusSettings } from "./settings/litmus-settings";



export function LitmusEvaluatorDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabQueryParam = searchParams.get("tab") || "home";
  const [tab, setTab] = useState(tabQueryParam);

  useEffect(() => {
    setTab(tabQueryParam);
  }, [tabQueryParam]);

  const handleTabChange = (newValue: string) => {
    setTab(newValue);
    router.replace(`/dashboard/litmus-evaluator?tab=${newValue}`);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">LITMUS Test Evaluator</h1>

      <Tabs value={tab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="w-full
        ">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="litmus-test">LITMUS Test</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          {/* <TabsTrigger value="presentations">Presentations</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger> */}
        </TabsList>

        <TabsContent value="home">
          <LitmusHome />
        </TabsContent>

        <TabsContent value="litmus-test">
          <LitmusQueue />
        </TabsContent>
        
        <TabsContent value="reports">
          <LitmusReports />
        </TabsContent>

        {/* <TabsContent value="presentations">
          <LitmusPresentations />
        </TabsContent>

        <TabsContent value="communications">
          <LitmusCommunications />
        </TabsContent>

        <TabsContent value="settings">
          <LitmusSettings />
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
