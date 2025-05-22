export type BadgeVariant =
  | "destructive"
  | "warning"
  | "secondary"
  | "success"
  | "default";
interface Alert {
  id: string;
  type: "interview" | "evaluation" | "payment";
  message: string;
  priority: "high" | "medium" | "low";
}

export interface AlertsSectionProps {
  cohortId: string;
}
