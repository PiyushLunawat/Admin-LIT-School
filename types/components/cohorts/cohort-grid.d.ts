export interface Program {
  _id: string;
  name: string;
  description: string;
  duration: number;
  prefix: string;
  status: boolean;
}

export interface Centre {
  _id: string;
  name: string;
  location: string;
  suffix: string;
  status: boolean;
}

export type CohortStatus =
  | "Draft"
  | "Open"
  | "Full"
  | "Closed"
  | "Archived"
  | (string & {});

export type BadgeVariant =
  | "default"
  | "secondary"
  | "success"
  | "destructive"
  | "warning";

export interface Cohort {
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

export interface CohortGridProps {
  cohorts: Cohort[];
  onEditCohort: (cohort: Cohort) => void;
  onOpenDialog: () => void;
  onStatusChange: () => void;
}
