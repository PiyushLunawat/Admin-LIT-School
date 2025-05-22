"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScholarshipDistributionProps } from "@/types/components/cohorts/dashboard/tabs/overview/scholarship-distribution";

export function ScholarshipDistribution({
  cohortId,
}: ScholarshipDistributionProps) {
  const data = [
    {
      name: "Smart Mouth",
      students: 5,
      amount: 49750,
    },
    {
      name: "Smart Ass",
      students: 4,
      amount: 79600,
    },
    {
      name: "Wise Ass",
      students: 3,
      amount: 99500,
    },
  ];

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Scholarship Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Bar
                dataKey="students"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
