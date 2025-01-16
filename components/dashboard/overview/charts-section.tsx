"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Tooltip,
  Legend,
} from "recharts";
import { ScholarshipDistribution } from "./scholarship-distribution";
import { DateRange } from "react-day-picker";
import { useEffect, useState } from "react";
import { getStudents } from "@/app/api/student";


interface ChartsSectionProps {
  selectedDateRange: DateRange | undefined;
  searchQuery: string;
  selectedProgram: string;
  selectedCohort: string;
}
export function ChartsSection({ selectedDateRange, searchQuery, selectedProgram, selectedCohort }: ChartsSectionProps) {
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
          const validStudents = response.data.filter(
            (student: any) => student?.applicationDetails !== undefined
          );
  
          // 3) Filter Based on Date Range, Search Query, Program, Cohort
          const filteredApplications = validStudents.filter((app: any) => {
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
                ((app.firstName+' '+app.lastName) || "").toLowerCase().includes(lowerSearch) ||
                (app.program.name || "").toLowerCase().includes(lowerSearch) ||
                (app.program.name || "").toLowerCase().includes(lowerSearch);;
  
              if (!matchesSearch) return false;
            }
  
            // --- Program Check ---
            if (selectedProgram !== "all-programs") {
              // Suppose 'app.program' is how you store it
              if ((app.program.name || "").toLowerCase() !== selectedProgram.toLowerCase()) {
                return false;
              }
            }
  
            // --- Cohort Check ---
            if (selectedCohort !== "all-cohorts") {
              // Suppose 'app.cohort' is how you store it
              if ((app.program.name || "").toLowerCase() !== selectedCohort.toLowerCase()) {
                return false;
              }
            }
  
            return true;
          });
  
          // 4) Set Final Filtered Applications
          setApplications(filteredApplications);
          console.log("Students Fetched & Filtered:", filteredApplications);
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
            (application?.litmusTestDetails[0]?.litmusTaskId?.status?.toLowerCase() !== "pending" &&
            application?.litmusTestDetails[0]?.litmusTaskId?.status?.toLowerCase() !== undefined)
          );
          setLitmusCompleteCount(litmus.length);
    
          const enrolled = applications.filter(
            (application) =>
              application?.litmusTestDetails[0]?.litmusTaskId?.status?.toLowerCase() ===
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
            <ResponsiveContainer style={{marginLeft: "-15px"}} width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="stage" type="category" width={100} />
                <Tooltip formatter={(value) => [`${value}`]} labelFormatter={() => ''} contentStyle={{ color: 'foreground', background: "background", border: "none"}} />
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
      <Card>
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
      </Card>

      <ScholarshipDistribution />
      
    </div>
  );
}