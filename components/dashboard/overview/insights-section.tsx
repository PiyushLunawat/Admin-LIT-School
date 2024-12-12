"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, TrendingUp, TrendingDown } from "lucide-react";

export function InsightsSection() {
  const insights = [
    {
      id: "1",
      type: "Application Trend",
      message: "12% increase in applications compared to last month",
      trend: "positive",
      recommendation: "Consider opening new cohorts for high-demand programs",
      action: "View Analysis",
    },
    {
      id: "2",
      type: "Payment Pattern",
      message: "15% of students have pending payments for over 30 days",
      trend: "negative",
      recommendation: "Send payment reminders to students with overdue payments",
      action: "Send Reminders",
    },
    {
      id: "3",
      type: "Scholarship Impact",
      message: "Smart Mouth scholarship recipients show 95% course completion rate",
      trend: "positive",
      recommendation: "Review scholarship criteria for upcoming cohorts",
      action: "Review Criteria",
    },
  ];

  const getTrendIcon = (trend: string) => {
    return trend === "positive" ? (
      <TrendingUp className="h-4 w-4 text-success" />
    ) : (
      <TrendingDown className="h-4 w-4 text-destructive" />
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-2">
        <Lightbulb className="h-5 w-5 text-primary" />
        <CardTitle>Actionable Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="border rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{insight.type}</Badge>
                {getTrendIcon(insight.trend)}
              </div>
            </div>
            <p className="text-sm font-medium">{insight.message}</p>
            <p className="text-sm text-muted-foreground">
              Recommendation: {insight.recommendation}
            </p>
            <Button variant="outline" size="sm">
              {insight.action}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}