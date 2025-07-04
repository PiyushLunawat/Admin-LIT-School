"use client";

import {
  ArrowUpRight,
  FileIcon,
  HandMetal,
  ImageIcon,
  Link2,
  Link2Icon,
  VideoIcon,
} from "lucide-react";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";

import { updateLitmusTaskStatus } from "@/app/api/student";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SelectSeparator } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { formatInput } from "@/lib/utils/helpers";
import {
  ReviewComponentProps,
  Section,
} from "@/types/components/cohorts/dashboard/tabs/litmus/litmus-test-dialog/review";

export function ReviewComponent({
  application,
  onApplicationUpdate,
  onClose,
}: ReviewComponentProps) {
  const [loading, setLoading] = useState(false);
  const latestCohort =
    application?.appliedCohorts?.[application?.appliedCohorts.length - 1];
  const cohortDetails = latestCohort?.cohortId;
  const litmusTestDetails = latestCohort?.litmusTestDetails;
  const tasks = cohortDetails?.litmusTestDetail[0]?.litmusTasks || [];
  const submission =
    litmusTestDetails?.litmusTasks?.[litmusTestDetails?.litmusTasks.length - 1];

  const [rating, setRating] = useState<number>(
    litmusTestDetails?.performanceRating || 0
  );
  const [hoverRating, setHoverRating] = useState<number>(0);
  const max = 5;
  const [sch, setSch] = useState<any>(
    cohortDetails?.feeStructureDetails || null
  );

  const handleClick = (value: number) => {
    setRating(value);
  };
  const handleMouseEnter = (value: number) => {
    setHoverRating(value);
  };
  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const sections: Section[] = useMemo(
    () => [
      {
        title: "Strengths",
        data:
          litmusTestDetails.overallFeedback[
            litmusTestDetails.overallFeedback.length - 1
          ]?.feedback?.[0]?.data || [],
      },
      {
        title: "Weakness",
        data:
          litmusTestDetails.overallFeedback[
            litmusTestDetails.overallFeedback.length - 1
          ]?.feedback?.[1]?.data || [],
      },
      {
        title: "Opportunities",
        data:
          litmusTestDetails.overallFeedback[
            litmusTestDetails.overallFeedback.length - 1
          ]?.feedback?.[2]?.data || [],
      },
      {
        title: "Threats",
        data:
          litmusTestDetails.overallFeedback[
            litmusTestDetails.overallFeedback.length - 1
          ]?.feedback?.[3]?.data || [],
      },
    ],
    [litmusTestDetails.overallFeedback]
  );

  // Initialize each feedback section with either existing bullet lines or a default "• "
  const [feedbackInputs, setFeedbackInputs] = useState<{
    [title: string]: string;
  }>({
    Strengths: "• ",
    Weakness: "• ",
    Opportunities: "• ",
    Threats: "• ",
  });

  useEffect(() => {
    let changed = false;
    const updatedFeedbackInputs = { ...feedbackInputs };

    sections?.forEach((section) => {
      if (section.data && section.data.length > 0) {
        const bulletLines = section.data.map((line) => `• ${line}`).join("\n");
        if (updatedFeedbackInputs[section.title] !== bulletLines) {
          updatedFeedbackInputs[section.title] = bulletLines;
          changed = true;
        }
      } else {
        if (!updatedFeedbackInputs[section.title].startsWith("• ")) {
          updatedFeedbackInputs[section.title] = "• ";
          changed = true;
        }
      }
    });

    // Only update if something actually changed
    if (changed) {
      setFeedbackInputs(updatedFeedbackInputs);
    }
  }, [sections, feedbackInputs]);

  const handleSectionKeyDown = (
    title: string,
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setFeedbackInputs((prev) => {
        const newValue = prev[title] + "\n• ";
        return {
          ...prev,
          [title]: formatInput(newValue),
        };
      });
    }
  };

  const handleSectionChange = (
    title: string,
    e: ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setFeedbackInputs((prev) => ({
      ...prev,
      [title]: value,
    }));
  };

  // For each task => array of scores for each criteria
  const [taskScores, setTaskScores] = useState<number[][]>(
    tasks.map((task: any, index: number) =>
      task.judgmentCriteria.map((criteria: any, cIndex: number) => {
        const initialScore =
          litmusTestDetails?.results?.[index]?.score?.[cIndex]?.score || 0;
        return initialScore;
      })
    )
  );

  const handleSliderChange = (
    taskIndex: number,
    criteriaIndex: number,
    values: number[]
  ) => {
    const val = values[0];
    setTaskScores((prev) => {
      const newScores = [...prev];
      const criteriaScores = [...newScores[taskIndex]];
      criteriaScores[criteriaIndex] = val;
      newScores[taskIndex] = criteriaScores;
      return newScores;
    });
  };

  const handleInputChange = (
    taskIndex: number,
    criteriaIndex: number,
    value: number
  ) => {
    setTaskScores((prev) => {
      const newScores = [...prev];
      const criteriaScores = [...newScores[taskIndex]];
      criteriaScores[criteriaIndex] = value;
      newScores[taskIndex] = criteriaScores;
      return newScores;
    });
  };

  /**
   * This function checks:
   * 1. That every criteria score is > 0 (or you can allow >= 0 if needed).
   * 2. rating != 0
   * 3. at least one feedback section is more than just "• ".
   */
  const canPublish = (): boolean => {
    // 1) Check all criteria scores
    for (let i = 0; i < taskScores.length; i++) {
      for (let j = 0; j < taskScores[i].length; j++) {
        if (taskScores[i][j] <= 0) {
          return false; // Disallow if 0 or negative
        }
      }
    }
    // 2) Check performance rating
    if (rating <= 0) {
      return false;
    }
    // 3) Check at least one feedback input has more than "• "
    // i.e., remove bullets and see if there's text
    const hasRealFeedback = Object.values(feedbackInputs).some((text) => {
      const stripped = text.replace(/^•\s*/gm, "").trim();
      return stripped.length > 0;
    });
    if (!hasRealFeedback) return false;

    return true;
  };

  const handlePublish = async () => {
    // Construct results from tasks and taskScores
    const results = tasks.map((task: any, tIndex: number) => {
      const scoreArray = task.judgmentCriteria.map(
        (criteria: any, cIndex: number) => ({
          criteria: criteria.name,
          score: taskScores[tIndex][cIndex],
          totalScore: criteria.points,
        })
      );
      return {
        task: tIndex + 1,
        score: scoreArray,
      };
    });

    // Build feedbackData from bullet lines
    const feedbackData = sections.map((section) => {
      const bulletLines = feedbackInputs[section.title]
        .split("\n")
        .map((line) => line.replace(/^•\s*/, "").trim())
        .filter((line) => line.length > 0);

      return {
        feedbackTitle: section.title, // or "feebbackTitle"
        data: bulletLines,
      };
    });

    let totalScore = 0;
    let maxScore = 0;
    results?.forEach((taskResult: any) => {
      taskResult.score?.forEach((criterion: any) => {
        totalScore += criterion.score; // the actual score
        maxScore += Number(criterion.totalScore); // the possible max
      });
    });

    const percentageNum = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    const percentage = Math.round(percentageNum); // or toFixed(0)

    // 4) Find which scholarship bracket matches 'percentage'
    let assignedScholarshipId: string | null = null;

    if (Array.isArray(sch)) {
      // Attempt to parse each scholarship's scholarshipClearance
      // Typically '20-40' or '41-60', etc.
      for (const s of sch) {
        // if this is the "No Scholarship" row, skip it for now
        if (s.scholarshipName === "No Scholarship") continue;

        // Parse the clearance range, e.g. '20-40' => [20, 40]
        const [minStr, maxStr] = s.scholarshipClearance.split("-");
        const min = parseInt(minStr, 10);
        const max = parseInt(maxStr, 10);

        // If the percentage is within [min, max]
        if (percentage >= min && percentage <= max) {
          assignedScholarshipId = s._id;
          break;
        }
      }

      // If no bracket matched => fallback to "No Scholarship"
      if (!assignedScholarshipId) {
        const noScholarshipObj = sch.find(
          (item: any) => item.scholarshipName === "No Scholarship"
        );
        if (noScholarshipObj) {
          assignedScholarshipId = noScholarshipObj._id;
        }
      }
    }

    // If for any reason we still have no ID, you can do a final fallback:
    if (!assignedScholarshipId) {
      assignedScholarshipId = "507f1f77bcf86cd799439011"; // fallback _id
    }

    const performanceRating = rating;

    const reviewPayload = {
      status: "completed",
      results: results,
      feedbackData: feedbackData,
      scholarshipDetail: assignedScholarshipId,
      performanceRating: performanceRating,
    };

    setLoading(true);
    try {
      const response = await updateLitmusTaskStatus(
        litmusTestDetails?._id,
        reviewPayload
      );
      // console.log("Update Successful:", response);
      onApplicationUpdate();
      onClose();
    } catch (error) {
      console.error("Update Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Header Section */}
      <div className="flex  items-center gap-4 border-b pb-3">
        <Avatar className="h-16 w-16">
          <AvatarImage src={application?.profileUrl} className="object-cover" />
          <AvatarFallback>
            {application?.firstName?.[0] || "-"}
            {application?.lastName?.[0] || "-"}
          </AvatarFallback>
        </Avatar>
        <div className="flexx flex-col gap-1">
          <h2 className="text-base font-semibold">
            {application?.firstName + " " + application?.lastName}
          </h2>
          <div className="flex flex-col sm:flex-row gap-0 sm:gap-2 h-5 items-start sm:items-center">
            <p className="text-sm text-muted-foreground">
              {application?.email}
            </p>
            <Separator orientation="vertical" className="hidden sm:block" />
            <p className="text-sm text-muted-foreground">
              {application?.mobileNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Tasks */}
      {tasks.map((task: any, index: number) => (
        <div key={index} className="space-y-4">
          <h3 className="text-[#00A3FF] text-lg font-semibold">
            Task 0{index + 1}
          </h3>
          <div className="space-y-1">
            <h4 className="text-lg font-semibold">{task?.title}</h4>
            <p className="text-sm ">{task?.description}</p>
          </div>

          <div className="space-y-1">
            <h4 className="font-semibold pl-3">Resources</h4>
            <div className="space-y-2">
              <div className="w-full space-y-2">
                {task?.resources?.resourceFiles.map(
                  (file: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 mt-2 px-3 border rounded-xl "
                    >
                      <div className="flex items-center gap-2">
                        <FileIcon className="w-4 h-4" />
                        <span className="text-white text-sm truncate overflow-hidden whitespace-nowrap max-w-[200px] sm:max-w-[700px]">
                          {file.split("/").pop()}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={() =>
                          window.open(
                            `
                        ${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${file}`,
                            "_blank"
                          )
                        }
                        className="text-white rounded-xl"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )
                )}

                {task?.resources?.resourceLinks.map(
                  (link: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 mt-2 px-3 border rounded-xl "
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Link2 className="w-4 h-4" />
                        <span className="text-white text-sm truncate overflow-hidden whitespace-nowrap max-w-[200px] sm:max-w-[700px]">
                          {link}
                        </span>
                      </div>
                      <Button
                        onClick={() => window.open(link, "_blank")}
                        variant="ghost"
                        size="icon"
                        type="button"
                        className="text-white rounded-xl"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            {submission?.tasks && (
              <div className="flex justify-between items-center">
                <Badge
                  variant="pending"
                  className="px-3 py-2 text-sm bg-[#FFF552]/[0.2] border-[#FFF552]"
                >
                  Submission 0{index + 1}
                </Badge>
                <div className="text-muted-foreground capitalize text-sm mt-2">
                  Type:{" "}
                  {task?.submissionTypes
                    .map((configItem: any) => configItem?.type)
                    .join(", ")}
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {submission?.tasks[index]?.text?.map(
                (textItem: string, id: number) => (
                  <div
                    key={`text-${id}`}
                    className="break-all w-full flex items-center gap-2 text-sm px-4 py-2 border rounded-xl"
                  >
                    {textItem}
                  </div>
                )
              )}
              {submission?.tasks[index]?.links?.map(
                (linkItem: string, id: number) => (
                  <div
                    key={`link-${id}`}
                    className="w-full flex items-center justify-between gap-2 text-sm px-3 border rounded-xl"
                  >
                    <div className="flex items-center gap-2 text-sm truncate">
                      <Link2Icon className="w-4 h-4" />
                      <a
                        href={linkItem}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white"
                      >
                        {linkItem}
                      </a>
                    </div>
                    <Button
                      onClick={() => window.open(linkItem, "_blank")}
                      variant="ghost"
                      size="icon"
                      type="button"
                      className="text-white rounded-xl"
                    >
                      <ArrowUpRight className="w-4 h-4 " />
                    </Button>
                  </div>
                )
              )}
              {submission?.tasks[index]?.images?.map(
                (imageItem: string, id: number) => (
                  <div
                    key={`image-${id}`}
                    className="w-full flex flex-col items-center text-sm border rounded-xl"
                  >
                    <Image
                      width={800}
                      height={420}
                      src={`
                        ${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${imageItem}`}
                      alt={imageItem.split("/").pop() || ""}
                      className="w-full h-[420px] object-contain rounded-t-xl"
                    />
                    <div className="w-full flex justify-between items-center px-3 border-t">
                      <div className="flex items-center gap-2 text-sm truncate">
                        <ImageIcon className="w-4 h-4" />
                        <span className="w-[220px] text-white truncate">
                          {imageItem.split("/").pop()}
                        </span>
                      </div>
                      <Button
                        onClick={() =>
                          window.open(
                            `
                        ${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${imageItem}`,
                            "_blank"
                          )
                        }
                        variant="ghost"
                        size="icon"
                        type="button"
                        className="text-white rounded-xl"
                      >
                        <ArrowUpRight className="w-4 h-4 " />
                      </Button>
                    </div>
                  </div>
                )
              )}
              {submission?.tasks[index]?.videos?.map(
                (videoItem: string, id: number) => (
                  <div
                    key={`video-${id}`}
                    className="w-full flex flex-col items-center text-sm border rounded-xl"
                  >
                    <video
                      controls
                      preload="none"
                      className="h-[420px] rounded-t-xl"
                    >
                      <source
                        src={`
                        ${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${videoItem}`}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                    <div className="w-full flex justify-between items-center px-3 border-t">
                      <div className="flex items-center gap-2 text-sm truncate">
                        <VideoIcon className="w-4 h-4" />
                        <span className="w-[220px] text-white truncate">
                          {videoItem.split("/").pop()}
                        </span>
                      </div>
                      <Button
                        onClick={() =>
                          window.open(
                            `
                        ${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${videoItem}`,
                            "_blank"
                          )
                        }
                        variant="ghost"
                        size="icon"
                        type="button"
                        className="text-white rounded-xl"
                      >
                        <ArrowUpRight className="w-4 h-4 " />
                      </Button>
                    </div>
                  </div>
                )
              )}
              {submission?.tasks[index]?.files?.map(
                (fileItem: string, id: number) => (
                  <div
                    key={`file-${id}`}
                    className="w-full flex items-center justify-between gap-2 text-sm px-3 border rounded-xl"
                  >
                    <div className="flex items-center gap-2 text-sm truncate">
                      <FileIcon className="w-4 h-4" />
                      <a
                        href={`
                        ${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${fileItem}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white"
                      >
                        {fileItem.split("/").pop()}
                      </a>
                    </div>
                    <Button
                      onClick={() =>
                        window.open(
                          `
                        ${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${fileItem}`,
                          "_blank"
                        )
                      }
                      variant="ghost"
                      size="icon"
                      type="button"
                      className="text-white rounded-xl"
                    >
                      <ArrowUpRight className="w-4 h-4 " />
                    </Button>
                  </div>
                )
              )}
            </div>
          </div>
          {index < tasks?.length - 1 && <Separator className="my-8" />}

          {/* Criteria Evaluation */}
          <div className="space-y-4">
            <h3 className="text-md font-medium">Criteria Evaluation</h3>
            {task?.judgmentCriteria.map((criteria: any, cIndex: number) => (
              <div className="space-y-2 pl-3" key={cIndex}>
                <div className="flex justify-between">
                  <Label>{criteria.name}</Label>
                  <span className="flex gap-1 text-sm">
                    <input
                      type="number"
                      value={taskScores[index][cIndex]}
                      onChange={(e) =>
                        handleInputChange(index, cIndex, Number(e.target.value))
                      }
                      className="w-fit text-sm bg-transparent border-b-2 p-0 text-center"
                      min={0}
                      max={criteria.points}
                    />
                    /{criteria.points}
                  </span>
                </div>
                <Slider
                  value={[taskScores[index][cIndex]]}
                  max={criteria.points}
                  step={1}
                  className="w-full"
                  onValueChange={(values) =>
                    handleSliderChange(index, cIndex, values)
                  }
                />
              </div>
            ))}
          </div>
          <SelectSeparator className="mt-8" />
        </div>
      ))}

      {/* Performance Rating Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center my-6">
          <h3 className="">Performance Rating</h3>
          <div className="flex space-x-1">
            {Array.from({ length: max }, (_, i) => i + 1).map((value) => {
              const isFilled =
                hoverRating >= value || (!hoverRating && rating >= value);
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleClick(value)}
                  onMouseEnter={() => handleMouseEnter(value)}
                  onMouseLeave={handleMouseLeave}
                  className="focus:outline-none"
                  aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                >
                  <span
                    className={`text-2xl transition-colors ${
                      isFilled ? "text-[#F8E000]" : "text-[#A3A3A366]"
                    }`}
                  >
                    ★
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <SelectSeparator className="mt-8" />
      </div>

      {/* SWOC Feedback */}
      <div className="space-y-4">
        <h3 className="">Feedback</h3>

        <div className="space-y-4">
          {sections.map((section) => (
            <Card key={section.title} className="p-4">
              <h4 className="flex gap-2 items-center text-base font-medium mb-3">
                <HandMetal className="w-4 h-4 rotate-90" />
                {section.title}
              </h4>
              <Textarea
                id={section.title}
                value={feedbackInputs[section.title]}
                className="px-3 text-sm"
                onChange={(e) => handleSectionChange(section.title, e)}
                onKeyDown={(e) => handleSectionKeyDown(section.title, e)}
                placeholder="Type here..."
                rows={3}
                cols={40}
              />
            </Card>
          ))}
        </div>
      </div>

      {/* Publish Button */}
      <div className="text-center">
        <Button
          className="w-full"
          onClick={handlePublish}
          disabled={
            loading || !canPublish() || latestCohort?.status === "dropped"
          }
        >
          Publish Review
        </Button>
      </div>
    </div>
  );
}
