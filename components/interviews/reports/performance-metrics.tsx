"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Pause,
  Timer,
} from "lucide-react";

interface PerformanceMetricsProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

export function PerformanceMetrics({ dateRange }: PerformanceMetricsProps) {
  // In a real application, this data would be fetched based on the dateRange
  const metrics = {
    totalInterviews: 45,
    avgFeedbackTime: "2.5 hours",
    recommendations: {
      stronglyRecommend: 15,
      recommend: 20,
      neutral: 5,
      doNotRecommend: 5,
    },
  };

  const recommendationTotal = Object.values(metrics.recommendations).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Interviews</p>
              <p className="text-2xl font-bold">{metrics.totalInterviews}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Feedback Time</p>
              <p className="text-2xl font-bold">{metrics.avgFeedbackTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Timer className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">On-Time Rate</p>
              <p className="text-2xl font-bold">95%</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Recommendation Breakdown</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-success" />
                  <span>Strongly Recommend</span>
                </div>
                <span>
                  {Math.round(
                    (metrics.recommendations.stronglyRecommend /
                      recommendationTotal) *
                      100
                  )}
                  %
                </span>
              </div>
              <Progress states={[ {value:((metrics.recommendations.stronglyRecommend / recommendationTotal) * 100)} ]}
                className="bg-success/20"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  <span>Recommend</span>
                </div>
                <span>
                  {Math.round(
                    (metrics.recommendations.recommend / recommendationTotal) * 100
                  )}
                  %
                </span>
              </div>
              <Progress states={[ {value:((metrics.recommendations.recommend / recommendationTotal) * 100)} ]} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Pause className="h-4 w-4" />
                  <span>Neutral</span>
                </div>
                <span>
                  {Math.round(
                    (metrics.recommendations.neutral / recommendationTotal) * 100
                  )}
                  %
                </span>
              </div>
              <Progress states={[ {value:((metrics.recommendations.neutral / recommendationTotal) * 100)} ]} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <ThumbsDown className="h-4 w-4 text-destructive" />
                  <span>Do Not Recommend</span>
                </div>
                <span>
                  {Math.round(
                    (metrics.recommendations.doNotRecommend /
                      recommendationTotal) *
                      100
                  )}
                  %
                </span>
              </div>
              <Progress states={[ {value:((metrics.recommendations.doNotRecommend / recommendationTotal) * 100)} ]} 
                className="bg-destructive/20"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}