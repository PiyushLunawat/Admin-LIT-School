export type BadgeVariant =
  | "destructive"
  | "warning"
  | "secondary"
  | "success"
  | "pending"
  | "onhold"
  | "default";

export interface LitmusTestDetailsProps {
  application: any;
  onClose: () => void;
  onApplicationUpdate: () => void;
}
