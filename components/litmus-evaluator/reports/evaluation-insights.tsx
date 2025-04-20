"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { HandMetal } from "lucide-react";
import { useEffect, useState } from "react";

interface EvaluationInsightsProps {
  applications: any;
}

export function EvaluationInsights({ applications }: EvaluationInsightsProps) {
  const [highPerformanceSkills, setHighPerformanceSkills] = useState<any>({});
  const [weakPerformanceSkills, setWeakPerformanceSkills] = useState<any>({});

  useEffect(() => {
    if (applications && Array.isArray(applications)) {
      const highPerformanceMap: any = {};  // To map skills to high performance students
      const weakPerformanceMap: any = {};  // To map skills to weak performance students

      applications?.forEach((application: any) => {
        const latestCohort = application?.appliedCohorts?.[application?.appliedCohorts.length - 1];
        const litmusTestDetails = latestCohort?.litmusTestDetails;

        if (litmusTestDetails?.status === "completed") {
          const taskScores = litmusTestDetails?.results || [];

          taskScores?.forEach((task: any) => {
            task?.score?.forEach((criterion: any) => {
              const scorePercentage = (criterion.score / criterion.totalScore) * 100;

              // Categorize based on score percentage
              if (scorePercentage >= 70) {
                // High performance students
                if (!highPerformanceMap[criterion.criteria]) {
                  highPerformanceMap[criterion.criteria] = [];
                }
                highPerformanceMap[criterion.criteria].push({
                  student: application,
                  cohortId: application?.cohort?.cohortId,
                });
              } else if (scorePercentage <= 35) {
                // Weak performance students
                if (!weakPerformanceMap[criterion.criteria]) {
                  weakPerformanceMap[criterion.criteria] = [];
                }
                weakPerformanceMap[criterion.criteria].push({
                  student: application,
                  cohortId: application?.cohort?.cohortId,
                });
              }
            });
          });
        }
      });

      // Set state with students grouped by skill and performance
      setHighPerformanceSkills(highPerformanceMap);
      setWeakPerformanceSkills(weakPerformanceMap);
    }
  }, [applications]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={insights.performanceTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Bar
                  dataKey="score"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card> */}

      <Card>
        <CardHeader className="flex-row justify-between items-center">
          <CardTitle>Common Strengths</CardTitle>
          <Badge variant={'success'} className="border-none">70% +</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
          {Object.keys(highPerformanceSkills).map((skill) => (
              <div key={skill} className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <HandMetal className="w-4 rotate-90" />
                  <div className="space-y-1">
                    <span className="text-base">{skill}</span>
                    <div className="flex gap-1">
                    {[...new Set(highPerformanceSkills[skill].map((entry: any) => entry.cohortId))].map((cohortId: any, index: number) => (
                      <div key={index} className="w-fit px-1.5 py-0.5 text-xs font-normal bg-[#FFFFFF]/10 rounded-sm">
                        {cohortId}
                      </div>
                    ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs">{highPerformanceSkills[skill].length} students</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row justify-between items-center">
          <CardTitle>Areas for Improvement</CardTitle>
          <Badge variant={'warning'} className="border-none">35% -</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
          {Object.keys(weakPerformanceSkills).map((skill) => (
              <div key={skill} className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <HandMetal className="w-4 rotate-90" />
                  <div className="space-y-1">
                    <span className="text-base">{skill}</span>
                    <div className="flex gap-1">
                    {[...new Set(weakPerformanceSkills[skill].map((entry: any) => entry.cohortId))].map((cohortId: any, index: number) => (
                      <div key={index} className="w-fit px-1.5 py-0.5 text-xs font-normal bg-[#FFFFFF]/10 rounded-sm">
                        {cohortId}
                      </div>
                    ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs">{weakPerformanceSkills[skill].length} students</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}