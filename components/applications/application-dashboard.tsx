"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { getStudents } from "@/app/api/student";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ApplicationsHome = dynamic(
  () => import("./home/applications-home").then((mod) => mod.ApplicationsHome),
  {
    ssr: false,
  }
);

const ApplicationsQueue = dynamic(
  () =>
    import("./queue/applications-queue").then((mod) => mod.ApplicationsQueue),
  {
    ssr: false,
  }
);

const InterviewsQueue = dynamic(
  () => import("./queue/interviews-queue").then((mod) => mod.InterviewsQueue),
  {
    ssr: false,
  }
);

export function ApplicationDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabQueryParam = searchParams.get("tab") || "home";
  const [tab, setTab] = useState(tabQueryParam);
  const [initialApplications, setInitialApplications] = useState<any>([]);

  useEffect(() => {
    async function fetchAndFilterStudents() {
      try {
        // 1) Fetch All Students
        const response = await getStudents();

        // 2) Filter Out Students with No Application Details
        const validStudents = response.data.filter((student: any) =>
          ["applied", "reviewing", "enrolled", "dropped"].includes(
            student?.appliedCohorts?.[student?.appliedCohorts.length - 1]
              ?.status
          )
        );

        validStudents.sort((a: any, b: any) => {
          const dateA = new Date(a?.updatedAt);
          const dateB = new Date(b?.updatedAt);

          if (dateA > dateB) return -1;
          if (dateA < dateB) return 1;

          const monthA = dateA.getMonth();
          const monthB = dateB.getMonth();

          if (monthA > monthB) return -1;
          if (monthA < monthB) return 1;

          const yearA = dateA.getFullYear();
          const yearB = dateB.getFullYear();

          if (yearA > yearB) return -1;
          if (yearA < yearB) return 1;

          return 0;
        });

        setInitialApplications(validStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    }

    fetchAndFilterStudents();
  }, []);

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
          <ApplicationsHome
            initialApplications={initialApplications}
            setInitialApplications={setInitialApplications}
          />
        </TabsContent>

        <TabsContent value="applications">
          <ApplicationsQueue
            initialApplications={initialApplications}
            setInitialApplications={setInitialApplications}
          />
        </TabsContent>

        <TabsContent value="interviews">
          <InterviewsQueue />
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
