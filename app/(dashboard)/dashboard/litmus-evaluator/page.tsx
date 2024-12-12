import { LitmusHome } from "@/components/litmus-evaluator/litmus-home";
import { LitmusSubmissions } from "@/components/litmus-evaluator/litmus-submissions";
import { LitmusPresentations } from "@/components/litmus-evaluator/litmus-presentations";
import { LitmusCommunications } from "@/components/litmus-evaluator/litmus-communications";
import { LitmusSettings } from "@/components/litmus-evaluator/litmus-settings";
import { LitmusReports } from "@/components/litmus-evaluator/litmus-reports";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LitmusEvaluatorPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">LITMUS Test Evaluator</h1>

      <Tabs defaultValue="home" className="space-y-6">
        <TabsList>
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="presentations">Presentations</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="home">
          <LitmusHome />
        </TabsContent>

        <TabsContent value="submissions">
          <LitmusSubmissions />
        </TabsContent>

        <TabsContent value="presentations">
          <LitmusPresentations />
        </TabsContent>

        <TabsContent value="communications">
          <LitmusCommunications />
        </TabsContent>

        <TabsContent value="reports">
          <LitmusReports />
        </TabsContent>

        <TabsContent value="settings">
          <LitmusSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}