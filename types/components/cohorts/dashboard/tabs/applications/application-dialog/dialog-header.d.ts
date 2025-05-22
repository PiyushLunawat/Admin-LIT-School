export type BadgeVariant =
  | "destructive"
  | "warning"
  | "secondary"
  | "success"
  | "default";

export interface StudentHeaderProps {
  student: any;
  onUpdateStatus: () => void;
}
