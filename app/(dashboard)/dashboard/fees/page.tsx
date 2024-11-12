import { FeesHome } from "@/components/fees/fees-home";
import { PaymentManagement } from "@/components/fees/payment-management/payment-management";
import { StudentAccounts } from "@/components/fees/student-accounts/student-accounts";
import { FeesReports } from "@/components/fees/reports/fees-reports";
import { FeesCommunication } from "@/components/fees/communication/fees-communication";
import { FeesSettings } from "@/components/fees/settings/fees-settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FeesDashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Fees Dashboard</h1>

      <Tabs defaultValue="home" className="space-y-6">
        <TabsList>
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="payments">Payment Management</TabsTrigger>
          <TabsTrigger value="accounts">Student Accounts</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="home">
          <FeesHome />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentManagement />
        </TabsContent>

        <TabsContent value="accounts">
          <StudentAccounts />
        </TabsContent>

        <TabsContent value="reports">
          <FeesReports />
        </TabsContent>

        <TabsContent value="communication">
          <FeesCommunication />
        </TabsContent>

        <TabsContent value="settings">
          <FeesSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}