"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Thread {
  id: string;
  applicant: {
    name: string;
    photo?: string;
    program: string;
  };
  lastMessage: {
    content: string;
    timestamp: string;
    isUnread: boolean;
  };
}

interface MessageListProps {
  threads: Thread[];
  selectedThreadId?: string;
  onThreadSelect: (threadId: string) => void;
}

export function MessageList({
  threads,
  selectedThreadId,
  onThreadSelect,
}: MessageListProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search messages..." className="pl-8" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="divide-y">
          {threads.map((thread) => (
            <Button
              key={thread.id}
              variant="ghost"
              className={`w-full justify-start px-4 py-3 h-auto ${
                selectedThreadId === thread.id ? "bg-muted" : ""
              }`}
              onClick={() => onThreadSelect(thread.id)}
            >
              <div className="flex items-start gap-3 w-full">
                <Avatar>
                  <AvatarImage src={thread.applicant.photo} alt={thread.applicant.name} />
                  <AvatarFallback>
                    {thread.applicant.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{thread.applicant.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {thread.applicant.program}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(thread.lastMessage.timestamp), {
                          addSuffix: true,
                        })}
                      </span>
                      {thread.lastMessage.isUnread && (
                        <Badge variant="secondary">Unread</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {thread.lastMessage.content}
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}