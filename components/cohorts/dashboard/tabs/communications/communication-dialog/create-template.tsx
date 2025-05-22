"use client";

import { format } from "date-fns";
import { CalendarIcon, SaveIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function CreateTemplate() {
  const [communicationType, setCommunicationType] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("");
  const [templateType, setTemplateType] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [date, setDate] = useState<Date>();

  return (
    <div className="">
      <h3 className="text-lg font-medium mb-4">New Template</h3>

      {/* Date */}
      <div className="flex items-center text-sm mb-4">
        <CalendarIcon className="mr-2 h-4 w-4" />
        {format(new Date(), "dd/MM/yyyy")}
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {/* Recipients */}
          <div className="space-y-2">
            <Label>Recipients</Label>
            <Select onValueChange={(value) => setRecipient(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select recipients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                <SelectItem value="applicants">All Applicants</SelectItem>
                <SelectItem value="payment-pending">Payment Pending</SelectItem>
                <SelectItem value="token-fee-pending">
                  Admission Fee Pending
                </SelectItem>
                <SelectItem value="interview-scheduled">
                  interview scheduled
                </SelectItem>
                <SelectItem value="presentation-scheduled">
                  Presentation Scheduled
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Communication Type */}
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

          {/* Template Type */}
          <div className="space-y-2">
            <Label>Type Variant</Label>
            <Input
              placeholder="Type here"
              value={templateType}
              onChange={(e) => setTemplateType(e.target.value)}
            />
          </div>
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <Label>Subject</Label>
          <Input
            placeholder="Type here"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label>Message</Label>
          <Textarea
            placeholder="Type here"
            className="min-h-[150px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Save Button */}
        <Button
          className="w-full mt-4 flex gap-2 items-center"
          onClick={() => console.log("Save Template")}
        >
          <SaveIcon className="h-4 w-4" />
          Save Template
        </Button>
      </div>
    </div>
  );
}
