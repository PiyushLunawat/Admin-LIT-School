export interface CohortHeaderProps {
  cohortId: string;
  setDateRange: Dispatch<SetStateAction<DateRange | undefined>>;
}

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
