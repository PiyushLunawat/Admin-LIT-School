"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Cohort,
  CreateCohortContentProps,
  Step,
} from "@/types/components/cohorts/create-cohort-content";

const BasicDetailsForm = dynamic(
  () =>
    import("@/components/cohorts/steps/basic-details-form").then(
      (m) => m.BasicDetailsForm
    ),
  {
    ssr: false,
  }
);

const ApplicationFormBuilder = dynamic(
  () =>
    import("@/components/cohorts/steps/application-form-builder").then(
      (m) => m.ApplicationFormBuilder
    ),
  {
    ssr: false,
  }
);

const LitmusTestForm = dynamic(
  () =>
    import("@/components/cohorts/steps/litmus-test-form").then(
      (m) => m.LitmusTestForm
    ),
  {
    ssr: false,
  }
);

const FeeStructureForm = dynamic(
  () =>
    import("@/components/cohorts/steps/fee-structure-form").then(
      (m) => m.FeeStructureForm
    ),
  {
    ssr: false,
  }
);

const FeePreviewForm = dynamic(
  () =>
    import("@/components/cohorts/steps/fee-preview-form").then(
      (m) => m.FeePreviewForm
    ),
  {
    ssr: false,
  }
);

const CollaboratorsForm = dynamic(
  () =>
    import("@/components/cohorts/steps/collaborators-form").then(
      (m) => m.CollaboratorsForm
    ),
  {
    ssr: false,
  }
);

export function CreateCohortContent({
  currentStep,
  onStepChange,
  onComplete,
  editingCohort: initialEditingCohort,
  fetchCohorts,
}: CreateCohortContentProps) {
  const [editingCohort, setEditingCohort] = useState<Cohort | null>(
    initialEditingCohort || null
  );

  const handleCohortCreated = (cohort: Cohort) => {
    setEditingCohort(cohort);
    fetchCohorts();
  };

  const steps: Step[] = [
    { id: "basic-details", label: "Basic Details" },
    { id: "application-form", label: "Application Form" },
    { id: "litmus-test", label: "LITMUS Test" },
    { id: "fee-structure", label: "Fee Structure" },
    { id: "fee-preview", label: "Fee Preview" },
    { id: "collaborators", label: "Collaborators" },
  ];

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
            onCohortCreated={handleCohortCreated} // Pass the callback to handle cohort creation
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
            onComplete={onComplete}
            onCohortCreated={handleCohortCreated}
            initialData={editingCohort}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
