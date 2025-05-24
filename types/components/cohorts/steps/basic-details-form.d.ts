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

export interface Cohort {
  id: string;
  programDetail: string;
  centerDetail: string;
  startDate: string;
  endDate: string;
  seats: number;
  filled: number;
  status: "Draft" | "Open" | "Full" | "Closed" | "Archived";
  baseFee: string;
  isComplete: boolean;
}

export interface BasicDetailsFormProps {
  onNext: () => void;
  onCohortCreated: (cohort: any) => void;
  initialData?: any;
}
