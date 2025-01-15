// app/dashboard/students/[id]/page.tsx

import { getCurrentStudents } from "@/app/api/student";
import { StudentDetails } from "@/components/students/student-details";
import { useEffect, useState } from "react";

export default async function StudentDetailsPage({ params }: { params: Promise<{ studentId: string}> }) {
  const studentId = (await params).studentId;

  return (
    <div className="h-full">
      <StudentDetails studentId={studentId} />
    </div>
  );
}
