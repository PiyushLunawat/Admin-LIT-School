import dynamic from "next/dynamic";

const StudentDetails = dynamic(
  () =>
    import("@/components/students/student-details").then(
      (m) => m.StudentDetails
    ),
  { ssr: true }
);

export default async function StudentDetailsPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const studentId = (await params).studentId;

  await new Promise((res) => setTimeout(res, 2000));

  return (
    <div className="h-full">
      <StudentDetails studentId={studentId} />
    </div>
  );
}
