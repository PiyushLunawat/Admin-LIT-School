"use client";

import { Send } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageThreadProps } from "@/types/components/applications/communications/message-thread";

export function MessageThread({}: MessageThreadProps) {
  const messages = [
    {
      id: "1",
      sender: "reviewer",
      content:
        "Hello! I've reviewed your application and need some additional information.",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      sender: "applicant",
      content:
        "Sure, I'd be happy to provide more details. What information do you need?",
      timestamp: "10:35 AM",
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold">John Doe</h3>
        <p className="text-sm text-muted-foreground">APP001</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === "reviewer" ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {message.sender === "reviewer" ? "RV" : "JD"}
                </AvatarFallback>
              </Avatar>
              <div
                className={`flex flex-col ${
                  message.sender === "reviewer" ? "items-end" : ""
                }`}
              >
                <div
                  className={`rounded-lg p-3 max-w-[80%] ${
                    message.sender === "reviewer"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input placeholder="Type your message..." />
          <Button size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
