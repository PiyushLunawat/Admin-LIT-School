export interface ApplicationsListProps {
  applications: any;
  onApplicationSelect: (id: any) => void;
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
  onApplicationUpdate: () => void;
}

export type BadgeVariant =
  | "destructive"
  | "warning"
  | "secondary"
  | "success"
  | "onhold"
  | "pending"
  | "default";
