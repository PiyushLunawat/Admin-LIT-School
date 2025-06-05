"use client";

import { ApplicationFormBuilder } from "@/components/cohorts/steps/application-form-builder";
import { BasicDetailsForm } from "@/components/cohorts/steps/basic-details-form";
import { CollaboratorsForm } from "@/components/cohorts/steps/collaborators-form";
import { FeePreviewForm } from "@/components/cohorts/steps/fee-preview-form";
import { FeeStructureForm } from "@/components/cohorts/steps/fee-structure-form";
import { LitmusTestForm } from "@/components/cohorts/steps/litmus-test-form";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  resetCohortState,
  setCohortData,
} from "@/lib/features/cohort/cohortSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useEffect, useState } from "react";

type StepId =
  | "basic-details"
  | "application-form"
  | "litmus-test"
  | "fee-structure"
  | "fee-preview"
  | "collaborators";

interface Step {
  id: StepId;
  label: string;
}

interface Cohort {
  _id: string;
  name: string;
  description: string;
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
  collaborators?: any[];
  applicationFormDetail?: any[];
  litmusTestDetail?: any[];
  feeStructureDetails?: any[];
  cohortFeesDetail?: any;
}

interface CreateCohortContentProps {
  currentStep: StepId;
  onStepChange: (step: StepId) => void;
  onComplete: () => void;
  editingCohort?: Cohort | null;
  fetchCohorts: () => void;
}

export function CreateCohortContent({
  currentStep,
  onStepChange,
  onComplete,
  editingCohort: initialEditingCohort,
  fetchCohorts,
}: CreateCohortContentProps) {
  const dispatch = useAppDispatch();
  const cohortState = useAppSelector((state) => state.cohort);

  const [editingCohort, setEditingCohort] = useState<Cohort | null>(
    initialEditingCohort || null
  );

  const steps: Step[] = [
    { id: "basic-details", label: "Basic Details" },
    { id: "application-form", label: "Application Form" },
    { id: "litmus-test", label: "LITMUS Test" },
    { id: "fee-structure", label: "Fee Structure" },
    { id: "fee-preview", label: "Fee Preview" },
    { id: "collaborators", label: "Collaborators" },
  ];

  // Initialize Redux state when editing cohort changes
  useEffect(() => {
    if (initialEditingCohort) {
      console.log("Initializing Redux with cohort data:", initialEditingCohort);
      dispatch(setCohortData(initialEditingCohort));
      setEditingCohort(initialEditingCohort);
    } else {
      // Reset Redux state for new cohort
      dispatch(resetCohortState());
      setEditingCohort(null);
    }
  }, [initialEditingCohort, dispatch]);

  // Enhanced cohort update handler
  const handleCohortCreated = (cohort: Cohort) => {
    console.log("Cohort updated:", cohort);

    if (!cohort._id || !cohort.cohortId) {
      console.warn("Invalid cohort data received");
      return;
    }

    // Update local state
    const updatedCohort = {
      ...editingCohort,
      ...cohort,
      _id: cohort._id,
      cohortId: cohort.cohortId,
    } as Cohort;

    setEditingCohort(updatedCohort);

    // Update Redux state
    dispatch(setCohortData(updatedCohort));

    // Refresh cohorts list
    fetchCohorts();
  };

  // Handle dialog close - reset state
  const handleComplete = () => {
    dispatch(resetCohortState());
    setEditingCohort(null);
    onComplete();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {editingCohort
            ? `Edit Cohort: ${editingCohort.cohortId}`
            : "Create New Cohort"}
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
          <BasicDetailsForm
            onNext={() => onStepChange("application-form")}
            onCohortCreated={handleCohortCreated}
            initialData={editingCohort}
          />
        </TabsContent>
        <TabsContent value="application-form">
          <ApplicationFormBuilder
            onNext={() => onStepChange("litmus-test")}
            onCohortCreated={handleCohortCreated}
            initialData={editingCohort}
          />
        </TabsContent>
        <TabsContent value="litmus-test">
          <LitmusTestForm
            onNext={() => onStepChange("fee-structure")}
            onCohortCreated={handleCohortCreated}
            initialData={editingCohort}
          />
        </TabsContent>
        <TabsContent value="fee-structure">
          <FeeStructureForm
            onNext={() => onStepChange("fee-preview")}
            onCohortCreated={handleCohortCreated}
            initialData={editingCohort}
          />
        </TabsContent>
        <TabsContent value="fee-preview">
          <FeePreviewForm
            onNext={() => onStepChange("collaborators")}
            onCohortCreated={handleCohortCreated}
            initialData={editingCohort}
          />
        </TabsContent>
        <TabsContent value="collaborators">
          <CollaboratorsForm
            onComplete={handleComplete}
            onCohortCreated={handleCohortCreated}
            initialData={editingCohort}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
