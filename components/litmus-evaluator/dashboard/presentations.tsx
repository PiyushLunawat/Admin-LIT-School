"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, PlayCircle, Video } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

export function PresentationSchedule() {
  const presentations = [
    {
      id: "1",
      applicant: "John Doe",
      date: "2024-03-25",
      time: "10:30 AM",
      mode: "Online",
      status: "Scheduled",
    },
    {
      id: "2",
      applicant: "Jane Smith",
      date: "2024-03-25",
      time: "2:15 PM",
      mode: "Online",
      status: "Starting Soon",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Presentation Schedule</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Today's Presentations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {presentations.map((presentation) => (
              <div
                key={presentation.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{presentation.applicant}</p>
                    <Badge
                      variant={
                        presentation.status === "Starting Soon"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {presentation.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {presentation.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {presentation.time}
                    </div>
                    <div className="flex items-center">
                      <Video className="h-4 w-4 mr-1" />
                      {presentation.mode}
                    </div>
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

        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={new Date()}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}