export type BadgeVariant = "warning" | "success" | "pending" | "default";
interface UploadState {
  uploading: boolean;
  uploadProgress: number;
  fileName: string;
  error: string;
  flagOpen: boolean;
  reason: string;
}

export interface DocumentsTabProps {
  student: any;
  onUpdateStatus: () => void;
}
