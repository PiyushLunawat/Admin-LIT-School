"use client";

import dynamic from "next/dynamic";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const InterviewsHome = dynamic(
  () =>
    import("@/components/interviews/home/interviews-home").then(
      (m) => m.InterviewsHome
    ),
  { ssr: false }
);

const ScheduledInterviews = dynamic(
  () =>
    import("@/components/interviews/scheduled/scheduled-interviews").then(
      (m) => m.ScheduledInterviews
    ),
  { ssr: false }
);

const CommunicationsTab = dynamic(
  () =>
    import("@/components/interviews/communications/communications-tab").then(
      (m) => m.CommunicationsTab
    ),
  { ssr: false }
);

const SettingsTab = dynamic(
  () =>
    import("@/components/interviews/settings/settings-tab").then(
      (m) => m.SettingsTab
    ),
  { ssr: false }
);

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
