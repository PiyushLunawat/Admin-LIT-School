"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils/utils";
import { Search, Send, User } from "lucide-react";

interface MessageInboxProps {
  selectedMessageId: string | null;
  onMessageSelect: (id: string) => void;
}

export function MessageInbox({ selectedMessageId, onMessageSelect }: MessageInboxProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");

  // In a real application, this data would be fetched from an API
  const messages = [
    {
      id: "1",
      applicantName: "John Doe",
      lastMessage: "Thank you for the feedback on my LITMUS test submission.",
      timestamp: "10:30 AM",
      unread: true,
    },
    {
      id: "2",
      applicantName: "Jane Smith",
      lastMessage: "I've uploaded the revised presentation as requested.",
      timestamp: "Yesterday",
      unread: false,
    },
  ];

  const selectedMessage = messages.find((m) => m.id === selectedMessageId);

  const conversation = selectedMessageId
    ? [
        {
          id: "1",
          sender: "evaluator",
          content: "Hello! I've reviewed your LITMUS test submission.",
          timestamp: "10:00 AM",
        },
        {
          id: "2",
          sender: "applicant",
          content: "Thank you for the feedback on my LITMUS test submission.",
          timestamp: "10:30 AM",
        },
      ]
    : [];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6 h-[600px]">
      {/* Message List */}
      <div className="col-span-1 border rounded-lg flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {messages.map((message) => (
            <Button
              key={message.id}
              variant="ghost"
              className={cn(
                "w-full justify-start px-4 py-3 h-auto",
                selectedMessageId === message.id && "bg-muted"
              )}
              onClick={() => onMessageSelect(message.id)}
            >
              <div className="flex items-start gap-3 w-full">
                <User className="h-6 w-6 mt-1" />
                <div className="flex-1 text-left space-y-1">
                  <div className="flex justify-between items-start">
                    <p className="font-medium">{message.applicantName}</p>
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
        </ScrollArea>
      </div>

      {/* Message Thread */}
      <div className="col-span-2 border rounded-lg flex flex-col">
        {selectedMessage ? (
          <>
            <div className="p-4 border-b">
              <h3 className="font-semibold">{selectedMessage.applicantName}</h3>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {conversation.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.sender === "evaluator" ? "flex-row-reverse" : ""
                    )}
                  >
                    <User className="h-6 w-6 mt-1" />
                    <div
                      className={cn(
                        "flex flex-col",
                        message.sender === "evaluator" ? "items-end" : ""
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-lg p-3 max-w-[80%]",
                          message.sender === "evaluator"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
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
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button
                  className="self-end"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Select a conversation to view messages
          </div>
        )}
      </div>
    </div>
  );
}