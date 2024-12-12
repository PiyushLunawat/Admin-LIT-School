import { InterviewDetails } from "@/components/interviews/details/interview-details";

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

export default function InterviewDetailsPage({ params }: PageProps) {
  return <InterviewDetails interviewId={params.id} />;
}