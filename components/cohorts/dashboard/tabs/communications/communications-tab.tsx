"use client";

import { Download } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AutomationSettings } from "./automation-settings";
import { CommunicationLog } from "./communication-log";
import { ComposeMessage } from "./compose-message";
import { InboxTab } from "./inbox-tab";
import { TemplatesTab } from "./templates-tab";

interface CommunicationsTabProps {
  cohortId: string;
}

export function CommunicationsTab({ cohortId }: CommunicationsTabProps) {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );

  const handleExport = () => {
    console.log("Exporting communications log");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Communications</h2>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Log
        </Button>
      </div>

      <Tabs defaultValue="log" className="space-y-6">
        <TabsList>
          <TabsTrigger value="log">Communication Log</TabsTrigger>
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="log">
          <CommunicationLog cohortId={cohortId} />
        </TabsContent>

        <TabsContent value="compose">
          <ComposeMessage cohortId={cohortId} />
        </TabsContent>

        <TabsContent value="templates">
          <TemplatesTab cohortId={cohortId} />
        </TabsContent>

        <TabsContent value="inbox">
          <InboxTab
            cohortId={cohortId}
            // selectedMessageId={selectedMessageId}
            // onMessageSelect={setSelectedMessageId}
          />
        </TabsContent>

        <TabsContent value="automation">
          <AutomationSettings cohortId={cohortId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
