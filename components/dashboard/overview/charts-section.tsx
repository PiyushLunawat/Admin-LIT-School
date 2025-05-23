"use client";

import { getStudents } from "@/app/api/student";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ScholarshipDistribution } from "./scholarship-distribution";

interface ChartsSectionProps {
  selectedDateRange: DateRange | undefined;
  searchQuery: string;
  selectedProgram: string;
  selectedCohort: string;
}
export function ChartsSection({
  selectedDateRange,
  searchQuery,
  selectedProgram,
  selectedCohort,
}: ChartsSectionProps) {
  const [applications, setApplications] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [appliedCount, setAppliedCount] = useState(0);
  const [underReviewCount, setUnderReviewCount] = useState(0);
  const [litmusCompleteCount, setLitmusCompleteCount] = useState(0);
  const [interviewedCount, setInterviewedCount] = useState(0);
  const [enrolledCount, setEnrolledCount] = useState(0);

  useEffect(() => {
    async function fetchAndFilterStudents() {
      setLoading(true);
      try {
        // 1) Fetch All Students
        const response = await getStudents();

        // 2) Filter Out Students with No Application Details
        const validStudents = response.data.filter((student: any) =>
          ["initiated", "applied", "reviewing", "enrolled", "dropped"].includes(
            student?.appliedCohorts?.[student?.appliedCohorts.length - 1]
              ?.status
          )
        );

        // 3) Filter Based on Date Range, Search Query, Program, Cohort
        const filteredApplications = validStudents.filter((app: any) => {
          const latestCohort =
            app?.appliedCohorts?.[app?.appliedCohorts.length - 1];
          const cohortDetails = latestCohort?.cohortId;
          const applicationDetails = latestCohort?.applicationDetails;
          const litmusTestDetails = latestCohort?.litmusTestDetails;
          const tokenFeeDetails = latestCohort?.tokenFeeDetails;
          const scholarshipDetails = litmusTestDetails?.scholarshipDetail;

          // --- Date Range Check ---
          if (selectedDateRange) {
            const appDate = new Date(app.updatedAt);
            const { from, to } = selectedDateRange;
            if ((from && appDate < from) || (to && appDate > to)) {
              return false;
            }
          }

          // --- Search Query (by Name, Email, etc.) ---
          if (searchQuery) {
            const lowerSearch = searchQuery.toLowerCase();
            // Adjust fields as needed (name, email, phone, etc.)
            const matchesSearch =
              (app.firstName + " " + app.lastName || "")
                .toLowerCase()
                .includes(lowerSearch) ||
              (cohortDetails.programDetail.name || "")
                .toLowerCase()
                .includes(lowerSearch) ||
              (cohortDetails.cohortId || "")
                .toLowerCase()
                .includes(lowerSearch);

            if (!matchesSearch) return false;
          }

          // --- Program Check ---
          if (selectedProgram !== "all-programs") {
            // Suppose 'app.program' is how you store it
            if (cohortDetails?.programDetail?.name !== selectedProgram) {
              return false;
            }
          }

          // --- Cohort Check ---
          if (selectedCohort !== "all-cohorts") {
            // Suppose 'app.cohort' is how you store it
            if (cohortDetails?.cohortId !== selectedCohort) {
              return false;
            }
          }

          return true;
        });

        // 4) Set Final Filtered Applications
        setApplications(filteredApplications);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAndFilterStudents();
  }, [selectedDateRange, searchQuery, selectedProgram, selectedCohort]);

  useEffect(() => {
    if (applications && Array.isArray(applications)) {
      let appliedCount = 0;
      let underReviewCount = 0;
      let interviewedCount = 0;
      let litmusCompleteCount = 0;
      let enrolledCount = 0;

      applications.forEach((application) => {
        const latestCohort =
          application?.appliedCohorts?.[application?.appliedCohorts.length - 1];

        const applicationStatus =
          latestCohort?.applicationDetails?.applicationStatus?.toLowerCase();
        const litmusStatus =
          latestCohort?.litmusTestDetails?.status?.toLowerCase();

        if (applicationStatus !== undefined) {
          appliedCount++;
        }

        if (applicationStatus === "under review") {
          underReviewCount++;
        }

        if (applicationStatus === "complete") {
          interviewedCount++;
        }

        if (litmusStatus !== "pending" && litmusStatus !== undefined) {
          litmusCompleteCount++;
        }

        if (litmusStatus === "completed") {
          enrolledCount++;
        }
      });

      setAppliedCount(appliedCount);
      setUnderReviewCount(underReviewCount);
      setInterviewedCount(interviewedCount);
      setLitmusCompleteCount(litmusCompleteCount);
      setEnrolledCount(enrolledCount);
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

  // Applications trend data
  const trendData = [
    { month: "Jan", applications: 45 },
    { month: "Feb", applications: 52 },
    { month: "Mar", applications: 48 },
    { month: "Apr", applications: 61 },
    { month: "May", applications: 55 },
    { month: "Jun", applications: 67 },
  ];

  return (
    <div className="space-y-6">
      {/* Application Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Application Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer
              style={{ marginLeft: "-15px" }}
              width="100%"
              height="100%"
            >
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="stage" type="category" width={100} />
                <Tooltip
                  formatter={(value) => [`${value}`]}
                  labelFormatter={() => ""}
                  contentStyle={{
                    color: "foreground",
                    background: "background",
                    border: "none",
                  }}
                />
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

      {/* Applications Trend */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Applications Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer style={{marginLeft: "-15px"}}  width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}`]} labelFormatter={() => ''} contentStyle={{ color: 'foreground', background: "background", border: "none"}}/>
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card> */}

      <ScholarshipDistribution applications={applications} />
    </div>
  );
}
