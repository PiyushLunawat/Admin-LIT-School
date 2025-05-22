export type BadgeVariant =
  | "destructive"
  | "warning"
  | "secondary"
  | "success"
  | "pending"
  | "onhold"
  | "default";

export interface ApplicationsQueueProps {
  initialApplications: any;
  setInitialApplications: (apps: any) => void;
}
