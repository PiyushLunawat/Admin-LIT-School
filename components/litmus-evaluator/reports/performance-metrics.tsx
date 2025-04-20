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
  Flame,
  Laugh,
  Frown,
  Meh,
} from "lucide-react";
import { useEffect, useState } from "react";

interface PerformanceMetricsProps {
  applications: any;
}

export function PerformanceMetrics({ applications }: PerformanceMetricsProps) {
  const [totalEvaluated, setTotalEvaluatedCount] = useState(0);
  const [avgFeedbackTime, setAvgFeedbackTime] = useState('--');
  const [avgPerformance, setAvgPerformance] = useState('--');
  const [metrics, setMetrics] = useState({
    highPerformance: 0,
    goodPerformance: 0,
    averagePerformance: 0,
    weakPerformance: 0,
  });

  useEffect(() => {
    if (applications && Array.isArray(applications)) {
      let evaluatedCount = 0;
      let totalFeedbackTime = 0;
      let totalPerformance = 0;
      let avgTime = '';

      let high = 0, good = 0, average = 0, weak = 0;

      applications?.forEach((application: any) => {
        const latestCohort = application?.appliedCohorts?.[application?.appliedCohorts.length - 1];
        const litmusTestDetails = latestCohort?.litmusTestDetails;
        if (litmusTestDetails?.status === "completed") {
          evaluatedCount += 1;
          
          // Calculate Feedback Time (difference between updatedAt and createdAt)
          const createdAt = new Date(litmusTestDetails?.createdAt);
          const updatedAt = new Date(litmusTestDetails?.updatedAt);
          const feedbackTime = (updatedAt.getTime() - createdAt.getTime()) / 1000 / 60 / 60; // in hours
          totalFeedbackTime += feedbackTime;

          // Calculate Avg Performance
          const taskScores = litmusTestDetails?.results || [];
          let totalScore = 0;

          taskScores?.forEach((task: any) => {
            const taskScore = task?.score?.reduce((acc: any, criterion: any) => acc + criterion.score, 0);
            const taskMaxScore = task?.score?.reduce((acc: any, criterion: any) => acc + Number(criterion.totalScore), 0);
            const taskPercentage = taskMaxScore ? (taskScore / taskMaxScore) * 100 : 0;
            totalScore += taskPercentage;
          });

          const avgTaskScore = totalScore / taskScores.length;
          totalPerformance += avgTaskScore;

          // Categorize Performance
          if (avgTaskScore >= 75) high++;
          else if (avgTaskScore >= 50) good++;
          else if (avgTaskScore >= 25) average++;
          else weak++;
        }
      });

      if(totalFeedbackTime/evaluatedCount > 24) 
        avgTime = `${(totalFeedbackTime/(evaluatedCount * 24)).toFixed(1)} days`
      else
        avgTime = `${(totalFeedbackTime/(evaluatedCount)).toFixed(1)} hours`

      if (evaluatedCount !== 0) {
        setTotalEvaluatedCount(evaluatedCount);
        setAvgFeedbackTime(avgTime);
        setAvgPerformance(`${(totalPerformance / evaluatedCount).toFixed(1)}%`);
      } else {
        setTotalEvaluatedCount(0);
        setAvgFeedbackTime('--');
        setAvgPerformance('--');
      }

      setMetrics({
        highPerformance: high,
        goodPerformance: good,
        averagePerformance: average,
        weakPerformance: weak,
      })
    }
  }, [applications]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Evaluations</p>
              <p className="text-2xl font-bold">{totalEvaluated}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Feedback Time</p>
              <p className="text-2xl font-bold">{avgFeedbackTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Flame className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Performance Avg.</p>
              <p className="text-2xl font-bold">{avgPerformance}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Recommendation Breakdown</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-[#2EB88A]">
                <div className="flex items-center gap-2">
                  <Laugh className="h-4 w-4 text-success" />
                  <span className="text-white">High Performance (75% - 100%)</span>
                </div>
                <span>
                  {Math.round( (metrics.highPerformance / totalEvaluated) * 100 )}%
                </span>
              </div>
              {/* <Progress states={[ {value:((metrics.recommendations.stronglyRecommend / totalEvaluated) * 100)} ]} className="bg-success/20"/> */}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-[#00A3FF]">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  <span className="text-white">Good Performance (50% - 75%)</span>
                </div>
                <span>
                  {Math.round( (metrics.goodPerformance / totalEvaluated) * 100 )}%
                </span>
              </div>
            {/* <Progress states={[ {value:((metrics.recommendations.recommend / totalEvaluated) * 100)} ]} /> */}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-[#FFFFFF]">
                <div className="flex items-center gap-2">
                  <Meh className="h-4 w-4" />
                  <span className="text-white">Average  (25% - 50%)</span>
                </div>
                <span>
                  {Math.round( (metrics.averagePerformance / totalEvaluated) * 100 )}%
                </span>
              </div>
            {/* <Progress states={[ {value:((metrics.recommendations.average / totalEvaluated) * 100)} ]} /> */}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-[#FF791F]">
                <div className="flex items-center gap-2">
                  <Frown className="h-4 w-4 text-destructive" />
                  <span className="text-white">Weak Performance (0% - 25%)</span>
                </div>
                <span>
                  {Math.round( (metrics.weakPerformance / totalEvaluated) * 100 )}%
                </span>
              </div>
              <Progress states={[
                {value:metrics.highPerformance ,widt:((metrics.highPerformance / totalEvaluated) * 100), color: '#2EB88A'},
                {value:metrics.goodPerformance ,widt:((metrics.goodPerformance / totalEvaluated) * 100), color: '#00A3FF'},
                {value:metrics.averagePerformance ,widt:((metrics.averagePerformance / totalEvaluated) * 100), color: '#FFFFFF'},
                {value:metrics.weakPerformance ,widt:((metrics.weakPerformance / totalEvaluated) * 100), color: '#FF791F'} 
              ]} className="bg-destructive/20"/>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}