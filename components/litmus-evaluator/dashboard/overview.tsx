"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Award, Calendar, Clock, FileText, PlayCircle } from "lucide-react";

export function DashboardOverview() {
  const metrics = [
    {
      title: "Total Submissions",
      value: "45",
      description: "Submissions in your queue",
      icon: FileText,
    },
    {
      title: "Pending Evaluation",
      value: "23",
      description: "Awaiting your review",
      icon: Clock,
    },
    {
      title: "Today's Presentations",
      value: "5",
      description: "Scheduled presentations",
      icon: Calendar,
    },
    {
      title: "Scholarships Awarded",
      value: "8",
      description: "This month",
      icon: Award,
    },
  ];

  const upcomingPresentations = [
    {
      id: "1",
      applicant: "John Doe",
      time: "10:30 AM",
      status: "Starting Soon",
    },
    {
      id: "2",
      applicant: "Jane Smith",
      time: "2:15 PM",
      status: "Scheduled",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold">Welcome back, Sarah!</h2>
        <p className="text-muted-foreground">Here&apos;s your evaluation overview for today</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Presentations */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Presentations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingPresentations.map((presentation) => (
            <div
              key={presentation.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{presentation.applicant}</p>
                  <Badge
                    variant={presentation.status === "Starting Soon" ? "destructive" : "secondary"}
                  >
                    {presentation.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{presentation.time}</p>
              </div>
              <Button size="sm">
                <PlayCircle className="h-4 w-4 mr-2" />
                Start
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button className="h-auto flex-col items-start p-4 space-y-2">
              <div className="flex items-center">
                <PlayCircle className="h-5 w-5 mr-2" />
                Start Next Evaluation
              </div>
              <span className="text-xs text-left text-muted-foreground">
                Begin evaluating the next submission
              </span>
            </Button>
            <Button variant="outline" className="h-auto flex-col items-start p-4 space-y-2">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                View Schedule
              </div>
              <span className="text-xs text-left text-muted-foreground">
                Check your presentation schedule
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}