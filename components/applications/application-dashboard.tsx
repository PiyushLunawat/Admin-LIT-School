"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ApplicationsHome } from "./home/applications-home";
import { ApplicationsQueue } from "./queue/applications-queue";
import { CommunicationsTab } from "./communications/communications-tab";
import { SettingsTab } from "./settings/settings-tab";
import { InterviewsQueue } from "./queue/interviews-queue";


export function ApplicationDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabQueryParam = searchParams.get("tab") || "home";
  const [tab, setTab] = useState(tabQueryParam);

  useEffect(() => {
    setTab(tabQueryParam);
  }, [tabQueryParam]);

  const handleTabChange = (newValue: string) => {
    setTab(newValue);
    router.replace(`/dashboard/applications?tab=${newValue}`);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Application Reviewer Dashboard</h1>

      <Tabs value={tab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="w-full">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          {/* <TabsTrigger value="communications">Communications</TabsTrigger> */}
          {/* <TabsTrigger value="settings">Settings</TabsTrigger> */}
        </TabsList>

        <TabsContent value="home">
          <ApplicationsHome />
        </TabsContent>

        <TabsContent value="applications">
          <ApplicationsQueue />
        </TabsContent>

        <TabsContent value="interviews">
          <InterviewsQueue />
        </TabsContent>

        <TabsContent value="communications">
          <CommunicationsTab />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
