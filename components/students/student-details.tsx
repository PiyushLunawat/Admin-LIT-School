"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { PersonalDetailsTab } from "@/components/students/sections/personal-details-tab";
import { PaymentInformationTab } from "@/components/students/sections/payment-information-tab";
import { DocumentsTab } from "@/components/students/sections/documents-tab";
import { InternalNotesTab } from "@/components/students/sections/internal-notes-tab";
import { getCurrentStudents } from "@/app/api/student";

interface StudentDetailsProps {
  studentId: string;
}

export function StudentDetails({ studentId }: StudentDetailsProps) {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("personal");
 
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col">
        <div className="flex gap-2 items-center cursor-pointer mb-1" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 " />
          Back to Students
        </div>
        <h1 className="text-3xl font-bold">Student Details</h1>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList className="w-full">
          <TabsTrigger value="personal">Personal Details</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="notes">Internal Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <PersonalDetailsTab studentId={studentId} />
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
