import { getCohorts } from "@/app/api/cohorts";
import { CohortDashboard } from "@/components/cohorts/dashboard/cohort-dashboard";

export default async function CohortDashboardPage({ params }: { params: Promise<{ cohortId: string}> }) {
  const cohortId = (await params).cohortId;
  return <CohortDashboard cohortId={cohortId} />;
}
