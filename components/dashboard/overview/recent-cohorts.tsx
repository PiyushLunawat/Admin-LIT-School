"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Users, MessageSquare, PlayCircle, LayoutDashboard } from "lucide-react";
import { getCohorts } from "@/app/api/cohorts";
import { useEffect, useState } from "react";
import { getPrograms } from "@/app/api/programs";
import { getCentres } from "@/app/api/centres";
import { useRouter } from "next/navigation";

type BadgeVariant = "destructive" | "warning" | "secondary" | "success" | "default";
type CohortStatus = "Draft" | "Open" | "Full" | "Closed" | "Archived" | (string & {});

interface Cohort {
  _id: string;
  cohortId: string;
  programDetail: string;
  centerDetail: string;
  startDate: string;
  endDate: string;
  schedule: string;
  totalSeats: number;
  filledSeats: [];
  status: CohortStatus;
  baseFee: string;
  collaborators: [];
}

export function RecentCohorts() {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);  
  const [centres, setCentres] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const cohortsData = await getCohorts();
        setCohorts(cohortsData.data);
        const programsData = await getPrograms();
        setPrograms(programsData.data);
        const centresData = await getCentres();
        setCentres(centresData.data);
      } catch (error) {
        console.error("Error fetching filter data:", error);
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

  
  const getStatusColor = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "open":
        return "success";
      case "full":
        return "warning";
      case "closed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Cohorts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cohorts.slice().reverse().slice(0, 3).map((cohort) => (
          <div
            key={cohort._id}
            className="flex flex-col space-y-4 p-4 border rounded-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{getProgramName(cohort?.programDetail)}</h3>
                <p className="text-sm text-muted-foreground">{getCentreName(cohort.centerDetail)}</p>
              </div>
              <Badge variant={getStatusColor(cohort.status)}>
                {cohort.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Schedule</p>
                <p>{cohort.schedule}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Duration</p>
                <p>
                  {new Date(cohort.startDate).toLocaleDateString()} - {new Date(cohort.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Seats Filled</span>
                <span>
                  {cohort.filledSeats.length}/{cohort.totalSeats}
                </span>
              </div>
              <Progress
                states={[
                  { value: cohort.filledSeats.length, widt:((cohort.filledSeats.length / cohort.filledSeats.length) * 100), color:'#2EB88A' } 
                ]}
                className="h-2"
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => router.push(`/dashboard/cohorts/${cohort._id}`)}>
                <LayoutDashboard className="h-4 w-4 mr-2" />
                View Dashboard
              </Button>
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}