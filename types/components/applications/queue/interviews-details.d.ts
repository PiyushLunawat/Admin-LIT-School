export interface InterviewsFiltersProps {
  setDateRange: Dispatch<SetStateAction<DateRange | undefined>>;
  searchQuery: string;
  onSearchQueryChange: Dispatch<SetStateAction<string>>;
  cohorts: any[];
  selectedCohort: string;
  onCohortChange: (value: string) => void;
  selectedStatus: string;
  onSelectedStatusChange: Dispatch<SetStateAction<string>>;
  sortBy: string;
  onSortByChange: Dispatch<SetStateAction<string>>;
}
