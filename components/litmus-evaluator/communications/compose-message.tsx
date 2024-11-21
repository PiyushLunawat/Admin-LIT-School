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
import { Send, Paperclip } from "lucide-react";

export function ComposeMessage() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Communication Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="notification">In-App Notification</SelectItem>
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
                  <SelectItem value="presentation-confirmation">Presentation Confirmation</SelectItem>
                  <SelectItem value="evaluation-feedback">Evaluation Feedback</SelectItem>
                  <SelectItem value="scholarship-award">Scholarship Award</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Recipients</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select recipients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applicants</SelectItem>
                <SelectItem value="pending-evaluation">Pending Evaluation</SelectItem>
                <SelectItem value="scheduled-presentation">Scheduled Presentation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Subject</Label>
            <Input placeholder="Enter message subject" />
          </div>

          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              placeholder="Type your message here..."
              className="min-h-[200px]"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Paperclip className="h-4 w-4 mr-2" />
              Attach Files
            </Button>
            <Button className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Message Preview</CardTitle>
            <CardDescription>
              Preview how your message will appear to recipients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Subject:</p>
                <p className="font-medium">Your message subject here</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Message:</p>
                <p>Your message content will appear here...</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Variables</CardTitle>
            <CardDescription>
              Available variables for personalization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <code className="bg-muted px-1 rounded">{"{{name}}"}</code> - Applicant&apos;s name
              </p>
              <p className="text-sm">
                <code className="bg-muted px-1 rounded">{"{{date}}"}</code> - Presentation date
              </p>
              <p className="text-sm">
                <code className="bg-muted px-1 rounded">{"{{scholarship}}"}</code> - Scholarship details
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}