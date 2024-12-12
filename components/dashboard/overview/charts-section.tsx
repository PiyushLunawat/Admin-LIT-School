"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Tooltip,
  Legend,
} from "recharts";

export function ChartsSection() {
  // Application funnel data
  const funnelData = [
    { stage: "Applications", value: 156 },
    { stage: "Under Review", value: 98 },
    { stage: "Interviewed", value: 67 },
    { stage: "LITMUS Complete", value: 45 },
    { stage: "Enrolled", value: 25 },
  ];


  // Applications trend data
  const trendData = [
    { month: "Jan", applications: 45 },
    { month: "Feb", applications: 52 },
    { month: "Mar", applications: 48 },
    { month: "Apr", applications: 61 },
    { month: "May", applications: 55 },
    { month: "Jun", applications: 67 },
  ];

  return (
    <div className="space-y-6">
      {/* Application Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Application Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer style={{marginLeft: "-15px"}} width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="stage" type="category" width={100} />
                <Tooltip formatter={(value) => [`${value}`]} labelFormatter={() => ''} contentStyle={{ color: 'foreground', background: "background", border: "none"}} />
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

     

      {/* Applications Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Applications Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer style={{marginLeft: "-15px"}}  width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}`]} labelFormatter={() => ''} contentStyle={{ color: 'foreground', background: "background", border: "none"}}/>
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
    </div>
  );
}