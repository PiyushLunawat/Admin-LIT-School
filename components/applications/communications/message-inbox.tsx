"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Mail } from "lucide-react";
import { MessageThread } from "./message-thread";

interface Message {
  id: string;
  applicantName: string;
  applicationId: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

export function MessageInbox() {
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  
  const messages: Message[] = [
    {
      id: "1",
      applicantName: "John Doe",
      applicationId: "APP001",
      lastMessage: "Thank you for your response...",
      timestamp: "10:30 AM",
      unread: true,
    },
    {
      id: "2",
      applicantName: "Jane Smith",
      applicationId: "APP002",
      lastMessage: "I have uploaded the additional documents...",
      timestamp: "Yesterday",
      unread: false,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-6 h-[600px]">
      {/* Message List */}
      <Card className="col-span-1">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-8" />
          </div>
        </div>
        <ScrollArea className="h-[calc(600px-73px)]">
          <div className="divide-y">
            {messages.map((message) => (
              <Button
                key={message.id}
                variant="ghost"
                className="w-full justify-start px-4 py-3 h-auto"
                onClick={() => setSelectedThread(message.id)}
              >
                <div className="flex items-start gap-3 w-full">
                  <Mail className="h-5 w-5 mt-0.5" />
                  <div className="flex-1 text-left space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{message.applicantName}</p>
                        <p className="text-xs text-muted-foreground">
                          {message.applicationId}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-muted-foreground">
                          {message.timestamp}
                        </span>
                        {message.unread && (
                          <Badge variant="secondary">Unread</Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {message.lastMessage}
                    </p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Message Thread */}
      <Card className="col-span-2">
        {selectedThread ? (
          <MessageThread threadId={selectedThread} />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Select a conversation to view messages
          </div>
        )}
      </Card>
    </div>
  );
}