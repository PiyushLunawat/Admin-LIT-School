import dynamic from "next/dynamic";

const CohortDashboard = dynamic(
  () =>
    import("@/components/cohorts/dashboard/cohort-dashboard").then(
      (m) => m.CohortDashboard
    ),
  { ssr: false }
);

export default async function CohortDashboardPage({
  params,
}: {
  params: Promise<{ cohortId: string }>;
}) {
  const cohortId = (await params).cohortId;
  return <CohortDashboard cohortId={cohortId} />;
}
