"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { PersonalDetailsTab } from "@/components/students/sections/personal-details-tab";
import { PaymentInformationTab } from "@/components/students/sections/payment-information-tab";
import { DocumentsTab } from "@/components/students/sections/documents-tab";
import { InternalNotesTab } from "@/components/students/sections/internal-notes-tab";

interface StudentDetailsProps {
  studentId: string;
}

export function StudentDetails({ studentId }: StudentDetailsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read the `tab` from the URL, defaulting to "personal".
  const tabQueryParam = searchParams.get("tab") || "personal";
  const [currentTab, setCurrentTab] = useState(tabQueryParam);

  const [studentName, setStudentName] = useState<string>("");

  // Sync state if the query param changes (e.g., user manually changes URL).
  useEffect(() => {
    setCurrentTab(tabQueryParam);
  }, [tabQueryParam]);

  // Update both state and the query param when the user changes tabs.
  const handleTabChange = (newValue: string) => {
    setCurrentTab(newValue);
    router.replace(`/dashboard/students/${studentId}?tab=${newValue}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col">
        <div className="mb-1">Student Details</div>
        {studentName ? (
          <h1 className="text-3xl font-bold">{studentName}</h1>
        ) : (
          <Skeleton className="h-9 w-[200px]" />
        )}
      </div>

      {/* Make Tabs a controlled component using `value` and `onValueChange` */}
      <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="w-full">
          <TabsTrigger value="personal">Personal Details</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="notes">Internal Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <PersonalDetailsTab studentId={studentId} setStudentName={setStudentName} />
        </TabsContent>
        <TabsContent value="payment">
          <PaymentInformationTab studentId={studentId} />
        </TabsContent>
        <TabsContent value="documents">
          <DocumentsTab studentId={studentId} />
        </TabsContent>
        <TabsContent value="notes">
          <InternalNotesTab studentId={studentId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
