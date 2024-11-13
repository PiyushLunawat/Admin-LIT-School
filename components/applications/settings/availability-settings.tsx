"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";

export function AvailabilitySettings() {
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);

  const workingHours = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Working Hours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Select defaultValue="09:00">
                <SelectTrigger>
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {workingHours.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Select defaultValue="17:00">
                <SelectTrigger>
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {workingHours.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Working Days</Label>
            <div className="grid grid-cols-2 gap-4">
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ].map((day) => (
                <div
                  key={day}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <Label>{day}</Label>
                  <Switch defaultChecked={day !== "Saturday"} />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Out of Office</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Calendar
            mode="multiple"
            selected={selectedDays}
            onSelect={(days) => setSelectedDays(days ?? [])} // Handle undefined case here
            className="rounded-md border"
          />

          <div className="space-y-2">
            <Label>Selected Days Off</Label>
            <div className="text-sm text-muted-foreground">
              {selectedDays.length > 0
                ? selectedDays
                    .map((date) => date.toLocaleDateString())
                    .join(", ")
                : "No days selected"}
            </div>
          </div>

          <Button className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Availability
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
