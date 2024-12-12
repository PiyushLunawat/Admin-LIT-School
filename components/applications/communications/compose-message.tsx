"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Paperclip } from "lucide-react";

export function ComposeMessage() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label>Recipient</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select applicant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="app001">John Doe (APP001)</SelectItem>
                  <SelectItem value="app002">Jane Smith (APP002)</SelectItem>
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
                  <SelectItem value="request-info">Request Information</SelectItem>
                  <SelectItem value="interview">Interview Invitation</SelectItem>
                  <SelectItem value="feedback">Application Feedback</SelectItem>
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

            <div className="flex justify-between items-center">
              <Button variant="outline">
                <Paperclip className="h-4 w-4 mr-2" />
                Attach Files
              </Button>
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-1">
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-medium">Available Variables</h3>
          <div className="space-y-2">
            <p className="text-sm">
              <code className="bg-muted px-1 rounded">{"{{name}}"}</code> - Applicant&apos;s name
            </p>
            <p className="text-sm">
              <code className="bg-muted px-1 rounded">{"{{id}}"}</code> - Application ID
            </p>
            <p className="text-sm">
              <code className="bg-muted px-1 rounded">{"{{status}}"}</code> - Application status
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}