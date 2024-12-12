"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Video, MapPin, PlayCircle } from "lucide-react";

export function UpcomingPresentations() {
  const presentations = [
    {
      id: "PRES001",
      applicantName: "John Doe",
      time: "10:30 AM",
      mode: "Zoom",
      status: "Starting Soon",
    },
    {
      id: "PRES002",
      applicantName: "Jane Smith",
      time: "11:45 AM",
      mode: "In-person",
      status: "Scheduled",
    },
    {
      id: "PRES003",
      applicantName: "Mike Johnson",
      time: "2:15 PM",
      mode: "Google Meet",
      status: "Scheduled",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Presentations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {presentations.map((presentation) => (
          <div
            key={presentation.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{presentation.applicantName}</p>
                <Badge
                  variant={presentation.status === "Starting Soon" ? "destructive" : "secondary"}
                >
                  {presentation.status}
                </Badge>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                {presentation.time}
                {presentation.mode === "Zoom" || presentation.mode === "Google Meet" ? (
                  <Video className="h-4 w-4 mx-2" />
                ) : (
                  <MapPin className="h-4 w-4 mx-2" />
                )}
                {presentation.mode}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                View Details
              </Button>
              {presentation.status === "Starting Soon" && (
                <Button size="sm">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}