export type BadgeVariant =
  | "destructive"
  | "warning"
  | "secondary"
  | "success"
  | "default";
interface CommunicationLogProps {
  cohortId: string;
}

export interface Message {
  id: string;
  date: string;
  time: string;
  recipients: string;
  subject: string;
  message: string;
  type: string;
  status: string;
}
