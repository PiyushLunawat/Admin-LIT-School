import { getCohorts } from "@/app/api/cohorts";
import { CohortDashboard } from "@/components/cohorts/dashboard/cohort-dashboard";

interface PageProps {
  params: {
    id: string;
  };
}


export default function CohortDashboardPage({ params }: PageProps) {
  return <CohortDashboard cohortId={params.id} />;
}
