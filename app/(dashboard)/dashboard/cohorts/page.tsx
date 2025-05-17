"use client";

import { getCohorts } from "@/app/api/cohorts";
import { CohortGrid } from "@/components/cohorts/cohort-grid";
import { CreateCohortContent } from "@/components/cohorts/create-cohort-content";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

type StepId =
  | "basic-details"
  | "application-form"
  | "litmus-test"
  | "fee-structure"
  | "fee-preview"
  | "collaborators";

export default function CohortsPage() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<StepId>("basic-details");
  const [editingCohort, setEditingCohort] = useState(null);
  const [activeCohorts, setActiveCohorts] = useState([]);
  const [archivedCohorts, setArchivedCohorts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCohorts = async () => {
    setIsLoading(true);
    try {
      const cohorts = await getCohorts();
      const active = cohorts.data.filter(
        (cohort: any) => cohort.status !== "Archived"
      );
      const archived = cohorts.data.filter(
        (cohort: any) => cohort.status === "Archived"
      );
      setActiveCohorts(active);
      setArchivedCohorts(archived);
    } catch (error) {
      console.error("Error fetching cohorts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCohorts(); // Initial load of cohorts
  }, []);

  const handleComplete = () => {
    setOpen(false);
    setCurrentStep("basic-details");
    setEditingCohort(null);
    // Refresh the cohorts list after completing an edit or creation
    fetchCohorts();
  };

  const handleEditCohort = (cohort: any) => {
    setEditingCohort(cohort);
    setCurrentStep("basic-details");
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  // Function to handle dialog close
  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      // Only reset if dialog is closing
      setCurrentStep("basic-details");
      setEditingCohort(null);
    }
    setOpen(isOpen);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Cohorts</h1>
        <Button
          onClick={() => {
            setEditingCohort(null);
            setCurrentStep("basic-details");
            setOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Cohort
        </Button>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Cohorts</TabsTrigger>
          <TabsTrigger value="archived">Archived Cohorts</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          {isLoading ? (
            <div className="w-full h-[calc(100vh-15rem)] flex items-center justify-center text-center text-muted-foreground border rounded-md">
              <div>Loading cohorts...</div>
            </div>
          ) : activeCohorts.length !== 0 ? (
            <CohortGrid
              cohorts={activeCohorts}
              onEditCohort={handleEditCohort}
              onOpenDialog={handleOpenDialog}
              onStatusChange={fetchCohorts}
            />
          ) : (
            <div className="w-full h-[calc(100vh-15rem)] flex items-center justify-center text-center text-muted-foreground border rounded-md">
              <div>All your Cohorts will appear here</div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="archived">
          {isLoading ? (
            <div className="w-full h-[calc(100vh-15rem)] flex items-center justify-center text-center text-muted-foreground border rounded-md">
              <div>Loading cohorts...</div>
            </div>
          ) : archivedCohorts.length !== 0 ? (
            <CohortGrid
              cohorts={archivedCohorts}
              onEditCohort={handleEditCohort}
              onOpenDialog={handleOpenDialog}
              onStatusChange={fetchCohorts}
            />
          ) : (
            <div className="w-full h-[calc(100vh-15rem)] flex items-center justify-center text-center text-muted-foreground border rounded-md">
              <div>All your archived cohorts will appear here</div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogTitle></DialogTitle>
        <DialogContent className="max-w-4xl">
          <CreateCohortContent
            currentStep={currentStep}
            onStepChange={(step) => setCurrentStep(step as StepId)}
            onComplete={handleComplete}
            editingCohort={editingCohort}
            fetchCohorts={fetchCohorts}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
