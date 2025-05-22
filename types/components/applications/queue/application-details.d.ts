export type BadgeVariant =
  | "destructive"
  | "warning"
  | "secondary"
  | "success"
  | "pending"
  | "onhold"
  | "default";

export interface ApplicationDetailsProps {
  application: any;
  onClose: () => void;
  onApplicationUpdate: () => void;
}
