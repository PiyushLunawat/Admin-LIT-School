export interface InterviewFeedbackProps {
  name: string;
  email: string;
  phone: string;
  applicationId: string;
  initialStatus: string;
  interview: any;
  onClose: () => void;
  onUpdateStatus: (
    status: string,
    feedback: { [key: string]: string[] }
  ) => void;
}
