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

interface EvaluationInsightsProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

export function EvaluationInsights({ dateRange }: EvaluationInsightsProps) {
  // In a real application, this data would be fetched based on the dateRange
  const insights = {
    commonStrengths: [
      { skill: "Communication", count: 35 },
      { skill: "Problem Solving", count: 28 },
      { skill: "Technical Knowledge", count: 25 },
      { skill: "Creativity", count: 22 },
      { skill: "Leadership", count: 18 },
    ],
    commonWeaknesses: [
      { skill: "Time Management", count: 15 },
      { skill: "Project Experience", count: 12 },
      { skill: "Industry Knowledge", count: 10 },
      { skill: "Team Collaboration", count: 8 },
      { skill: "Communication", count: 5 },
    ],
    performanceTrends: [
      { month: "Jan", score: 85 },
      { month: "Feb", score: 88 },
      { month: "Mar", score: 92 },
      { month: "Apr", score: 90 },
      { month: "May", score: 95 },
    ],
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="md:col-span-2">
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
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Common Strengths</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.commonStrengths.map((strength, index) => (
              <div
                key={strength.skill}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{strength.skill}</span>
                </div>
                <Badge variant="secondary">{strength.count} mentions</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Areas for Improvement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.commonWeaknesses.map((weakness, index) => (
              <div
                key={weakness.skill}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{weakness.skill}</span>
                </div>
                <Badge variant="secondary">{weakness.count} mentions</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}