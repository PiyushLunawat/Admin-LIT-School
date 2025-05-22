export type BadgeVariant = "warning" | "success" | "pending" | "default";
interface UploadState {
  uploading: boolean;
  uploadProgress: number;
  fileName: string;
}

export interface DocumentsTabProps {
  student: any;
  onUpdateStatus: () => void;
}
