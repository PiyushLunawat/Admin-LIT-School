export type BadgeVariant =
  | "destructive"
  | "onhold"
  | "pending"
  | "success"
  | "lemon"
  | "default";

export interface LitmusTestListProps {
  applications: any;
  onSubmissionSelect: (id: any) => void;
  selectedIds: any[];
  onApplicationUpdate: () => void;
  onSelectedIdsChange: (ids: any[]) => void;
}
