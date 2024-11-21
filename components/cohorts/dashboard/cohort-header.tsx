"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Download, Mail, MessageSquare } from "lucide-react";
import { DateRangePicker } from "@/components/dashboard/overview/date-range-picker";

interface CohortHeaderProps {
  cohortId: string;
}

export function CohortHeader({ cohortId }: CohortHeaderProps) {
  // In a real application, this data would be fetched based on the cohortId
  const cohort = {
    id: cohortId,
    program: "Creator Marketer",
    centre: "Jayanagar",
    startDate: "Sep 22, 2024",
    endDate: "Feb 28, 2025",
    schedule: "Morning Batch (M-W-F)",
    seats: 50,
    registered: 35,
    applicationfee: 25,
    filled: 15,
    status: "Open",
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-2 border-b">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{cohort.program}</h2>
              <Badge variant={cohort.status === "Open" ? "success" : "secondary"}>
                {cohort.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Cohort ID: {cohort.id}</p>
            <p className="text-sm font-medium">{cohort.centre}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Schedule</p>
            <p className="font-medium">{cohort.schedule}</p>
            <p className="text-sm">
              {cohort.startDate} - {cohort.endDate}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Seats</p>
            <div className="flex justify-between text-sm">
              <span>Filled</span>
              <span>{cohort.filled}/{cohort.seats}</span>
            </div>
            <Progress
              states={[
                { value: ((cohort.registered - cohort.applicationfee) / cohort.seats) * 100, color: '#2EB88A' },
                { value: ((cohort.applicationfee - cohort.filled) / cohort.seats) * 100, color: '#FBBF24' },
                { value: (cohort.filled / cohort.seats) * 100, color: '#EF4444' },
              ]}
            />
          </div>
        </div>
        <div className="pt-4">
        <DateRangePicker />
        </div>
      </CardContent>
    </Card>
  );
}