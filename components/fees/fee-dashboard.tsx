"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeesHome } from "./fees-home";
import { PaymentManagement } from "./payment-management/payment-management";
import { StudentAccounts } from "./student-accounts/student-accounts";
import { FeesReports } from "./reports/fees-reports";
import { FeesCommunication } from "./communication/fees-communication";
import { FeesSettings } from "./settings/fees-settings";


export function FeeDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabQueryParam = searchParams.get("tab") || "home";
  const [tab, setTab] = useState(tabQueryParam);

  useEffect(() => {
    setTab(tabQueryParam);
  }, [tabQueryParam]);

  const handleTabChange = (newValue: string) => {
    setTab(newValue);
    router.replace(`/dashboard/fees?tab=${newValue}`);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Fees Dashboard</h1>

      <Tabs defaultValue="home" className="space-y-6">
        <TabsList className="w-full">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="enrolment">Enrolment</TabsTrigger>
          <TabsTrigger value="fee-collection">Fee Collection</TabsTrigger>
          {/* <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger> */}
        </TabsList>

        <TabsContent value="home">
          <FeesHome />
        </TabsContent>

        <TabsContent value="enrolment">
          <PaymentManagement />
        </TabsContent>

        <TabsContent value="fee-collection">
          <StudentAccounts />
        </TabsContent>

        {/* <TabsContent value="reports">
          <FeesReports />
        </TabsContent>

        <TabsContent value="communication">
          <FeesCommunication />
        </TabsContent>

        <TabsContent value="settings">
          <FeesSettings />
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
