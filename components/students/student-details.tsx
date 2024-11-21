"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { StudentHeader } from "@/components/students/sections/student-header";
import { PersonalDetailsTab } from "@/components/students/sections/personal-details-tab";
import { ApplicationSubmissionsTab } from "@/components/students/sections/application-submissions-tab";
import { InterviewInformationTab } from "@/components/students/sections/interview-information-tab";
import { LitmusTestDetailsTab } from "@/components/students/sections/litmus-test-details-tab";
import { PaymentInformationTab } from "@/components/students/sections/payment-information-tab";
import { CommunicationsTab } from "@/components/students/sections/communications-tab";
import { ActivityLogTab } from "@/components/students/sections/activity-log-tab";
import { DocumentsTab } from "@/components/students/sections/documents-tab";
import { InternalNotesTab } from "@/components/students/sections/internal-notes-tab";

interface StudentDetailsProps {
  student: any;
}

export function StudentDetails({ student }: StudentDetailsProps) {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("personal");

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col">
        <Button variant="ghost" className="w-fit flex" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Students
        </Button>
        <h1 className="text-3xl font-bold">Student Details</h1>
      </div>

      {/* <StudentHeader studentId={studentId} /> */}

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList className="w-full">
          <TabsTrigger value="personal">Personal Details</TabsTrigger>
          {/* <TabsTrigger value="application">Application</TabsTrigger>
          <TabsTrigger value="interview">Interview</TabsTrigger>
          <TabsTrigger value="litmus">LITMUS Test</TabsTrigger> */}
          <TabsTrigger value="payment">Payment</TabsTrigger>
          {/* <TabsTrigger value="communications">Communications</TabsTrigger> */}
          {/* <TabsTrigger value="activity">Activity Log</TabsTrigger> */}
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="notes">Internal Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          {/* <PersonalDetailsTab studentId={studentId} /> */}
        </TabsContent>
{/* 
        <TabsContent value="application">
          <ApplicationSubmissionsTab studentId={studentId} />
        </TabsContent>

        <TabsContent value="interview">
          <InterviewInformationTab studentId={studentId} />
        </TabsContent>

        <TabsContent value="litmus">
          <LitmusTestDetailsTab studentId={studentId} />
        </TabsContent> */}

        <TabsContent value="payment">
          {/* <PaymentInformationTab studentId={studentId} /> */}
        </TabsContent>

        {/* <TabsContent value="communications">
          <CommunicationsTab studentId={studentId} />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityLogTab studentId={studentId} />
        </TabsContent> */}

        <TabsContent value="documents">
          {/* <DocumentsTab studentId={studentId} /> */}
        </TabsContent>

        <TabsContent value="notes">
          {/* <InternalNotesTab studentId={studentId} /> */}
        </TabsContent>
      </Tabs>
    </div>
  );
}