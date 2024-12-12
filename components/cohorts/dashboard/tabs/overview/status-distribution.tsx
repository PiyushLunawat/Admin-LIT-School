"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface StatusDistributionProps {
  cohortId: string;
}

export function StatusDistribution({ cohortId }: StatusDistributionProps) {
  // In a real application, this data would be fetched based on the cohortId
  const data = [
    { name: "Under Review", value: 23, color: "hsl(var(--chart-1))" },
    { name: "Shortlisted", value: 45, color: "hsl(var(--chart-2))" },
    { name: "On Hold", value: 15, color: "hsl(var(--muted))" },
    { name: "Rejected", value: 12, color: "hsl(var(--destructive))" },
  ];

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Application Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              />
              <div className="space-x-2">
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-sm text-muted-foreground">
                  ({item.value})
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}