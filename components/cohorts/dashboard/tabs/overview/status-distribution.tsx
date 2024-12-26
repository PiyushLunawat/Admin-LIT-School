"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface StatusDistributionProps {
  applications: any;
}

export function StatusDistribution({ applications }: StatusDistributionProps) {
    const [underReviewCount, setUnderReviewCount] = useState(0);
    const [acceptedCount, setAcceptedCount] = useState(0);
    const [onHoldCount, setOnHoldCount] = useState(0);
    const [rejectedCount, setRejectedCount] = useState(0);
  
    useEffect(() => {
      if (applications && Array.isArray(applications)) {
  
        // Under Review Count
        const underReview = applications.filter(
          (application) =>
            application?.applicationDetails?.applicationStatus?.toLowerCase() ===
            "under review"
        );
        setUnderReviewCount(underReview.length);
  
        // Interviews Scheduled Count
        const onhold = applications.filter(
          (application) =>
            application?.applicationDetails?.applicationStatus?.toLowerCase() ===
            "on hold"
        );
        setOnHoldCount(onhold.length);
  
        const accepted = applications.filter(
          (application) =>
            application?.applicationDetails?.applicationStatus?.toLowerCase() ===
            "accepted"
        );
        setAcceptedCount(accepted.length);

        const rejected = applications.filter(
          (application) =>
            application?.applicationDetails?.applicationStatus?.toLowerCase() ===
            "rejected"
        );
        setRejectedCount(rejected.length);

  
      } else {
        console.log("Applications data is not an array or is undefined.");
      }
    }, [applications]);
    
  const data = [
    { name: "Under Review", value: underReviewCount, color: "hsl(var(--chart-1))" },
    { name: "Shortlisted", value: acceptedCount, color: "hsl(var(--chart-2))" },
    { name: "On Hold", value: onHoldCount, color: "hsl(var(--muted))" },
    { name: "Rejected", value: rejectedCount, color: "hsl(var(--destructive))" },
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