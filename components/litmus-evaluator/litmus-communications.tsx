"use client";

import { useState } from "react";
import { MessageInbox } from "./communications/message-inbox";
import { ComposeMessage } from "./communications/compose-message";
import { TemplatesManager } from "./communications/templates-manager";
import { NotificationSettings } from "./communications/notification-settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function LitmusCommunications() {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Communications</h2>
          <p className="text-muted-foreground">
            Manage all your applicant communications
          </p>
        </div>
      </div>

      <Tabs defaultValue="inbox" className="space-y-6">
        <TabsList>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox">
          <MessageInbox
            selectedMessageId={selectedMessageId}
            onMessageSelect={setSelectedMessageId}
          />
        </TabsContent>

        <TabsContent value="compose">
          <ComposeMessage />
        </TabsContent>

        <TabsContent value="templates">
          <TemplatesManager />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}