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
import { getStudents } from "@/app/api/student";

export function LitmusEvaluatorDashboard() {
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
          const validStudents = response.data.filter(
            (student: any) => 
              ['reviewing', 'enrolled'].includes(student?.appliedCohorts?.[student?.appliedCohorts.length - 1]?.status)
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
          <LitmusHome initialApplications={initialApplications} setInitialApplications={setInitialApplications}/>
        </TabsContent>

        <TabsContent value="litmus-test">
          <LitmusQueue initialApplications={initialApplications} setInitialApplications={setInitialApplications}/>
        </TabsContent>
        
        <TabsContent value="reports">
          <LitmusReports initialApplications={initialApplications} setInitialApplications={setInitialApplications}/>
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
