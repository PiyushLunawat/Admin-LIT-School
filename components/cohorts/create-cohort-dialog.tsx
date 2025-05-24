"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Cohort,
  CreateCohortDialogProps,
} from "@/types/components/cohorts/create-cohort-dialog";

const BasicDetailsForm = dynamic(
  () =>
    import("@/components/cohorts/steps/basic-details-form").then(
      (m) => m.BasicDetailsForm
    ),
  { ssr: false }
);

const ApplicationFormBuilder = dynamic(
  () =>
    import("@/components/cohorts/steps/application-form-builder").then(
      (m) => m.ApplicationFormBuilder
    ),
  { ssr: false }
);

const LitmusTestForm = dynamic(
  () =>
    import("@/components/cohorts/steps/litmus-test-form").then(
      (m) => m.LitmusTestForm
    ),
  { ssr: false }
);

const FeeStructureForm = dynamic(
  () =>
    import("@/components/cohorts/steps/fee-structure-form").then(
      (m) => m.FeeStructureForm
    ),
  { ssr: false }
);

const FeePreviewForm = dynamic(
  () =>
    import("@/components/cohorts/steps/fee-preview-form").then(
      (m) => m.FeePreviewForm
    ),
  { ssr: false }
);

const CollaboratorsForm = dynamic(
  () =>
    import("@/components/cohorts/steps/collaborators-form").then(
      (m) => m.CollaboratorsForm
    ),
  { ssr: false }
);

export function CreateCohortDialog({
  open,
  onOpenChange,
  editingCohort: initialEditingCohort,
  fetchCohorts,
}: CreateCohortDialogProps) {
  const [currentStep, setCurrentStep] = useState("basic-details");
  const [editingCohort, setEditingCohort] = useState<Cohort | null>(
    initialEditingCohort || null
  );

  const handleCohortCreated = (cohort: Cohort) => {
    setEditingCohort(cohort);
    fetchCohorts();
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
          <TabsList className="grid w-full grid-cols-6">
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
            <BasicDetailsForm
              onNext={() => setCurrentStep("application-form")}
              onCohortCreated={handleCohortCreated}
              initialData={editingCohort}
            />
          </TabsContent>
          <TabsContent value="application-form">
            <ApplicationFormBuilder
              onNext={() => setCurrentStep("litmus-test")}
              onCohortCreated={handleCohortCreated}
              initialData={editingCohort}
            />
          </TabsContent>
          <TabsContent value="litmus-test">
            <LitmusTestForm
              onNext={() => setCurrentStep("fee-structure")}
              onCohortCreated={handleCohortCreated}
              initialData={editingCohort}
            />
          </TabsContent>
          <TabsContent value="fee-structure">
            <FeeStructureForm
              onNext={() => setCurrentStep("fee-preview")}
              onCohortCreated={handleCohortCreated}
              initialData={editingCohort}
            />
          </TabsContent>
          <TabsContent value="fee-preview">
            <FeePreviewForm
              onNext={() => setCurrentStep("collaborators")}
              onCohortCreated={handleCohortCreated}
              initialData={editingCohort}
            />
          </TabsContent>
          <TabsContent value="collaborators">
            <CollaboratorsForm
              onComplete={() => onOpenChange(false)}
              onCohortCreated={handleCohortCreated}
              initialData={editingCohort}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
