export type BadgeVariant =
  | "destructive"
  | "warning"
  | "secondary"
  | "success"
  | "default";

export interface PreviousMessageProps {
  type: string;
  status: string;
  date: string;
  time: string;
  recipient: string;
  subject: string;
  message: string;
}
