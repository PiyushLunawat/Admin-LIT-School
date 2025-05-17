import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useState } from "react";

type BadgeVariant =
  | "destructive"
  | "warning"
  | "secondary"
  | "success"
  | "default";

interface SchedulePresentationProps {
  student: any;
  interviewr: string[];
}

export function SchedulePresentation({
  student,
  interviewr,
}: SchedulePresentationProps) {
  const [selectedInterviewer, setSelectedInterviewer] = useState<any | null>(
    null
  );

  /**
   * Extracts the list of interviewers based on their roles.
   */
  const reviewerList: any[] =
    student?.cohort?.collaborators?.filter((collaborator: any) =>
      interviewr.some((role: string) => collaborator.role === role)
    ) || [];

  console.log("Reviewer List:", reviewerList);

  const handleSelect = (interviewer: any) => {
    setSelectedInterviewer(interviewer);
  };

  if (!student) {
    return <p>Student data not available.</p>;
  }

  return (
    <div>
      <div className="grid gap-3">
        {/* Profile Section */}
        <div className="space-y-1">
          <h2 className="text-base font-semibold">Select Your Interviewer</h2>
          <div className="flex gap-2 h-5 items-center">
            <p className="text-sm text-muted-foreground">Program Application</p>
            <Separator orientation="vertical" />
            <p className="text-sm text-muted-foreground">
              {" "}
              Submitted application on{" "}
              {new Date(
                student?.litmusTestDetails?.[0]?.litmusTaskId?.createdAt
              ).toLocaleDateString()}
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex gap-6 mt-4">
          <div className="w-full space-y-4">
            <div className="flex flex-col items-start space-y-2">
              {reviewerList.length > 0 ? (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {reviewerList.map((interviewer: any, index: any) => (
                    <div
                      key={index}
                      className={`flex flex-col bg-[#09090B] ${
                        selectedInterviewer?.email === interviewer.email
                          ? "border-white text-white"
                          : "text-muted-foreground"
                      } border rounded-xl w-full max-w-[320px] cursor-pointer hover:border-white hover:text-white transition-colors`}
                      style={{ width: "100%" }}
                      onClick={() => handleSelect(interviewer)}
                    >
                      <Image
                        src={`/assets/images/placeholder-image-${
                          (index % 3) + 1
                        }.svg`}
                        alt={interviewer.email}
                        className="h-[200px] object-cover rounded-t-xl w-full"
                        width={320}
                        height={200}
                      />
                      <div className="flex flex-col gap-2 p-4">
                        <div className="text-base font-medium">
                          {interviewer.email}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full min-h-[300px] h-full flex items-center justify-center text-center text-muted-foreground border rounded-md">
                  <div>No Interviewer Available</div>
                </div>
              )}
            </div>
            <Button className="w-full" disabled={!selectedInterviewer}>
              Select Interview Slot
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
