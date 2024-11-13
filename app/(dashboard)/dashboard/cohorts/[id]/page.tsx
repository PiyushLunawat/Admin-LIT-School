import { getCohorts } from "@/app/api/cohorts";
import { CohortDashboard } from "@/components/cohorts/dashboard/cohort-dashboard";

interface PageProps {
  params: {
    id: string;
  };
}

// Use async data fetching directly in generateStaticParams
export async function generateStaticParams() {
  try {
    const data = await getCohorts(); 
    const cohortIds = data.data.map((cohort: any) => cohort._id); // Extract the _id values
    
    return cohortIds.map((id: any) => ({
      id,
    }));
  } catch (error) {
    console.error("Error fetching cohort IDs:", error);
    return []; // Return an empty array if there’s an error to prevent build failure
  }
}

export default function CohortDashboardPage({ params }: PageProps) {
  return <CohortDashboard cohortId={params.id} />;
}
