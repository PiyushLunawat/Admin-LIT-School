"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, MapPin, PlayCircle } from "lucide-react";

export function InterviewCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // In a real application, this data would be fetched based on the selected date
  const selectedDateInterviews = [
    {
      id: "INT001",
      applicantName: "John Doe",
      time: "10:30 AM",
      mode: "Zoom",
      status: "Scheduled",
    },
    {
      id: "INT002",
      applicantName: "Jane Smith",
      time: "2:15 PM",
      mode: "In-person",
      status: "Scheduled",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Interview Calendar</CardTitle>
            <CardDescription>
              Select a date to view scheduled interviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>
              {date?.toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardTitle>
            <CardDescription>
              {selectedDateInterviews.length} interviews scheduled
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedDateInterviews.map((interview) => (
              <div
                key={interview.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <p className="font-medium">{interview.applicantName}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    {interview.time}
                    {interview.mode === "Zoom" ? (
                      <Video className="h-4 w-4 mx-2" />
                    ) : (
                      <MapPin className="h-4 w-4 mx-2" />
                    )}
                    {interview.mode}
                  </div>
                </div>
                <Button size="sm">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}