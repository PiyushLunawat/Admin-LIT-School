"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

interface PaymentReportsProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

export function PaymentReports({ dateRange }: PaymentReportsProps) {
  // In a real application, this data would be fetched based on the dateRange
  const paymentTrends = [
    { date: "Jan", amount: 495000 },
    { date: "Feb", amount: 825000 },
    { date: "Mar", amount: 660000 },
    { date: "Apr", amount: 990000 },
    { date: "May", amount: 825000 },
  ];

  const paymentModes = [
    { mode: "UPI", amount: 1650000 },
    { mode: "Net Banking", amount: 1320000 },
    { mode: "Credit Card", amount: 825000 },
    { mode: "Debit Card", amount: 495000 },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Payment Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={paymentTrends}>
                <XAxis dataKey="date" />
                <YAxis />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Modes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentModes}>
                <XAxis dataKey="mode" />
                <YAxis />
                <Bar
                  dataKey="amount"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}