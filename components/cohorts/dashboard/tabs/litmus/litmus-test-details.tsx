"use client";

import {
  Calendar,
  Clock4,
  Download,
  Edit2Icon,
  EyeIcon,
  FileSignature,
  Star,
  UserMinus,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  BadgeVariant,
  LitmusTestDetailsProps,
} from "@/types/components/cohorts/dashboard/tabs/litmus/litmus-test-details";

const AwardScholarship = dynamic(
  () =>
    import("./litmus-test-dialog/award-scholarship").then(
      (m) => m.AwardScholarship
    ),
  { ssr: false }
);

const ReviewComponent = dynamic(
  () => import("./litmus-test-dialog/review").then((m) => m.ReviewComponent),
  { ssr: false }
);

const ViewComponent = dynamic(
  () => import("./litmus-test-dialog/view").then((m) => m.ViewComponent),
  { ssr: false }
);

const SchedulePresentation = dynamic(
  () =>
    import("@/components/common-dialog/schedule-presentation").then(
      (m) => m.SchedulePresentation
    ),
  { ssr: false }
);

const MarkedAsDialog = dynamic(
  () =>
    import("@/components/students/sections/drop-dialog").then(
      (m) => m.MarkedAsDialog
    ),
  { ssr: false }
);

export function LitmusTestDetails({
  application,
  onClose,
  onApplicationUpdate,
}: LitmusTestDetailsProps) {
  const [open, setOpen] = useState(false);
  const [vopen, setVopen] = useState(false);
  const [schOpen, setSchOpen] = useState(false);
  const [interviewOpen, setInterviewOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [status, setStatus] = useState(
    application?.appliedCohorts?.[application?.appliedCohorts.length - 1]
      ?.litmusTestDetails?.status
  );
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [sch, setSch] = useState<any>(null);
  const [markedAsDialogOpen, setMarkedAsDialogOpen] = useState(false);

  const latestCohort =
    application?.appliedCohorts?.[application?.appliedCohorts.length - 1];
  const applicationDetails = latestCohort?.applicationDetails;

  const litmusTestDetails = latestCohort?.litmusTestDetails;

  const colorClasses = [
    "text-emerald-600",
    "text-[#3698FB]",
    "text-[#FA69E5]",
    "text-orange-600",
  ];

  const getColor = (slabName: string): string => {
    const index =
      latestCohort?.cohortId?.litmusTestDetail?.[0]?.scholarshipSlabs.findIndex(
        (slab: any) => slab.name === slabName
      );
    return index !== -1
      ? colorClasses[index % colorClasses.length]
      : "text-default";
  };

  const getStatusColor = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "under review":
        return "onhold";
      case "pending":
        return "default";
      case "completed":
        return "success";
      default:
        return "default";
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    if (["under review", "completed"].includes(newStatus)) {
      setOpen(true);
    }
  };

  useEffect(() => {
    if (!litmusTestDetails) return;

    const currentStatus = litmusTestDetails?.status;

    setStatus(currentStatus);
    if (currentStatus === "interview scheduled") {
      checkInterviewStatus(litmusTestDetails?.litmusTestInterviews);
    }
  }, [application, litmusTestDetails]);

  function checkInterviewStatus(interviews: any) {
    if (!interviews || interviews.length === 0) return;

    const lastInterview = interviews[interviews.length - 1];
    const endTime = lastInterview?.endTime;
    const currentTime = new Date();

    let meetingEnd: Date | null = null;
    if (lastInterview?.meetingDate && lastInterview?.endTime) {
      meetingEnd = new Date(
        new Date(lastInterview.meetingDate).toDateString() +
          " " +
          lastInterview.endTime
      );

      // console.log("timee", meetingEnd < currentTime, meetingEnd, currentTime);
      if (meetingEnd < currentTime) {
        setStatus("interview concluded");
      }
    }
  }

  const handleDownload = async (url: string, fileName: string) => {
    try {
      // 1. Fetch the file as Blob
      const response = await fetch(url);
      const blob = await response.blob();

      // 2. Create a temporary object URL for that Blob
      const blobUrl = URL.createObjectURL(blob);

      // 3. Create a hidden <a> and force download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName; // or "myImage.png"
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  async function handleDownloadAll() {
    const tasks = litmusTestDetails?.litmusTasks?.[0]?.tasks || [];
    if (!Array.isArray(tasks)) return;

    const urls: string[] = [];

    tasks.forEach((taskObj) => {
      if (!taskObj) return;
      urls.push(...(taskObj.files || []));
      urls.push(...(taskObj.images || []));
      urls.push(...(taskObj.videos || []));
    });

    for (const url of urls) {
      const fileName = url.split("/").pop() || "download";
      await handleDownload(url, fileName);
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="font-semibold">
            {application?.firstName + " " + application?.lastName}
          </h3>
          <p className="text-sm text-muted-foreground">
            Submitted on{" "}
            {new Date(litmusTestDetails?.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* Status Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Evaluation Status</h4>
              <Badge
                className="capitalize"
                variant={getStatusColor(status || "pending")}
              >
                {status === "pending" ? "Awaiting Submission" : status}
              </Badge>
            </div>
            <div className="space-y-1">
              {latestCohort?.litmusTestDetails?.litmusTestInterviews
                .slice()
                .reverse()
                .map((interview: any, index: any) => (
                  <div
                    key={index}
                    className="flex justify-between text-muted-foreground text-sm"
                  >
                    <div className="flex flex-col sm:flex-row justify-center gap-1 sm:gap-3 items-start sm:items-center">
                      <div className="flex gap-1 items-center">
                        <Clock4 className="w-4 h-4" />
                        {interview?.startTime} - {interview?.endTime}
                      </div>
                      <div className="flex gap-1 items-center">
                        <Calendar className="w-4 h-4" />
                        {new Date(interview?.meetingDate).toLocaleDateString()}
                      </div>
                    </div>
                    {index !== 0 && interview?.meetingStatus === "scheduled" ? (
                      <p className="capitalize">Int. Time Elapsed</p>
                    ) : index === 0 && status === "interview concluded" ? (
                      <p className="capitalize">Int. Time Elapsed</p>
                    ) : (
                      <p className="capitalize">
                        Interview {interview?.meetingStatus}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>

          <Separator />

          {/* Quick Actions */}
          {latestCohort?.status === "dropped" ? (
            <div className="bg-[#FF503D1A] px-4 py-3 rounded-lg space-y-2">
              <div className="flex justify-between gap-2">
                <div className="flex gap-2 items-center justify-start text-destructive">
                  <UserMinus className="h-4 w-4 text-red-500" />
                  Dropped off
                </div>
                <div className="">By Admin</div>
              </div>
              <div className="">
                {latestCohort?.reasonForDropped?.[
                  latestCohort?.reasonForDropped.length - 1
                ]?.notes &&
                  latestCohort?.reasonForDropped?.[
                    latestCohort?.reasonForDropped.length - 1
                  ]?.notes.map((reason: any, index: any) => (
                    <div key={index} className="text-sm">
                      {reason}
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h4 className="font-medium">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="flex justify-center items-center min-px-2"
                  disabled
                  // onClick={() => setInterviewOpen(true)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-start flex-1 truncate w-[170px]">
                    Schedule Presentation
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="flex justify-center items-center min-px-2"
                  onClick={handleDownloadAll}
                  disabled={[undefined, "pending"].includes(status)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  <span className="text-start flex-1 truncate w-[170px]">
                    Download Files
                  </span>
                </Button>
                {litmusTestDetails?.scholarshipDetail ? (
                  <Button
                    variant="outline"
                    className={`flex justify-start items-center min-px-2 ${getColor(
                      litmusTestDetails?.scholarshipDetail?.scholarshipName
                    )}`}
                    onClick={() => setSchOpen(true)}
                  >
                    <div className="flex gap-2 items-center truncate">
                      <span className="text-lg pb-[2px]">★ </span>{" "}
                      <span className="truncate">
                        {litmusTestDetails?.scholarshipDetail?.scholarshipName}
                      </span>
                      {"(" +
                        litmusTestDetails?.scholarshipDetail
                          ?.scholarshipPercentage +
                        "%)"}
                    </div>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="flex justify-center items-center min-px-2"
                    disabled
                  >
                    <Star className="h-4 w-4 mr-2" />
                    <span className="text-start flex-1 truncate w-[170px]">
                      Award Scholarship
                    </span>
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="flex justify-center items-center min-px-2 border-none bg-[#FF503D1A] hover:bg-[#FF503D]/20 text-destructive"
                  onClick={() => setMarkedAsDialogOpen(true)}
                  disabled={
                    latestCohort?.status === "dropped" ||
                    ["incomplete", "rejected", "not qualified"].includes(
                      applicationDetails?.applicationStatus
                    )
                  }
                >
                  <UserMinus className="h-4 w-4 mr-2" />
                  <span className="text-start flex-1 truncate w-[170px]">
                    Mark as Dropped
                  </span>
                </Button>
              </div>
            </div>
          )}

          <Separator />

          {/* Tasks Evaluation */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">LITMUS Challenges</h4>
              <div className="flex gap-3">
                <Button
                  size="zero"
                  variant="ghost"
                  className="flex gap-1 text-xs items-center text-muted-foreground"
                  onClick={() => {
                    setVopen(true);
                  }}
                >
                  <EyeIcon className="w-3 h-3 text-white" /> View
                </Button>
                {status === "completed" && (
                  <Button
                    size="zero"
                    variant="ghost"
                    className="flex gap-1 text-xs items-center text-muted-foreground"
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    <Edit2Icon className="w-3 h-3 text-white" /> Edit Review
                  </Button>
                )}
              </div>
            </div>
            {(() => {
              const taskScores = litmusTestDetails?.results || [];
              let totalScore = 0;
              let totalPercentage = 0;
              let maxScore = 0;

              taskScores?.forEach((task: any) => {
                const taskScore = task?.score?.reduce(
                  (acc: any, criterion: any) => acc + criterion.score,
                  0
                );
                const taskMaxScore = task?.score?.reduce(
                  (acc: any, criterion: any) =>
                    acc + Number(criterion.totalScore),
                  0
                );
                const taskPercentage = taskMaxScore
                  ? (taskScore / taskMaxScore) * 100
                  : 0;
                totalScore += taskScore;
                totalPercentage += taskPercentage;
                maxScore += taskMaxScore;
              });

              const avgTaskScore = totalPercentage / taskScores.length;
              if (totalPercentage)
                return (
                  <>
                    <div className="space-y-1">
                      <div className="flex items-end justify-between text-[#00A3FF]">
                        <Label className="font-semibold">Total</Label>
                        <div className="">
                          <span className="text-sm text-muted-foreground mr-2">
                            {avgTaskScore.toFixed(2) || "--"}%
                          </span>
                          <span className="text-sm">
                            {totalScore ? totalScore : "--"}/{maxScore}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                );
            })()}
            {status === "interview concluded" && (
              <Button
                className="w-full flex gap-2"
                onClick={() => {
                  setOpen(true);
                }}
              >
                <FileSignature className="" />
                Review Submission
              </Button>
            )}
            <Card>
              {latestCohort?.cohortId?.litmusTestDetail[0]?.litmusTasks.map(
                (task: any, taskIndex: any) => (
                  <div
                    key={taskIndex}
                    className="border-b mx-2 py-4 px-2 space-y-2"
                  >
                    <div className="grid">
                      <h5 className="text-[#00A3FF] font-medium">
                        {task.title}
                      </h5>
                      <p className="text-sm text-muted-foreground capitalize">
                        Submission Type:{" "}
                        {task.submissionTypes
                          .map((configItem: any) => configItem.type)
                          .join(", ")}
                      </p>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Judgement Criteria:
                    </p>
                    <div className="space-y-1">
                      {task?.judgmentCriteria.map(
                        (criterion: any, criterionIndex: any) => (
                          <div key={criterionIndex} className="space-y-1">
                            <div className="flex justify-between">
                              <Label>{criterion?.name}</Label>
                              <span className="text-sm">
                                {
                                  // Check if the score exists and display the score, otherwise display a default value
                                  litmusTestDetails?.results?.[taskIndex]
                                    ?.score?.[criterionIndex]?.score
                                    ? litmusTestDetails?.results?.[taskIndex]
                                        ?.score?.[criterionIndex]?.score + "/"
                                    : ""
                                }
                                {criterion?.points}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                      {(() => {
                        const scores =
                          litmusTestDetails?.results?.[taskIndex]?.score || [];
                        const totalScore = scores.reduce(
                          (acc: any, criterion: any) => acc + criterion.score,
                          0
                        );
                        const maxScore = task?.judgmentCriteria.reduce(
                          (acc: any, criterion: any) =>
                            acc + Number(criterion.points),
                          0
                        );
                        const percentage = totalScore
                          ? ((totalScore / maxScore) * 100).toFixed(0)
                          : "--";

                        if (totalScore)
                          return (
                            <>
                              <div className="space-y-1">
                                <div className="flex items-end justify-between text-[#00A3FF]">
                                  <Label className="font-semibold">Total</Label>
                                  <div className="">
                                    <span className="text-sm text-muted-foreground mr-2">
                                      {percentage || "--"}%
                                    </span>
                                    <span className="text-sm">
                                      {totalScore ? totalScore : "--"}/
                                      {maxScore}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </>
                          );
                      })()}
                    </div>
                  </div>
                )
              )}
              {litmusTestDetails?.overallFeedback &&
                litmusTestDetails.overallFeedback.length > 0 && (
                  <div className="mx-2 py-4 px-2 space-y-2">
                    <p className="text-sm text-muted-foreground">Feedback:</p>
                    {litmusTestDetails.overallFeedback[
                      litmusTestDetails.overallFeedback.length - 1
                    ]?.feedback
                      .filter(
                        (feedback: any) =>
                          feedback?.data && feedback.data.length > 0
                      )
                      .map((feedback: any, feedbackIndex: any) => (
                        <div key={feedbackIndex} className="space-y-1">
                          <p className="text-sm font-semibold">
                            {feedback?.feedbackTitle}:
                          </p>
                          {feedback?.data.map(
                            (criterion: any, criterionIndex: any) => (
                              <li key={criterionIndex} className="text-sm pl-3">
                                {criterion}
                              </li>
                            )
                          )}
                        </div>
                      ))}
                  </div>
                )}
            </Card>
          </div>

          <Separator />

          {/* Scholarship Assignment */}
          {litmusTestDetails?.performanceRating && (
            <div className="space-y-2">
              <h4 className="font-medium">Performance Rating</h4>
              <div className="flex gap-1 bg-[#262626] p-2 rounded-lg justify-center mx-auto">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={`text-2xl transition-colors ${
                      index < litmusTestDetails?.performanceRating
                        ? "text-[#F8E000]"
                        : "text-[#A3A3A366]"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle></DialogTitle>
        <DialogContent className="max-w-[90vw] sm:max-w-4xl px-4 sm:px-6 ">
          <ReviewComponent
            application={application}
            onApplicationUpdate={onApplicationUpdate}
            onClose={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={vopen} onOpenChange={setVopen}>
        <DialogTitle></DialogTitle>
        <DialogContent className="max-w-[90vw] sm:max-w-4xl px-4 sm:px-6 ">
          <ViewComponent
            application={application}
            onApplicationUpdate={onApplicationUpdate}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={interviewOpen} onOpenChange={setInterviewOpen}>
        <DialogTitle></DialogTitle>
        <DialogContent className="max-w-[90vw] sm:max-w-2xl px-4 sm:px-6 ">
          <SchedulePresentation
            student={application}
            interviewr={["litmus_interviewer"]}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={schOpen} onOpenChange={setSchOpen}>
        <DialogTitle></DialogTitle>
        <DialogContent className="max-w-[90vw] sm:max-w-5xl px-4 sm:px-6 ">
          <AwardScholarship
            student={application}
            onApplicationUpdate={onApplicationUpdate}
            onClose={() => setSchOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={markedAsDialogOpen} onOpenChange={setMarkedAsDialogOpen}>
        <DialogTitle></DialogTitle>
        <DialogContent className="max-w-[90vw] sm:max-w-4xl py-4 px-6">
          <MarkedAsDialog
            student={application}
            onUpdateStatus={() => onApplicationUpdate()}
            onClose={() => setMarkedAsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
