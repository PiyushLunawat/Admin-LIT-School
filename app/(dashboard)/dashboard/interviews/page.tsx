"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InterviewsHome } from "@/components/interviews/home/interviews-home";
import { ScheduledInterviews } from "@/components/interviews/scheduled/scheduled-interviews";
import { CommunicationsTab } from "@/components/interviews/communications/communications-tab";
import { SettingsTab } from "@/components/interviews/settings/settings-tab";

export default function InterviewsDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Interviews Dashboard</h1>

      <Tabs defaultValue="home" className="space-y-6">
        <TabsList className="w-full">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Interviews</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="home">
          <InterviewsHome />
        </TabsContent>

        <TabsContent value="scheduled">
          <ScheduledInterviews />
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