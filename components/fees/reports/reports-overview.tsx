"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CreditCard, Clock, AlertTriangle, Award } from "lucide-react";

interface ReportsOverviewProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

export function ReportsOverview({ dateRange }: ReportsOverviewProps) {
  // In a real application, this data would be fetched based on the dateRange
  const summary = {
    totalExpected: "₹49,75,000",
    totalReceived: "₹32,33,750",
    outstanding: "₹17,41,250",
    scholarshipsAwarded: "₹2,98,500",
    collectionProgress: 65,
    defaulters: 8,
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Expected</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalExpected}</div>

          <Progress states={[ {value:(summary.collectionProgress)} ]} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {summary.collectionProgress}% collected
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Received</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalReceived}</div>
          <p className="text-xs text-muted-foreground mt-2">
            Last payment received 2 days ago
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.outstanding}</div>
          <p className="text-xs text-muted-foreground mt-2">
            {summary.defaulters} defaulters
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Scholarships</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.scholarshipsAwarded}</div>
          <p className="text-xs text-muted-foreground mt-2">
            12 scholarships awarded
          </p>
        </CardContent>
      </Card>
    </div>
  );
}