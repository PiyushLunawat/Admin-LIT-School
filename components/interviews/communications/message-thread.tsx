"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { Paperclip } from "lucide-react";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: "interviewer" | "applicant";
  attachments?: Array<{
    name: string;
    size: string;
    type: string;
  }>;
  isUnread?: boolean;
}

interface MessageThreadProps {
  messages: Message[];
  applicantName: string;
  applicantPhoto?: string;
}

export function MessageThread({ messages, applicantName, applicantPhoto }: MessageThreadProps) {
  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 ${
              message.sender === "interviewer" ? "flex-row-reverse" : ""
            }`}
          >
            <Avatar className="h-8 w-8">
              {message.sender === "interviewer" ? (
                <AvatarFallback>IN</AvatarFallback>
              ) : (
                <>
                  <AvatarImage src={applicantPhoto} alt={applicantName} />
                  <AvatarFallback>
                    {applicantName.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </>
              )}
            </Avatar>
            <div
              className={`flex-1 space-y-2 ${
                message.sender === "interviewer"
                  ? "items-end"
                  : "items-start"
              }`}
            >
              <div
                className={`rounded-lg p-4 max-w-[80%] ${
                  message.sender === "interviewer"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {message.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-xs"
                      >
                        <Paperclip className="h-3 w-3" />
                        <span>{attachment.name}</span>
                        <span className="text-muted-foreground">
                          ({attachment.size})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div
                className={`flex items-center gap-2 text-xs text-muted-foreground ${
                  message.sender === "interviewer" ? "justify-end" : ""
                }`}
              >
                <span>{formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}</span>
                {message.isUnread && <Badge variant="secondary">Unread</Badge>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}