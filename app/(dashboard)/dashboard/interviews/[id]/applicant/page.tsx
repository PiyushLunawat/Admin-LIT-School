import { ApplicantProfile } from "@/components/interviews/applicant/applicant-profile";

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  // These are the interview IDs we want to pre-render
  return [
    { id: "INT001" },
    { id: "INT002" },
    { id: "INT003" }
  ];
}

export default function ApplicantProfilePage({ params }: PageProps) {
  return <ApplicantProfile interviewId={params.id} />;
}