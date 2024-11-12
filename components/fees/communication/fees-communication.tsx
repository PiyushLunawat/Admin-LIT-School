"use client";

import { useState } from "react";
import { CommunicationLog } from "./communication-log";
import { ComposeMessage } from "./compose-message";
import { TemplatesManager } from "./templates-manager";
import { MessageInbox } from "./message-inbox";
import { NotificationSettings } from "./notification-settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function FeesCommunication() {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  const handleExport = () => {
    console.log("Exporting communications log");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Communications</h2>
          <p className="text-muted-foreground">
            Manage all fee-related communications
          </p>
        </div>
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
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="log">
          <CommunicationLog />
        </TabsContent>

        <TabsContent value="compose">
          <ComposeMessage />
        </TabsContent>

        <TabsContent value="templates">
          <TemplatesManager />
        </TabsContent>

        <TabsContent value="inbox">
          <MessageInbox
            selectedMessageId={selectedMessageId}
            onMessageSelect={setSelectedMessageId}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}