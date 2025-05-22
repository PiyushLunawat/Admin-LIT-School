"use client";

import dynamic from "next/dynamic";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MessageInbox = dynamic(
  () => import("./message-inbox").then((mod) => mod.MessageInbox),
  {
    ssr: false,
  }
);

const ComposeMessage = dynamic(
  () => import("./compose-message").then((mod) => mod.ComposeMessage),
  {
    ssr: false,
  }
);

const TemplatesManager = dynamic(
  () => import("./templates-manager").then((mod) => mod.TemplatesManager),
  {
    ssr: false,
  }
);

const NotificationSettings = dynamic(
  () =>
    import("./notification-settings").then((mod) => mod.NotificationSettings),
  {
    ssr: false,
  }
);

export function CommunicationsTab() {
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
          <MessageInbox />
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
