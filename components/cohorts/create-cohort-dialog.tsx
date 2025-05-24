"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicDetailsForm } from "@/components/cohorts/steps/basic-details-form";
import { ApplicationFormBuilder } from "@/components/cohorts/steps/application-form-builder";
import { LitmusTestForm } from "@/components/cohorts/steps/litmus-test-form";
import { FeeStructureForm } from "@/components/cohorts/steps/fee-structure-form";
import { FeePreviewForm } from "@/components/cohorts/steps/fee-preview-form";
import { CollaboratorsForm } from "@/components/cohorts/steps/collaborators-form";

interface Cohort {
  _id: string;
  programDetail: string;
  centerDetail: string;
  cohortId: string;
  startDate: string;
  endDate: string;
  schedule: string;
  seats: number;
  filled: number;
  status: "Draft" | "Open" | "Full" | "Closed" | "Archived";
  baseFee: string;
  isComplete: boolean;
}
interface CreateCohortDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCohort?: Cohort | null;
  fetchCohorts: () => void; 
}

export function CreateCohortDialog({ open, onOpenChange, editingCohort: initialEditingCohort,
  fetchCohorts,
   }: CreateCohortDialogProps) {
  const [currentStep, setCurrentStep] = useState("basic-details");
  const [editingCohort, setEditingCohort] = useState<Cohort | null>(initialEditingCohort || null);

  const handleCohortCreated = (cohort: Cohort) => {
    setEditingCohort(cohort); 
    fetchCohorts();
    console.log("111",editingCohort)
  };

  const steps = [
    { id: "basic-details", label: "Basic Details" },
    { id: "application-form", label: "Application Form" },
    { id: "litmus-test", label: "LITMUS Test" },
    { id: "fee-structure", label: "Fee Structure" },
    { id: "fee-preview", label: "Fee Preview" },
    { id: "collaborators", label: "Collaborators" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create New Cohort</DialogTitle>
        </DialogHeader>
        <Tabs value={currentStep} className="w-full">
          <TabsList className="w-full flex-nowrap flex overflow-x-auto scrollbar-hide space-x-2 pl-40 sm:pl-0">
            {steps.map((step) => (
              <TabsTrigger
                key={step.id}
                value={step.id}
                onClick={() => setCurrentStep(step.id)}
              >
                {step.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="basic-details">
            <BasicDetailsForm onNext={() => setCurrentStep("application-form")} onCohortCreated={handleCohortCreated} initialData={editingCohort} />
          </TabsContent>
          <TabsContent value="application-form">
            <ApplicationFormBuilder onNext={() => setCurrentStep("litmus-test")} onCohortCreated={handleCohortCreated} initialData={editingCohort}/>
          </TabsContent>
          <TabsContent value="litmus-test">
            <LitmusTestForm onNext={() => setCurrentStep("fee-structure")} onCohortCreated={handleCohortCreated} initialData={editingCohort}/>
          </TabsContent>
          <TabsContent value="fee-structure">
            <FeeStructureForm onNext={() => setCurrentStep("fee-preview")} onCohortCreated={handleCohortCreated} initialData={editingCohort}/>
          </TabsContent>
          <TabsContent value="fee-preview">
            <FeePreviewForm onNext={() => setCurrentStep("collaborators")} onCohortCreated={handleCohortCreated} initialData={editingCohort}/>
          </TabsContent>
          <TabsContent value="collaborators">
            <CollaboratorsForm onComplete={() => onOpenChange(false)} onCohortCreated={handleCohortCreated} initialData={editingCohort} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}