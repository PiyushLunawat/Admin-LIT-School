import dynamic from "next/dynamic";

const StudentDetails = dynamic(
  () =>
    import("@/components/students/student-details").then(
      (m) => m.StudentDetails
    ),
  { ssr: false }
);

export default async function StudentDetailsPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const studentId = (await params).studentId;

  return (
    <div className="h-full">
      <StudentDetails studentId={studentId} />
    </div>
  );
}
