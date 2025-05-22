export interface Activity {
  id: string;
  type: "application" | "interview" | "litmus" | "payment" | "dropped";
  description: string;
  timestamp: string;
}

export interface RecentActivityProps {
  applications: any;
}
