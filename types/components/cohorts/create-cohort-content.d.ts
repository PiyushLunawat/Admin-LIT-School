export type StepId =
  | "basic-details"
  | "application-form"
  | "litmus-test"
  | "fee-structure"
  | "fee-preview"
  | "collaborators";

export interface Step {
  id: StepId;
  label: string;
}

export interface Cohort {
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

export interface CreateCohortContentProps {
  currentStep: StepId;
  onStepChange: (step: StepId) => void;
  onComplete: () => void;
  editingCohort?: Cohort | null;
  fetchCohorts: () => void;
}
