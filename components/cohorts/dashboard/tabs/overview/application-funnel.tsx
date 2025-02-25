"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Bar } from "recharts";
import { ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface ApplicationFunnelProps {
  applications: any;
}

export function ApplicationFunnel({ applications }: ApplicationFunnelProps) {
    const [appliedCount, setAppliedCount] = useState(0);
    const [underReviewCount, setUnderReviewCount] = useState(0);
    const [litmusCompleteCount, setLitmusCompleteCount] = useState(0);
    const [interviewedCount, setInterviewedCount] = useState(0);
    const [enrolledCount, setEnrolledCount] = useState(0);
  
    useEffect(() => {
      if (applications && Array.isArray(applications)) {

        // Applied Count
        const applied = applications.filter(
          (application) =>
            application?.applicationDetails?.applicationStatus?.toLowerCase() !==
            undefined
        );
        setAppliedCount(applied.length);
  
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
            "complete"
        );
        setInterviewedCount(onhold.length);

        const litmus = applications.filter(
          (application) =>
          (application?.litmusTestDetails?.[0]?.litmusTaskId?.status?.toLowerCase() !== "pending" &&
          application?.litmusTestDetails?.[0]?.litmusTaskId?.status?.toLowerCase() !== undefined)
        );
        setLitmusCompleteCount(litmus.length);
  
        const enrolled = applications.filter(
          (application) =>
            application?.litmusTestDetails?.[0]?.litmusTaskId?.status?.toLowerCase() ===
            "completed"
        );
        setEnrolledCount(enrolled.length);

        // const rejected = applications.filter(
        //   (application) =>
        //     application?.applicationDetails?.applicationStatus?.toLowerCase() ===
        //     "rejected"
        // );
        // setRejectedCount(rejected.length);

  
      } else {
        console.log("Applications data is not an array or is undefined.");
      }
    }, [applications]);
    
  const funnelData = [
    { stage: "Applications", value: appliedCount },
    { stage: "Under Review", value: underReviewCount },
    { stage: "Interviewed", value: interviewedCount },
    { stage: "LITMUS Complete", value: litmusCompleteCount },
    { stage: "Enrolled", value: enrolledCount },
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
              <XAxis type="number" 
                domain={[0, appliedCount+10]} />
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