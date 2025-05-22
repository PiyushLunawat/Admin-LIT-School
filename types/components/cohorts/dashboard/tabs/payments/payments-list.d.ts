export type BadgeVariant =
  | "pending"
  | "warning"
  | "secondary"
  | "success"
  | "default"
  | "destructive";

export interface PaymentRecord {
  id: string;
  studentName: string;
  paymentPlan: "One-Shot" | "Instalments";
  tokenPaid: boolean;
  instalmentsPaid: number;
  totalInstalments: number;
  dueDate?: string;
  status: string;
  scholarship?: string;
}

export interface PaymentsListProps {
  applications: any[];
  onStudentSelect: (id: any) => void;
  selectedIds: any[];
  onApplicationUpdate: () => void;
  onSelectedIdsChange: (ids: any[]) => void;
}
