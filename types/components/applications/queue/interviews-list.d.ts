export interface InterviewsListProps {
  applications: any;
  onApplicationSelect: (id: string) => void;
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
