export interface ReviewComponentProps {
  application: any;
  onApplicationUpdate: () => void;
  onClose: () => void;
}

export interface Section {
  title: string;
  data?: string[];
}
