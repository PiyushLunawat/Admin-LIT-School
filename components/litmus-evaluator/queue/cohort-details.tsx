"use client";

import { getCentres } from "@/app/api/centres";
import { getPrograms } from "@/app/api/programs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface CohortDetailsProps {
  cohort: any;
  applied: number;
  intCleared: number;
  feePaid: number;
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

export function CohortDetails({
  cohort,
  applied,
  intCleared,
  feePaid,
}: CohortDetailsProps) {
  //   const [cohort, setCohort] = useState<any>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [centres, setCentres] = useState<Centre[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const programsData = await getPrograms();
        setPrograms(programsData.data);
        const centresData = await getCentres();
        setCentres(centresData.data);
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

  //   useEffect(() => {
  //     async function fetchCohort() {
  //       try {
  //         const cohortData = await getCohortById(cohort);
  //         setCohort(cohortData.data);
  //       } catch (error) {
  //         console.error("Failed to fetch cohort:", error);
  //       }
  //     }

  //     fetchCohort();
  //   }, [cohort]);

  if (!cohort) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex justify-center items-center h-full">
          <LoaderCircle className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-2 border-b">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {getProgramName(cohort.programDetail)}
              </h2>
              <Badge
                variant={cohort.status === "Open" ? "success" : "secondary"}
              >
                {cohort.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Cohort ID: {cohort.cohortId}
            </p>
            <p className="text-sm font-medium">
              {getCentreName(cohort.centerDetail)}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Schedule</p>
            {/* <p className="font-medium">{cohort?.schedule}</p> */}
            <p className="text-sm">
              {new Date(cohort.startDate).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}{" "}
              -{" "}
              {new Date(cohort.endDate).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <p className="">Seats Progress</p>
              <span>
                {feePaid}/{cohort.totalSeats}
              </span>
            </div>
            <Progress
              states={[
                {
                  value: feePaid,
                  widt: (feePaid / cohort.totalSeats) * 100,
                  color: "#2EB88A",
                },
                {
                  value: intCleared,
                  widt: (intCleared / cohort.totalSeats) * 100,
                  color: "#00A3FF",
                },
                {
                  value: applied,
                  widt:
                    ((applied - intCleared - feePaid) / cohort.totalSeats) *
                    100,
                  color: "#FF791F",
                },
              ]}
            />
            <div className="flex gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-[#2EB88A] rounded-full"></div>
                <span className="text-xs text-muted-foreground">
                  Admission Fee Paid
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-[#00A3FF] rounded-full"></div>
                <span className="text-xs text-muted-foreground">
                  Interview Cleared
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-[#FF791F] rounded-full"></div>
                <span className="text-xs text-muted-foreground">Applied</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
