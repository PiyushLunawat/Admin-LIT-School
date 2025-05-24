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

export interface CreateCohortDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCohort?: Cohort | null;
  fetchCohorts: () => void;
}
