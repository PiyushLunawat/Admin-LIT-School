import { CohortDashboard } from "@/components/cohorts/dashboard/cohort-dashboard";

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  // In a real application, you would fetch this from your data source
  const cohortIds = ["CM01JY", "CM02JY", "CM03JY", "CM04JY", "CM05JY"];
  
  return cohortIds.map((id) => ({
    id,
  }));
}

export default function CohortDashboardPage({ params }: PageProps) {
  return <CohortDashboard cohortId={params.id} />;
}