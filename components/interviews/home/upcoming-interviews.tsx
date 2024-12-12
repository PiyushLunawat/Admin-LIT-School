"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Video, MapPin } from "lucide-react";

export function UpcomingInterviews() {
  const interviews = [
    {
      id: "INT001",
      applicantName: "John Doe",
      time: "10:30 AM",
      mode: "Zoom",
      status: "Starting Soon",
    },
    {
      id: "INT002",
      applicantName: "Jane Smith",
      time: "11:45 AM",
      mode: "In-person",
      status: "Scheduled",
    },
    {
      id: "INT003",
      applicantName: "Mike Johnson",
      time: "2:15 PM",
      mode: "Google Meet",
      status: "Scheduled",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Interviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {interviews.map((interview) => (
          <div
            key={interview.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{interview.applicantName}</p>
                <Badge
                  variant={interview.status === "Starting Soon" ? "destructive" : "secondary"}
                >
                  {interview.status}
                </Badge>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                {interview.time}
                {interview.mode === "Zoom" || interview.mode === "Google Meet" ? (
                  <Video className="h-4 w-4 mx-2" />
                ) : (
                  <MapPin className="h-4 w-4 mx-2" />
                )}
                {interview.mode}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                View Details
              </Button>
              {interview.status === "Starting Soon" && (
                <Button size="sm">Start Interview</Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}