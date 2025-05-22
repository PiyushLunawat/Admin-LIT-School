import dynamic from "next/dynamic";

interface PageProps {
  params: {
    id: string;
  };
}

const InterviewDetails = dynamic(
  () =>
    import("@/components/interviews/details/interview-details").then(
      (m) => m.InterviewDetails
    ),
  { ssr: false }
);

export async function generateStaticParams() {
  return [{ id: "INT001" }, { id: "INT002" }, { id: "INT003" }];
}

export default async function InterviewDetailsPage({
  params,
}: {
  params: Promise<{ interviewId: string }>;
}) {
  const interviewId = (await params).interviewId;
  return <InterviewDetails interviewId={interviewId} />;
}
