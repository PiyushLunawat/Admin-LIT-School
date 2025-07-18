"use client";

import { getCentres } from "@/app/api/centres";
import { deleteCohort, updateCohortStatus } from "@/app/api/cohorts";
import { getPrograms } from "@/app/api/programs";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { formatAmount } from "@/lib/utils/helpers";
import {
  Archive,
  ArrowRight,
  Edit,
  LayoutDashboard,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

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

type CohortStatus =
  | "Draft"
  | "Open"
  | "Full"
  | "Closed"
  | "Archived"
  | (string & {});
type BadgeVariant =
  | "default"
  | "secondary"
  | "success"
  | "destructive"
  | "warning";

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

interface CohortGridProps {
  cohorts: Cohort[];
  onEditCohort: (cohort: Cohort) => void;
  onOpenDialog: () => void;
  onStatusChange: () => void;
}

export function CohortGrid({
  cohorts,
  onEditCohort,
  onOpenDialog,
  onStatusChange,
}: CohortGridProps) {
  const { toast } = useToast();
  const uniquePrograms = Array.from(
    new Set(cohorts.map((cohort) => cohort.programDetail))
  );
  const [programs, setPrograms] = useState<Program[]>([]);
  const [centres, setCentres] = useState<Centre[]>([]);
  const [isCohortComplete, setIsCohortComplete] = useState(false);

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
          const cohort = cohorts.find((c) => c.cohortId === cohortId);
          if (cohort) {
            onEditCohort(cohort);
            onOpenDialog();
          }
          break;
        case "delete":
          // Delete functionality is handled by AlertDialog
          // console.log("Deleting cohort:", cohortId);
          break;
        case "dashboard":
          router.push(`/dashboard/cohorts/${cohortId}`);
          break;
        case "archive":
          // Archive functionality is handled by AlertDialog
          // console.log("Archiving cohort:", cohortId);
          break;
        case "begin-enrolment":
          // Begin enrolment functionality is handled by AlertDialog
          // console.log("Beginning enrolment for cohort:", cohortId);
          // router.push(`/dashboard/cohorts/${cohortId}/preview`);
          break;
        case "download":
          // console.log("Download report for cohort:", cohortId);
          break;
        case "reopen":
          // console.log("Reopening cohort:", cohortId);
          break;
        default:
          console.error("Unknown action:", action);
      }
    } catch (error) {
      console.error("Error handling action:", error);
    }
  };

  const renderActions = (cohort: Cohort) => {
    const handleUpdateStatus = async (
      cohortId: string,
      newStatus: CohortStatus
    ) => {
      try {
        await updateCohortStatus(cohortId, newStatus);
        onStatusChange();
      } catch (error) {
        console.error("Failed to update cohort status:", error);
      }
    };

    const handleDeleteCohort = async (cohortId: string) => {
      try {
        await deleteCohort(cohortId);
        onStatusChange();
        toast({ title: "Cohort deleted successfully!", variant: "success" });
      } catch (error: any) {
        console.error("Failed to delete cohort:", error);
        toast({
          title: "Failed to delete cohort",
          description: error,
          variant: "destructive",
        });
      }
    };

    function checkIfCohortDataIsEmpty(cohort: any) {
      const {
        applicationFormDetail,
        collaborators,
        feeStructureDetails,
        litmusTestDetail,
        cohortFeesDetail,
      } = cohort || {};

      const isApplicationFormEmpty =
        !applicationFormDetail || applicationFormDetail.length === 0;
      const isCollaboratorsEmpty = !collaborators || collaborators.length === 0;
      const isFeeStructureEmpty =
        !feeStructureDetails || feeStructureDetails.length === 0;
      const isLitmusTestEmpty =
        !litmusTestDetail || litmusTestDetail.length === 0;
      const isCohortFeesDetailEmpty =
        !cohortFeesDetail || Object.keys(cohortFeesDetail).length === 0;

      return (
        isApplicationFormEmpty &&
        isCollaboratorsEmpty &&
        isFeeStructureEmpty &&
        isLitmusTestEmpty &&
        isCohortFeesDetailEmpty
      );
    }

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
              {!checkIfCohortDataIsEmpty(cohort) ? "Edit" : "Continue"}
            </Button>
            {!checkIfCohortDataIsEmpty(cohort) && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="default" className="flex-1" size="sm">
                    Begin Enrolment
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Begin Enrolment</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to begin enrolment for this cohort?
                      This will make the cohort live and open for applications.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleUpdateStatus(cohort._id, "Open")}
                    >
                      Begin Enrolment
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Cohort</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this cohort? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      handleDeleteCohort(cohort._id);
                    }}
                  >
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
            {
              // cohort.filledSeats.length < 1 &&
              <Button
                variant="outline"
                className="px-4"
                size="sm"
                onClick={() => handleAction(cohort.cohortId, "continue")}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            }
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
                <Button variant="ghost" size="sm">
                  <Archive className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Archive Cohort</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to archive this cohort? This will move
                    it to the archived section.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleUpdateStatus(cohort._id, "Archived")}
                  >
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Archive className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Archive Cohort</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to archive this cohort? Archived
                    cohorts can be viewed in the archived section.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleUpdateStatus(cohort._id, "Archived")}
                  >
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
        );
    }
  };

  return (
    <Tabs defaultValue="all" className="space-y-4">
      <TabsList
        variant="ghost"
        className="w-full sm:w-fit flex-nowrap flex overflow-x-auto scrollbar-hide space-x-2 pl-72 sm:pl-0"
      >
        <TabsTrigger variant="xs" value="all">
          All ({cohorts.length})
        </TabsTrigger>
        {uniquePrograms.map((program) => (
          <TabsTrigger key={program} variant="xs" value={program}>
            {getProgramName(program)} (
            {
              cohorts.filter((cohort) => cohort.programDetail === program)
                .length
            }
            )
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="all">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cohorts.map((cohort) => (
            <Card key={cohort.cohortId} className="flex flex-col h-[371px]">
              <CardHeader
                className="space-y-1 bg-[#64748B33] rounded-t-lg cursor-pointer"
                onClick={() => handleAction(cohort._id, "dashboard")}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {cohort.cohortId}
                    </p>
                    <h3 className="font-semibold text-lg">
                      {getProgramName(cohort.programDetail)}
                    </h3>
                  </div>
                  <Badge variant={getStatusColor(cohort.status)}>
                    {cohort.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent
                className="flex-1 space-y-4 mt-4 cursor-pointer"
                onClick={() => handleAction(cohort._id, "dashboard")}
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {getCentreName(cohort.centerDetail)}
                  </p>
                  {/* <p className="text-sm text-muted-foreground">{cohort?.schedule}</p> */}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {new Date(cohort.startDate).toLocaleDateString()} -{" "}
                    {new Date(cohort.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-medium">
                    ₹{formatAmount(Number(cohort.baseFee))}
                  </p>
                </div>
                {cohort.status !== "Draft" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Seats Filled</span>
                      <span>
                        {cohort.filledSeats.length}/{cohort.totalSeats}
                      </span>
                    </div>
                    <Progress
                      states={[
                        {
                          value: cohort.filledSeats.length,
                          widt:
                            (cohort.filledSeats.length / cohort.totalSeats) *
                            100,
                          color: "#2EB88A",
                        },
                      ]}
                    />
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
                        <p className="text-sm text-muted-foreground">
                          {cohort.cohortId}
                        </p>
                        <h3 className="font-semibold text-lg">
                          {getProgramName(cohort.programDetail)}
                        </h3>
                      </div>
                      <Badge variant={getStatusColor(cohort.status)}>
                        {cohort.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4 mt-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {getCentreName(cohort.centerDetail)}
                      </p>
                      {/* <p className="text-sm text-muted-foreground">{cohort?.schedule}</p> */}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {new Date(cohort.startDate).toLocaleDateString()} -{" "}
                        {new Date(cohort.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm font-medium">
                        ₹{formatAmount(Number(cohort.baseFee))}
                      </p>
                    </div>
                    {cohort.status !== "Draft" && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Seats Filled</span>
                          <span>
                            {cohort.filledSeats.length}/{cohort.totalSeats}
                          </span>
                        </div>
                        <Progress
                          states={[
                            {
                              value: cohort.filledSeats.length,
                              widt:
                                (cohort.filledSeats.length /
                                  cohort.totalSeats) *
                                100,
                              color: "#2EB88A",
                            },
                          ]}
                        />
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
