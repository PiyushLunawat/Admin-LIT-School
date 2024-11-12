import { StudentDetails } from "@/components/students/student-details";

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  // In a real application, you would fetch this from your data source
  const studentIds = ["1", "2", "3"];
  
  return studentIds.map((id) => ({
    id,
  }));
}

export default function StudentDetailsPage({ params }: PageProps) {
  return (
    <div className="h-full">
      <StudentDetails studentId={params.id} />
    </div>
  );
}