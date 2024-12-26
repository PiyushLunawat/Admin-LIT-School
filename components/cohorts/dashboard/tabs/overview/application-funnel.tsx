"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "recharts";
import { ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface ApplicationFunnelProps {
  applications: any;
}

export function ApplicationFunnel({ applications }: ApplicationFunnelProps) {
  // In a real application, this data would be fetched based on the cohortId
  const funnelData = [
    { stage: "Applications", value: 156 },
    { stage: "Under Review", value: 98 },
    { stage: "Interviewed", value: 67 },
    { stage: "LITMUS Complete", value: 45 },
    { stage: "Enrolled", value: 25 },
  ];


  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Application Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
        <ResponsiveContainer width="100%" style={{marginLeft: "-15px"}} height="100%">
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="stage" type="category" width={100} />
                <Tooltip  formatter={(value) => [`${value}`]} labelFormatter={() => ''} contentStyle={{ color: 'foreground', background: "background", border: "none"}}/>
                <Bar
                  dataKey="value"
                  fill="hsl(var(--primary))"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}