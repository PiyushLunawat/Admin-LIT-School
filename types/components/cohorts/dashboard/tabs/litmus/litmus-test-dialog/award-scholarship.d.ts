export type BadgeVariant =
  | "destructive"
  | "warning"
  | "secondary"
  | "success"
  | "default";

export interface AwardScholarshipProps {
  student: any;
  onClose?: () => void;
  onApplicationUpdate?: () => void;
}
