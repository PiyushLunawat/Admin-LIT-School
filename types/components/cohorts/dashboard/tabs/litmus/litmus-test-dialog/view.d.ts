export interface ReviewComponentProps {
  application: any;
  onApplicationUpdate: () => void;
}

export interface Section {
  title: string;
  data?: [];
}
