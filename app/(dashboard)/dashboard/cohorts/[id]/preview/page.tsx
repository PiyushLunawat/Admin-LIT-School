import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { BasicDetailsPreview } from "@/components/cohorts/preview/basic-details-preview";
import { ApplicationFormPreview } from "@/components/cohorts/preview/application-form-preview";
import { LitmusTestPreview } from "@/components/cohorts/preview/litmus-test-preview";
import { FeeStructurePreview } from "@/components/cohorts/preview/fee-structure-preview";
import { CollaboratorsPreview } from "@/components/cohorts/preview/collaborators-preview";

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  // In a real application, you would fetch this from your data source
  const cohortIds = ["CM01JY", "CM02JY", "CM03JY", "CM04JY", "CM05JY"];
  
  return cohortIds.map((id) => ({
    id,
  }));
}

export default function CohortPreviewPage({ params }: PageProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col ">
        <Button variant="ghost" className="w-fit flex">
            <a href="/dashboard/cohorts" className=" flex">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cohorts
            </a>
        </Button>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Cohort Preview</h1>
          <Button>Publish Cohort</Button>
        </div>
      </div>

      <div className="space-y-6">
        <BasicDetailsPreview />
        <ApplicationFormPreview />
        <LitmusTestPreview />
        <FeeStructurePreview />
        <CollaboratorsPreview />
      </div>
    </div>
  );
}