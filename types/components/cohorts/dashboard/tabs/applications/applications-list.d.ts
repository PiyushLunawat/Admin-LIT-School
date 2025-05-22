export type BadgeVariant =
  | "destructive"
  | "warning"
  | "secondary"
  | "success"
  | "lemon"
  | "pending"
  | "onhold"
  | "default";

export interface ApplicationsListProps {
  applications: any;
  onApplicationSelect: (id: any) => void;
  selectedIds: string[];
  onSelectedIdsChange: (ids: any[]) => void;
  onApplicationUpdate: () => void;
}
