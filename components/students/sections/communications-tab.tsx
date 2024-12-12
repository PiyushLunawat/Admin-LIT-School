"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, MessageSquare, Send } from "lucide-react";

interface CommunicationsTabProps {
  studentId: string;
}

export function CommunicationsTab({ studentId }: CommunicationsTabProps) {
  // In a real application, this data would be fetched based on the studentId
  const communications = {
    history: [
      {
        id: "1",
        type: "Email",
        subject: "Application Status Update",
        message: "Your application has been reviewed...",
        date: "2024-03-20",
        status: "Delivered",
      },
      {
        id: "2",
        type: "WhatsApp",
        message: "Interview scheduled for tomorrow at 10:30 AM",
        date: "2024-03-19",
        status: "Read",
      },
      {
        id: "3",
        type: "SMS",
        message: "Payment reminder for upcoming instalment",
        date: "2024-03-18",
        status: "Sent",
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* New Message */}
      <Card>
        <CardHeader>
          <CardTitle>Send Message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Message Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="status-update">Status Update</SelectItem>
                  <SelectItem value="payment-reminder">Payment Reminder</SelectItem>
                  <SelectItem value="interview">Interview Information</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Input placeholder="Subject (for email)" />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Type your message here..."
              className="min-h-[100px]"
            />
          </div>
          <Button className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </CardContent>
      </Card>

      {/* Communication History */}
      <Card>
        <CardHeader>
          <CardTitle>Communication History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {communications.history.map((comm) => (
              <div
                key={comm.id}
                className="border rounded-lg p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {comm.type === "Email" && (
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    )}
                    {comm.type === "WhatsApp" && (
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    )}
                    {comm.type === "SMS" && (
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    )}
                    <Badge variant="secondary">{comm.type}</Badge>
                  </div>
                  <Badge
                    variant={
                      comm.status === "Read"
                        ? "success"
                        : comm.status === "Delivered"
                        ? "secondary"
                        : "default"
                    }
                  >
                    {comm.status}
                  </Badge>
                </div>
                {comm.subject && (
                  <p className="font-medium">{comm.subject}</p>
                )}
                <p className="text-sm">{comm.message}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(comm.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            <Button variant="outline">
              <img src="/assets/images/whatsapp-icon.svg" className="h-4 w-4 mr-2" />
              Send WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}