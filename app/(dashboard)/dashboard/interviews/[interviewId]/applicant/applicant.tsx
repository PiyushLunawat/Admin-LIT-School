import dynamic from "next/dynamic";

const ApplicantProfile = dynamic(
  () =>
    import("@/components/interviews/applicant/applicant-profile").then(
      (m) => m.ApplicantProfile
    ),
  { ssr: false }
);

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  return [{ id: "INT001" }, { id: "INT002" }, { id: "INT003" }];
}

export default function ApplicantProfilePage({ params }: PageProps) {
  return <ApplicantProfile interviewId={params.id} />;
}
