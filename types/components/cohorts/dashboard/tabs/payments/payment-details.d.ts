export type BadgeVariant =
  | "lemon"
  | "pending"
  | "warning"
  | "secondary"
  | "success"
  | "default";

export interface UploadState {
  uploading: boolean;
  uploadProgress: number;
  fileName: string;
}

export interface PaymentDetailsProps {
  student: any;
  onClose: () => void;
  onApplicationUpdate: () => void;
}
