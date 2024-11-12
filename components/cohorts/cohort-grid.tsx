"use client";

import { Download, Edit, Trash2, PlayCircle, ArrowRight, Archive, RotateCcw, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPrograms } from "@/app/api/programs";
import { getCentres } from "@/app/api/centres";
import { deleteCohort, updateCohortStatus } from "@/app/api/cohorts";

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

type CohortStatus = "Draft" | "Open" | "Full" | "Closed" | "Archived" | (string & {});
type BadgeVariant = "default" | "secondary" | "success" | "destructive" | "warning";

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
  isComplete: boolean;
}

interface CohortGridProps {
  cohorts: Cohort[];
  onEditCohort: (cohort: Cohort) => void;
  onOpenDialog: () => void;
  onStatusChange: () => void;
}

export function CohortGrid({ cohorts, onEditCohort, onOpenDialog, onStatusChange }: CohortGridProps) {
   const uniquePrograms = Array.from(new Set(cohorts.map((cohort) => cohort.programDetail))); // Extract unique programs
  const [activeProgram, setActiveProgram] = useState<string | null>(null); // Track selected program
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

  const getStatusColor = (status: CohortStatus): BadgeVariant => {
    switch (status) {
      case "Draft":
        return "secondary";
      case "Open":
        return "success";
      case "Full":
        return "warning";
      case "Closed":
        return "destructive";
      case "Archived":
        return "default";
      default:
        return "default";
    }
  };

  const router = useRouter();

  const handleAction = (cohortId: string, action: string) => {
    try {
      switch (action) {
        case "preview":
          router.push(`/dashboard/cohorts/${cohortId}/preview`);
          break;
        case "continue":
          const cohort = cohorts.find(c => c.cohortId === cohortId);
          if (cohort) {
            onEditCohort(cohort);
            onOpenDialog();
          }
          break;
        case "delete":
          // Delete functionality is handled by AlertDialog
          console.log("Deleting cohort:", cohortId);
          break;
        case "dashboard":
          router.push(`/dashboard/cohorts/${cohortId}`);
          break;
        case "archive":
          // Archive functionality is handled by AlertDialog
          console.log("Archiving cohort:", cohortId);
          break;
        case "begin-enrolment":
          // Begin enrolment functionality is handled by AlertDialog
          console.log("Beginning enrolment for cohort:", cohortId);
          router.push(`/dashboard/cohorts/${cohortId}/preview`);
          break;
        case "download":
          console.log("Download report for cohort:", cohortId);
          break;
        case "reopen":
          console.log("Reopening cohort:", cohortId);
          break;
        default:
          console.error("Unknown action:", action);
      }
    } catch (error) {
      console.error("Error handling action:", error);
    }
  };

  const renderActions = (cohort: Cohort) => {
    const handleUpdateStatus = async (cohortId: string, newStatus: CohortStatus) => {
      try {
        await updateCohortStatus(cohortId, newStatus);
        onStatusChange(); // Trigger the fetchCohorts function in CohortsPage after successful update
      } catch (error) {
        console.error("Failed to update cohort status:", error);
      }
    };

    switch (cohort.status) {
      case "Draft":
        return (
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              className="flex-1" 
              size="sm"
              onClick={() => handleAction(cohort.cohortId, "continue")}
            >
              <Edit className="h-4 w-4 mr-2" />
              {cohort.isComplete ? 'Edit' : 'Continue'}
            </Button>
            {cohort.isComplete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="default" 
                    className="flex-1" 
                    size="sm"
                  >
                    Begin Enrolment
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Begin Enrolment</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to begin enrolment for this cohort? This will make the cohort live and open for applications.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleUpdateStatus(cohort._id, "Open")}>
                      Begin Enrolment
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Cohort</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this cohort? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteCohort(cohort._id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );

      case "Open":
      case "Full":
        return (
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              className="flex-1" 
              size="sm"
              onClick={() => handleAction(cohort._id, "dashboard")}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                >
                  <Archive className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Archive Cohort</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to archive this cohort? This will move it to the archived section.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleUpdateStatus(cohort._id, "Archived")}>
                    Archive
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );

      case "Closed":
        return (
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              className="flex-1" 
              size="sm"
              onClick={() => handleUpdateStatus(cohort._id, "Open")}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reopen
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleAction(cohort.cohortId, "download")}
            >
              <Download className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                >
                  <Archive className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Archive Cohort</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to archive this cohort? Archived cohorts can be viewed in the archived section.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleUpdateStatus(cohort._id, "Archived")}>
                    Archive
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );

      case "Archived":
        return (
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              className="flex-1" 
              size="sm"
              onClick={() => handleUpdateStatus(cohort._id, "Open")}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reopen
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleAction(cohort.cohortId, "download")}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        );

      default:
        return (
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              className="flex-1" 
              size="sm"
              onClick={() => handleUpdateStatus(cohort._id, "Open")}
            >
              open {cohort._id}
            </Button>
          </div>
        )
    }
  };

  return (
    <Tabs defaultValue="all" className="space-y-4">
        <TabsList variant='ghost'>
          <TabsTrigger variant='xs' value="all">All ({cohorts.length})</TabsTrigger>
          {uniquePrograms.map((program) => (
          <TabsTrigger key={program} variant="xs" value={program}>
            {getProgramName(program)} ({cohorts.filter(cohort => cohort.programDetail === program).length})
          </TabsTrigger>
         ))}
        </TabsList>
        <TabsContent value="all">
        
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cohorts.map((cohort) => (
        <Card key={cohort.cohortId} className="flex flex-col h-[371px]">
          <CardHeader className="space-y-1 bg-[#64748B33] rounded-t-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">{cohort.cohortId}</p>
                <h3 className="font-semibold text-lg">{getProgramName(cohort.programDetail)}</h3>
              </div>
              <Badge variant={getStatusColor(cohort.status)}>{cohort.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4 mt-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">{getCentreName(cohort.centerDetail)}</p>
              <p className="text-sm text-muted-foreground">{cohort.schedule}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {new Date(cohort.startDate).toLocaleDateString()} - {new Date(cohort.endDate).toLocaleDateString()}
              </p>
              <p className="text-sm font-medium">{cohort.baseFee}</p>
            </div>
            {cohort.status !== "Draft" && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Seats Filled</span>
                  <span>{cohort.filledSeats.length}/{cohort.totalSeats}</span>
                </div>
                <Progress value={(cohort.filledSeats.length / cohort.totalSeats) * 100} />
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4">
            {renderActions(cohort)}
          </CardFooter>
        </Card>
      ))}
    </div>
    </TabsContent>
    {uniquePrograms.map((program) => (
        <TabsContent key={program} value={program}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cohorts
              .filter((cohort) => cohort.programDetail === program)
              .map((cohort) => (
                <Card key={cohort.cohortId} className="flex flex-col h-[371px]">
          <CardHeader className="space-y-1 bg-[#64748B33] rounded-t-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">{cohort.cohortId}</p>
                <h3 className="font-semibold text-lg">{getProgramName(cohort.programDetail)}</h3>
              </div>
              <Badge variant={getStatusColor(cohort.status)}>{cohort.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4 mt-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">{getCentreName(cohort.centerDetail)}</p>
              <p className="text-sm text-muted-foreground">{cohort.schedule}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {new Date(cohort.startDate).toLocaleDateString()} - {new Date(cohort.endDate).toLocaleDateString()}
              </p>
              <p className="text-sm font-medium">{cohort.baseFee}</p>
            </div>
            {cohort.status !== "Draft" && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Seats Filled</span>
                  <span>{cohort.filledSeats.length}/{cohort.totalSeats}</span>
                </div>
                <Progress value={(cohort.filledSeats.length / cohort.totalSeats) * 100} />
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4">
            {renderActions(cohort)}
          </CardFooter>
        </Card>
              ))}
          </div>
        </TabsContent>
      ))}
  </Tabs>
  );
}