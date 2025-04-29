"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// Function to process scholarship data from applications
const processScholarships = (applications: any) => {
  const scholarshipMap: any = {};

  applications?.forEach((application: any) => {

    const semester = application?.appliedCohorts?.[application?.appliedCohorts.length - 1]?.litmusTestDetails?.scholarshipDetail;
    if (!semester) return;

    const scholarshipName = semester?.scholarshipName;
    const scholarshipPercentage = semester?.scholarshipPercentage || 0;
    const baseFee = application?.appliedCohorts?.[application?.appliedCohorts.length - 1]?.cohortId?.baseFee || 0;
    const scholarshipAmount = baseFee * scholarshipPercentage * 0.01 || 0;

    if (!scholarshipMap[scholarshipName]) {
      scholarshipMap[scholarshipName] = {
        name: scholarshipName,
        value: scholarshipPercentage,
        count: 1,
        amount: scholarshipAmount,
        color: `hsl(var(--chart-${Object.keys(scholarshipMap).length + 1}))`, // Assign color dynamically
      };
    } else {
      scholarshipMap[scholarshipName].count += 1;
      scholarshipMap[scholarshipName].amount += scholarshipAmount;
    }
  });

  return Object.values(scholarshipMap);
};

interface ScholarshipDistributionProps {
  applications: any[];
}

export function ScholarshipDistribution({ applications }: ScholarshipDistributionProps) {
  const [scholarshipsData, setScholarshipsData] = useState<any[]>([]);

  useEffect(() => {
    if (applications && Array.isArray(applications)) {
      const data = processScholarships(applications);
      setScholarshipsData(data);
    }
  }, [applications]);

  const totalStudents = scholarshipsData.reduce((acc, curr) => acc + curr.count, 0);
  const totalAmount = scholarshipsData.reduce((acc, curr) => acc + curr.amount, 0);

  const averageValue = scholarshipsData && scholarshipsData.length > 0
  ? scholarshipsData.reduce((acc, curr) => acc + curr.value * curr.count, 0) / totalStudents
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
              <Pie data={scholarshipsData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {scholarshipsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {scholarshipsData.map((item) => (
            <div key={item.name} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              />
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-sm text-muted-foreground">({item.value}%)</span>
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
            <span className="font-medium">{averageValue.toFixed(1)}%</span>
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
