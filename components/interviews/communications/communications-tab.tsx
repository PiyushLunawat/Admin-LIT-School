"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { MessageList } from "./message-list";
import { MessageThread } from "./message-thread";
import { MessageComposer } from "./message-composer";
import { TemplateManager } from "./template-manager";

interface CommunicationsTabProps {
  interviewId?: string;
}

export function CommunicationsTab({ interviewId }: CommunicationsTabProps) {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  // In a real application, this data would be fetched from an API
  const messageThreads = [
    {
      id: "1",
      applicant: {
        name: "John Doe",
        photo: "/placeholder-avatar.jpg",
        program: "Creator Marketer",
      },
      lastMessage: {
        content: "Thank you for the interview opportunity!",
        timestamp: "2024-03-20T10:30:00Z",
        isUnread: true,
      },
    },
    {
      id: "2",
      applicant: {
        name: "Jane Smith",
        program: "Digital Marketing",
      },
      lastMessage: {
        content: "I'll be there on time for the interview.",
        timestamp: "2024-03-19T15:45:00Z",
        isUnread: false,
      },
    },
  ];

  const selectedThread = messageThreads.find((t) => t.id === selectedThreadId);

  const messages = selectedThread
    ? [
        {
          id: "1",
          content: "Hello! Looking forward to our interview tomorrow.",
          timestamp: "2024-03-19T10:00:00Z",
          sender: "interviewer" as const,
        },
        {
          id: "2",
          content: "Thank you for the interview opportunity!",
          timestamp: "2024-03-19T10:30:00Z",
          sender: "applicant" as const,
          isUnread: true,
        },
      ]
    : [];

  const templates = [
    {
      id: "1",
      name: "Interview Confirmation",
      content: "Dear {name},\n\nThis is to confirm your interview scheduled for {date} at {time}.",
      category: "Interview",
    },
    {
      id: "2",
      name: "Reschedule Notice",
      content: "Dear {name},\n\nWe need to reschedule your interview. Please choose a new time slot.",
      category: "Scheduling",
    },
    {
      id: "3",
      name: "Thank You",
      content: "Dear {name},\n\nThank you for attending the interview today.",
      category: "Follow-up",
    },
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="inbox" className="space-y-6">
        <TabsList>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox">
          <div className="grid grid-cols-3 gap-6 h-[800px]">
            <Card className="col-span-1">
              <MessageList
                threads={messageThreads}
                selectedThreadId={selectedThreadId || undefined}
                onThreadSelect={(id) => setSelectedThreadId(id)}
              />
            </Card>

            <Card className="col-span-2">
              {selectedThread ? (
                <div className="h-full flex flex-col">
                  <div className="flex-1">
                    <MessageThread
                      messages={messages}
                      applicantName={selectedThread.applicant.name}
                      applicantPhoto={selectedThread.applicant.photo}
                    />
                  </div>
                  <MessageComposer
                    templates={templates}
                    onSend={(message) => {
                      console.log("Sending message:", message);
                    }}
                  />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Select a conversation to view messages
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <TemplateManager
            templates={templates}
            onTemplateCreate={(template) => {
              console.log("Creating template:", template);
            }}
            onTemplateUpdate={(template) => {
              console.log("Updating template:", template);
            }}
            onTemplateDelete={(id) => {
              console.log("Deleting template:", id);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}