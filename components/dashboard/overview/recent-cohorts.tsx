"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Users, MessageSquare, PlayCircle } from "lucide-react";

type BadgeVariant = "destructive" | "warning" | "secondary" | "success" | "default";

export function RecentCohorts() {
  const cohorts = [
    {
      id: "CM01JY",
      program: "Creator Marketer",
      centre: "Jayanagar",
      startDate: "2024-09-01",
      endDate: "2025-02-28",
      schedule: "M-W-F Morning",
      seats: 50,
      filled: 32,
      status: "Open",
    },
    {
      id: "CM02JY",
      program: "Creator Marketer",
      centre: "Jayanagar",
      startDate: "2024-10-01",
      endDate: "2025-03-31",
      schedule: "T-T-S Morning",
      seats: 50,
      filled: 50,
      status: "Full",
    },
    {
      id: "CM03JY",
      program: "Creator Marketer",
      centre: "Jayanagar",
      startDate: "2024-08-01",
      endDate: "2025-01-31",
      schedule: "M-W-F Evening",
      seats: 50,
      filled: 45,
      status: "Open",
    },
  ];

  const getStatusColor = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "open":
        return "success";
      case "full":
        return "warning";
      case "closed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Cohorts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cohorts.map((cohort) => (
          <div
            key={cohort.id}
            className="flex flex-col space-y-4 p-4 border rounded-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{cohort.program}</h3>
                <p className="text-sm text-muted-foreground">{cohort.centre}</p>
              </div>
              <Badge variant={getStatusColor(cohort.status)}>
                {cohort.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Schedule</p>
                <p>{cohort.schedule}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Duration</p>
                <p>
                  {new Date(cohort.startDate).toLocaleDateString()} -{" "}
                  {new Date(cohort.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Seats Filled</span>
                <span>
                  {cohort.filled}/{cohort.seats}
                </span>
              </div>
              <Progress
                value={(cohort.filled / cohort.seats) * 100}
                className="h-2"
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <PlayCircle className="h-4 w-4 mr-2" />
                View Dashboard
              </Button>
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}