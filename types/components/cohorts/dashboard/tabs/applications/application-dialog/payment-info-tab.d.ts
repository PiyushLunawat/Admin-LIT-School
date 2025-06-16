export type BadgeVariant =
  | "onhold"
  | "pending"
  | "warning"
  | "secondary"
  | "success"
  | "default";

export interface UploadState {
  uploading: boolean;
  uploadProgress: number;
  fileName: string;
  error: string;
  flagOpen: boolean;
  reason: string;
}

export interface PaymentInformationTabProps {
  student: any;
  onUpdateStatus: () => void;
}
