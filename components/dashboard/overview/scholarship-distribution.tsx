"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export function ScholarshipDistribution() {
  const data = [
    { name: "Smart Mouth (5%)", value: 15, amount: 248750, color: "hsl(var(--chart-1))" },
    { name: "Smart Ass (8%)", value: 12, amount: 318400, color: "hsl(var(--chart-2))" },
    { name: "Wise Asss (10%)", value: 8, amount: 298500, color: "hsl(var(--chart-3))" },
    { name: "Wise Assss (10%)", value: 8, amount: 298500, color: "hsl(var(--chart-4))" },
    { name: "Wise Asssss (10%)", value: 8, amount: 298500, color: "hsl(var(--chart-5))" },
  ];

  const totalStudents = data.reduce((acc, curr) => acc + curr.value, 0);
  const totalAmount = data.reduce((acc, curr) => acc + curr.amount, 0);const averagePercentage = 
  data && data.length > 0 
    ? data.reduce((acc, curr) => {
        const match = curr.name ? curr.name.match(/\d+/) : null;
        const number = match ? Number(match[0]) : 0;
        return acc + (curr.value * number);
      }, 0) / totalStudents
    : 0;


  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Scholarship Distribution</CardTitle>
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
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-sm text-muted-foreground">
                    ({item.value})
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  ₹{(item.amount / 100000).toFixed(2)}L
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Average Scholarship</span>
            <span className="font-medium">{averagePercentage.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Total Amount</span>
            <span className="font-medium">₹{(totalAmount / 100000).toFixed(2)}L</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}