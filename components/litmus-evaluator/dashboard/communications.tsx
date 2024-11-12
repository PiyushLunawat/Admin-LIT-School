"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, Send } from "lucide-react";

export function Communications() {
  const messages = [
    {
      id: "1",
      from: "John Doe",
      subject: "LITMUS Test Query",
      preview: "I have a question about...",
      time: "10:30 AM",
      unread: true,
    },
    {
      id: "2",
      from: "Jane Smith",
      subject: "Presentation Confirmation",
      preview: "Thank you for scheduling...",
      time: "Yesterday",
      unread: false,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Communications</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Compose Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Recipient" />
              <Input placeholder="Subject" />
              <Textarea
                placeholder="Type your message here..."
                className="min-h-[200px]"
              />
              <Button className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{message.from}</p>
                    {message.unread && (
                      <Badge variant="secondary">New</Badge>
                    )}
                  </div>
                  <p className="text-sm font-medium">{message.subject}</p>
                  <p className="text-sm text-muted-foreground">
                    {message.preview}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {message.time}
                  </p>
                </div>
                <Button variant="ghost" size="icon">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}