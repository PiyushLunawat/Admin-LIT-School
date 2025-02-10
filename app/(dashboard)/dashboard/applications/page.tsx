"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicationsHome } from "@/components/applications/home/applications-home";
import { ApplicationsQueue } from "@/components/applications/queue/applications-queue";
import { CommunicationsTab } from "@/components/applications/communications/communications-tab";
import { SettingsTab } from "@/components/applications/settings/settings-tab";

export default function ApplicationsDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Application Reviewer Dashboard</h1>

      <Tabs defaultValue="home" className="space-y-6">
        <TabsList className="w-full">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          {/* <TabsTrigger value="communications">Communications</TabsTrigger> */}
          {/* <TabsTrigger value="settings">Settings</TabsTrigger> */}
        </TabsList>

        <TabsContent value="home">
          <ApplicationsHome />
        </TabsContent>

        <TabsContent value="applications">
          <ApplicationsQueue />
        </TabsContent>

        {/* <TabsContent value="communications">
          <CommunicationsTab />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent> */}
      </Tabs>
    </div>
  );
}