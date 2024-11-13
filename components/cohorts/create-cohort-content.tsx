"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BasicDetailsForm } from "@/components/cohorts/steps/basic-details-form";
import { ApplicationFormBuilder } from "@/components/cohorts/steps/application-form-builder";
import { LitmusTestForm } from "@/components/cohorts/steps/litmus-test-form";
import { FeeStructureForm } from "@/components/cohorts/steps/fee-structure-form";
import { FeePreviewForm } from "@/components/cohorts/steps/fee-preview-form";
import { CollaboratorsForm } from "@/components/cohorts/steps/collaborators-form";


type StepId = "basic-details" | "application-form" | "litmus-test" | "fee-structure" | "fee-preview" | "collaborators";

interface Step {
  id: StepId;
  label: string;
}

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

interface CreateCohortContentProps {
  currentStep: StepId;
  onStepChange: (step: StepId) => void;
  onComplete: () => void;
  editingCohort?: Cohort | null;
}

export function CreateCohortContent({
  currentStep,
  onStepChange,
  onComplete,
  editingCohort,
}: CreateCohortContentProps) {
  const steps: Step[] = [
    { id: "basic-details", label: "Basic Details" },
    { id: "application-form", label: "Application Form" },
    { id: "litmus-test", label: "LITMUS Test" },
    { id: "fee-structure", label: "Fee Structure" },
    { id: "fee-preview", label: "Fee Preview" },
    { id: "collaborators", label: "Collaborators" },
  ];
  console.log("dfsd",editingCohort)

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {editingCohort ? `Edit Cohort: ${editingCohort.cohortId}` : "Create New Cohort"}
        </DialogTitle>
      </DialogHeader>
      <Tabs value={currentStep} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          {steps.map((step) => (
            <TabsTrigger
              key={step.id}
              value={step.id}
              onClick={() => onStepChange(step.id)}
            >
              {step.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="basic-details">
          <BasicDetailsForm onNext={() => onStepChange("application-form")} initialData={editingCohort}/>
        </TabsContent>
        <TabsContent value="application-form">
          <ApplicationFormBuilder onNext={() => onStepChange("litmus-test")} initialData={editingCohort}/>
        </TabsContent>
        <TabsContent value="litmus-test">
          <LitmusTestForm onNext={() => onStepChange("fee-structure")} initialData={editingCohort}/>
        </TabsContent>
        <TabsContent value="fee-structure">
          <FeeStructureForm onNext={() => onStepChange("fee-preview")} initialData={editingCohort}/>
        </TabsContent>
        <TabsContent value="fee-preview">
          <FeePreviewForm onNext={() => onStepChange("collaborators")} initialData={editingCohort}/>
        </TabsContent>
        <TabsContent value="collaborators">
          <CollaboratorsForm onComplete={onComplete} initialData={editingCohort}/>
        </TabsContent>
      </Tabs>
    </>
  );
}