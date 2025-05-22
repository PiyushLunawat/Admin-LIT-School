export interface LitmusTestFiltersProps {
  searchTerm: string;
  onSearchTermChange: Dispatch<SetStateAction<string>>;
  selectedStatus: string;
  onSelectedStatusChange: Dispatch<SetStateAction<string>>;
  sortBy: string;
  onSortByChange: Dispatch<SetStateAction<string>>;
}
