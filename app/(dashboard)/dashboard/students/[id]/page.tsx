// app/dashboard/students/[id]/page.tsx

import { getCurrentStudents } from "@/app/api/student";
import { StudentDetails } from "@/components/students/student-details";
import { useEffect, useState } from "react";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function StudentDetailsPage({ params }: PageProps) {
  // const [student, setStudent] = useState<any>(null);
  const student = await getCurrentStudents(params.id);



  return (
    <div className="h-full">
      <StudentDetails student={student} />
    </div>
  );
}
