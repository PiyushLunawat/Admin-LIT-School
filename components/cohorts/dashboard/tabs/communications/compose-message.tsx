"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ComposeMessageProps {
  cohortId: string;
}

export function ComposeMessage({ cohortId }: ComposeMessageProps) {
  const [date, setDate] = useState<Date>();
  const [communicationType, setCommunicationType] = useState<string>("email");
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  return (
    <div className="grid  gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-3 gap-4">
<div className="space-y-2">
  <Label>Recipients</Label>
  <Select>
    <SelectTrigger>
      <SelectValue placeholder="Select recipients" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Students</SelectItem>
      <SelectItem value="applicants">All Applicants</SelectItem>
      <SelectItem value="payment-pending">Payment Pending</SelectItem>
      <SelectItem value="token-fee-pending">Admission Fee Pending</SelectItem>
      <SelectItem value="interview-scheduled">Interview Scheduled</SelectItem>
      <SelectItem value="presentation-scheduled">Presentation Scheduled</SelectItem>
    </SelectContent>
  </Select>
</div>
            <div className="space-y-2">
              <Label>Communication Type</Label>
              <Select onValueChange={(value) => setCommunicationType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="whatsapp">Whatsapp</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Template</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="misc">+ New Misc.</SelectItem>
                  <SelectItem value="application-status">Application Status Update</SelectItem>
                  <SelectItem value="payment-pending">Payment Pending</SelectItem>
                  <SelectItem value="interview-reminder">Interview Reminder</SelectItem>
                  <SelectItem value="token-fee-pending">Admission Fee Pending</SelectItem>
                  <SelectItem value="announcement">General Announcement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Subject</Label>
            <Input placeholder="Enter message subject" value={subject} onChange={(e) => setSubject(e.target.value)}/>
          </div>

          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              placeholder="Type your message here..."
              className="min-h-[200px]"
              value={message} onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="space-x-2">
            <Label>Schedule Send</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Schedule for later"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button className="w-full">
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </Button>
        </div>

        <div className="lg:col-span-1">
        <div className="sticky top-6">
        <Card className="h-[calc(100vh-10rem)] overflow-hidden">
          <CardHeader>
            <CardTitle>Message Preview</CardTitle>
            <CardDescription>
              Preview how your message will appear to recipients
            </CardDescription>
          </CardHeader>
          {communicationType === "email" ? (
          <CardContent className="email">
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Subject:</p>
                <p className="font-medium">{subject || "Your message subject here"}</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Message:</p>
                <p>{message || "Your message content will appear here..."}</p>
              </div>
            </div>
          </CardContent>) : (
            <CardContent className="whatsapp">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Message:</p>
              <div className="flex items-center gap-1">
                <span className="text-sm ">Subject:</span>
                <p className="font-medium">{subject || "Your message subject here"}</p>
              </div>
              <p className="mt-3">{message || "Your message content will appear here..."}</p>
            </div>
          </CardContent>
          )}
        </Card>
        </div>
        {/*  <Card>
          <CardHeader>
            <CardTitle>Variables</CardTitle>
            <CardDescription>
              Available variables for personalization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <code className="bg-muted px-1 rounded">{"{{name}}"}</code> - Recipient's name
              </p>
              <p className="text-sm">
                <code className="bg-muted px-1 rounded">{"{{date}}"}</code> - Current date
              </p>
              <p className="text-sm">
                <code className="bg-muted px-1 rounded">{"{{amount}}"}</code> - Payment amount
              </p>
              <p className="text-sm">
                <code className="bg-muted px-1 rounded">{"{{due_date}}"}</code> - Due date
              </p>
            </div>
          </CardContent>
        </Card> */}
      </div>
      </div>

      
    </div>
  );
}