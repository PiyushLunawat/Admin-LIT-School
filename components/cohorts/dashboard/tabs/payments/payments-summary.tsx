"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CreditCard, Clock, AlertTriangle, Award } from "lucide-react";

interface PaymentsSummaryProps {
  cohortId: string;
}

export function PaymentsSummary({ cohortId }: PaymentsSummaryProps) {
  // In a real application, this data would be fetched based on the cohortId
  const summary = {
    totalExpected: "₹49,75,000",
    totalReceived: "₹32,33,750",
    outstanding: "₹17,41,250",
    scholarshipsAwarded: "₹2,98,500",
    collectionProgress: 65,
    instalmentBreakdown: [
      [
        { label: "Instalment 1", total: "₹16,58,333", received: "₹16,58,333", status: "complete" },
        { label: "Instalment 2", total: "₹16,58,333", received: "₹12,43,750", status: "pending" },
        { label: "Instalment 3", total: "₹16,58,333", received: "₹3,31,667", status: "pending" },
      ],
      [
        { label: "Instalment 4", total: "₹16,58,333", received: "₹16,58,333", status: "complete" },
        { label: "Instalment 5", total: "₹16,58,333", received: "₹12,43,750", status: "partial" },
        { label: "Instalment 6", total: "₹16,58,333", received: "₹3,31,667", status: "pending" },
      ],
      [
        { label: "Instalment 7", total: "₹16,58,333", received: "₹16,58,333", status: "complete" },
        { label: "Instalment 8", total: "₹16,58,333", received: "₹12,43,750", status: "partial" },
        { label: "Instalment 9", total: "₹16,58,333", received: "₹3,31,667", status: "pending" },
      ],
    ],
  };

  return (
  <>
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
            8 payments overdue
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
            12 scholarships awarded at an avg of 12%
          </p>
        </CardContent>
      </Card>
    </div>

    <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Instalment Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {summary.instalmentBreakdown.map((semester, semesterIndex) => (
      <div key={semesterIndex} className="space-y-2">
        <Badge variant="blue" className="py-1">Semester {semesterIndex + 1}</Badge>
        <Card className="md:col-span-1 lg:col-span-1">
          <CardContent className="pt-4">
            <div className="space-y-4">
              {semester.map((instalment, instalmentIndex) => (
                <div key={instalmentIndex} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{instalment.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {instalment.received} / {instalment.total}
                    </span>
                  </div>
                  <Progress states={[ {value:((parseInt(instalment.received.replace(/[^0-9]/g, "")) /
                      parseInt(instalment.total.replace(/[^0-9]/g, ""))) * 100)} ]}
                    className={`${
                      instalment.status === "complete"
                        ? "bg-success"
                        : instalment.status === "partial"
                        ? "bg-warning"
                        : "bg-danger"
                    }`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>  
      ))}
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>One-Shot Payment Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">2/3 Students</span>
                    <span className="text-sm text-muted-foreground">
                      18,34,455 / 20,00,000
                    </span>
                  </div>

                  <Progress states={[ {value:(666/700)} ]} />
                </div>
              </div>
          </div>
        </CardContent>
      </Card>
  </>  
  );
}