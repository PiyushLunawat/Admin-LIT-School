export interface PaymentsFiltersProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  scholarship: any[];
  selectedScholarship: string;
  onScholarshipChange: (value: string) => void;
  selectedPaymentStatus: string;
  onPaymentStatusChange: (value: string) => void;
  selectedPaymentPlan: string;
  onPaymentPlanChange: (value: string) => void;
}
