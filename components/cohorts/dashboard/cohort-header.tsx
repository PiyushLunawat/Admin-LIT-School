"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Download, Mail, MessageSquare } from "lucide-react";
import { DateRangePicker } from "@/components/dashboard/overview/date-range-picker";
import { getCohortById } from "@/app/api/cohorts";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getPrograms } from "@/app/api/programs";
import { getCentres } from "@/app/api/centres";
import { getStudents } from "@/app/api/student";
import { DateRange } from "react-day-picker";

interface CohortHeaderProps {
  cohortId: string;
  setDateRange: Dispatch<SetStateAction<DateRange | undefined>>;
}

interface Program {
  _id: string;
  name: string;
  description: string;
  duration: number;
  prefix: string;
  status: boolean;
}

interface Centre {
  _id: string;
  name: string;
  location: string;
  suffix: string;
  status: boolean;
}

export function CohortHeader({ cohortId, setDateRange }: CohortHeaderProps) {
  const [cohort, setCohort] = useState<any>(null);
  const [applied, setApplied] = useState(0);
  const [intCleared, setIntCleared] = useState(0);
  const [feePaid, setFeePaid] = useState(0);
  const [programs, setPrograms] = useState<Program[]>([]);  
  const [centres, setCentres] = useState<Centre[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const programsData = await getPrograms();
        setPrograms(programsData.data);
        const centresData = await getCentres();
        setCentres(centresData.data);

        const response = await getStudents();
        const mappedStudents =
        response.data.filter(
          (student: any) =>
            student?.applicationDetails !== undefined &&
            student.cohort?._id === cohortId
        )    
            setApplied(
              mappedStudents.filter(
                (student: any) => student?.applicationDetails?.applicationFeeDetail?.status === 'paid'
              ).length
            );
            
            setIntCleared(
              mappedStudents.filter(
                (student: any) => student?.applicationDetails?.applicationStatus === 'selected'
              ).length
            );

            setFeePaid(
              mappedStudents.filter(
                (student: any) => student?.cousrseEnrolled?.[student.cousrseEnrolled?.length - 1]?.tokenFeeDetails?.verificationStatus === 'paid'
              ).length
            );       
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    }
    fetchData();
  }, []);

  const getProgramName = (programId: string) => {
    const program = programs.find((p) => p._id === programId);
    return program ? program.name : "Unknown Program";
  };

  const getCentreName = (centreId: string) => {
    const centre = centres.find((c) => c._id === centreId);
    return centre ? centre.name : "Unknown Centre";
  };

  useEffect(() => {
    async function fetchCohort() {
      try {
        const cohortData = await getCohortById(cohortId);
        setCohort(cohortData.data);
      } catch (error) {
        console.error("Failed to fetch cohort:", error);
      }
    }

    fetchCohort();
  }, [cohortId]);

  if (!cohort) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading cohort details...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-2 border-b">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{getProgramName(cohort.programDetail)}</h2>
              <Badge variant={cohort.status === "Open" ? "success" : "secondary"}>
                {cohort.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Cohort ID: {cohort.cohortId}</p>
            <p className="text-sm font-medium">{getCentreName(cohort.centerDetail)}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Schedule</p>
            <p className="font-medium">{cohort.schedule}</p>
            <p className="text-sm">
              {new Date(cohort.startDate).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })} - {" "}
              {new Date(cohort.endDate).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <p className="">Seats Progress</p>
              <span>{feePaid}/{cohort.totalSeats}</span>
            </div>
            <Progress
              states={[
                { value: feePaid, widt: (feePaid / cohort.totalSeats) * 100, color: '#2EB88A' },
                { value: intCleared, widt: ((intCleared) / cohort.totalSeats) * 100, color: '#00A3FF' },
                { value: applied, widt: ((applied-intCleared-feePaid) / cohort.totalSeats) * 100, color: '#FF791F' },
              ]}
            />
              <div className="flex gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-[#2EB88A] rounded-full"></div>
                  <span className="text-xs text-muted-foreground">Admission Fee Paid</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-[#00A3FF] rounded-full"></div>
                  <span className="text-xs text-muted-foreground">Interview Cleared</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-[#FF791F] rounded-full"></div>
                  <span className="text-xs text-muted-foreground">Applied</span>
                </div>
              </div>

          </div>
        </div>
        <div className="pt-4">
        <DateRangePicker setDateRange={setDateRange} />
        </div>
      </CardContent>
    </Card>
  );
}