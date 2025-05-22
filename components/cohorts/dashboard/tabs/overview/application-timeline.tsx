"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicationTimelineProps } from "@/types/components/cohorts/dashboard/tabs/overview/application-timeline";

export function ApplicationTimeline({
  applications,
}: ApplicationTimelineProps) {
  const data = [
    { date: "Week 1", applications: 12 },
    { date: "Week 2", applications: 19 },
    { date: "Week 3", applications: 25 },
    { date: "Week 4", applications: 32 },
    { date: "Week 5", applications: 45 },
    { date: "Week 6", applications: 56 },
  ];

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Applications Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value}`]}
                labelFormatter={() => ""}
                contentStyle={{
                  color: "foreground",
                  background: "background",
                  border: "none",
                }}
              />
              <Line
                type="monotone"
                dataKey="applications"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
