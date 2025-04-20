"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Edit,
  Mail,
  Download,
  UserMinus,
  RefreshCw,
  Calendar,
  FileSignature,
  Edit2Icon,
  EyeIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { getCurrentStudents, updateScholarship } from "@/app/api/student";
import { useEffect, useState } from "react";
import { MarkedAsDialog } from "@/components/students/sections/drop-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";import { Label } from "@/components/ui/label";
import { log } from "console";
;

type BadgeVariant = "destructive" | "warning" | "secondary" | "success" | "default";

interface AwardScholarshipProps {
  student: any;
}

export function AwardScholarship({ student }: AwardScholarshipProps) {

  const [loading, setLoading] = useState(false);
  const latestCohort = student?.appliedCohorts?.[student?.appliedCohorts.length - 1];
  const cohortDetails = latestCohort?.cohortId;
  const litmusTestDetails = latestCohort?.litmusTestDetails;

  const [sch, setSch] = useState<any>(null);
  const [selectedSch, setSelectedSch] = useState<any>(null);

  const getColor = (index: number) => {
    const colors = [ 'text-emerald-600', 'text-[#3698FB]', 'text-[#FA69E5]', 'text-orange-600'];
    return colors[index % 4];
  };

  const getBorderColor = (index: number) => {
    const colors = [ 'border-emerald-600', 'border-[#3698FB]', 'border-[#FA69E5]', 'border-orange-600'];
    return colors[index % 4];
  };
  
  const getBgColor = (index: number) => {
    const colors = ['bg-emerald-600/20', 'bg-[#3698FB]/20', 'bg-[#FA69E5]/20', 'bg-orange-600/20'];
    return colors[index % 4];
  };
  
  useEffect(() => {
    const schSlab = latestCohort?.cohortId?.feeStructureDetails.find(
      (slab: any) => slab._id === litmusTestDetails?.scholarshipDetail
    );

    setSch(schSlab);
    setSelectedSch(litmusTestDetails?.scholarshipDetail);
}, [litmusTestDetails?.scholarshipDetail]);

  const handleSelect = (slabName: string) => {
    const matchedScholarship = cohortDetails.feeStructureDetails.find(
      (scholarship: any) => scholarship.scholarshipName === slabName
    );
    if (matchedScholarship) {
      setSelectedSch(matchedScholarship);
    }
  };

  const handleScholarship = async () => {
    setLoading(true);
    try {
      const payLoad = {
        studentId: student?._id,
        cohortId: latestCohort?._id,
        scholarshipId: selectedSch._id,
      }
      console.log("change", payLoad);
      
      const result = await updateScholarship(payLoad);
      console.log("Scholarship updated successfully:", result);
    } catch (error) {
      console.error("Failed to update scholarship:", error);
    } finally {
      setLoading(false)
    }
  }

  if (!student) {
    return <p>Student data not available.</p>;
  }

  return (
    <div>
      <div className="grid gap-3">
        {/* Profile Section */}
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={student?.profileUrl} className="object-cover" />
            <AvatarFallback>{student?.firstName?.[0] || "-"}{student?.lastName?.[0] || "-"}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h2 className="text-base font-semibold">
              {student.firstName} {student.lastName}
            </h2>
            <div className="flex gap-2 h-5 items-center">
              <p className="text-sm text-muted-foreground">{student.email}</p>
              <Separator orientation="vertical" />
              <p className="text-sm text-muted-foreground">
                {student.mobileNumber}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex gap-6 mt-4">
            <div className="space-y-4 w-full flex flex-col h-full">
                <div className=" space-y-2 h-full">
                    <h4 className="font-medium">Select Scholarship Slab</h4>
                    <div className="w-full grid grid-cols sm:grid-cols-2 gap-3">
                        {cohortDetails?.litmusTestDetail?.[0]?.scholarshipSlabs.map((slab: any, index: number) => ( 
                            <div key={index} className={`flex flex-col p-4 bg-[#09090B] ${selectedSch?.scholarshipName === slab.name ? getBorderColor(index) : ''} border rounded-xl text-white space-y-6 w-full`}
                              onClick={() => handleSelect(slab.name)}>
                                <div className="flex flex-col gap-2">
                                    <div className={`${ selectedSch?.scholarshipName === slab.name ? getColor(index) : 'text-white'} text-base font-medium`}>
                                    {slab?.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">{slab?.description}</div>
                                </div>
                                <div
                                    className={`px-4 py-3 justify-between items-center rounded-[10px] ${selectedSch?.scholarshipName === slab.name ? getBgColor(index) : 'bg-[#FFFFFF1F]'}`} >
                                    <div className={`text-base font-semibold ${selectedSch?.scholarshipName === slab.name ? getColor(index) : 'text-white'}`}>{slab?.percentage+"%"} Waiver</div>
                                    <div className={`text-base font-normal ${selectedSch?.scholarshipName === slab.name ? getColor(index) : 'text-muted-foreground'}`}>{slab?.clearance+"%"} challenge clearance</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <Button className="w-full pt-auto" onClick={() => handleScholarship()} disabled={loading || latestCohort?.status === 'dropped'}>
                    Update Status
                </Button>
            </div>

            <div className="max-w-[336px] w-full space-y-4">
                {/* Scholarship Assignment */}
                <div className="space-y-2">
                    <h4 className="font-medium">Performance Rating</h4>
                    <div className="flex space-x-1 bg-[#262626] p-2 rounded-lg justify-center mx-auto">
                    {[...Array(5)].map((_, index) => (
                      <span key={index} className={`text-2xl transition-colors ${
                        index < litmusTestDetails?.performanceRating ? 'text-[#F8E000]' : 'text-[#A3A3A366]'}`}>
                        ★
                      </span>
                    ))}
                    </div>
                </div>

                <Separator />

                {/* Tasks Evaluation */}
                <div className="space-y-4">
                  <Card className="max-h-[calc(100vh-23rem)] h-full overflow-y-auto">
                    {cohortDetails?.litmusTestDetail[0]?.litmusTasks.map((task: any, taskIndex: any) => (
                    <div key={taskIndex} className="border-b mx-2 py-4 px-2 space-y-2">
                        <div className="grid">
                        <h5 className="text-[#00A3FF] font-medium">{task.title}</h5>
                        <p className="text-sm text-muted-foreground capitalize">Submission Type: {task.submissionTypes
                            .map((configItem: any) => configItem.type)
                            .join(", ")}</p>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">Judgement Criteria:</p>
                        <div className="space-y-1">
                        {task?.judgmentCriteria.map((criterion: any, criterionIndex: any) => (
                            <div key={criterionIndex} className="space-y-1">
                            <div className="flex justify-between">
                                <Label>{criterion?.name}</Label>
                                <span className="text-sm">{litmusTestDetails?.results[taskIndex]?.score[criterionIndex]?.score || "--"}/{criterion?.points}</span>
                            </div>
                            </div>
                        ))}
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[#00A3FF]">
                            <Label className="font-semibold">Total</Label>
                            <div className="">
                                {(() => {
                                const totalScore = litmusTestDetails?.results[taskIndex]?.score.reduce((acc: any, criterion: any) => acc + criterion.score, 0);
                                const maxScore = task?.judgmentCriteria.reduce((acc: any, criterion: any) => acc + Number(criterion.points), 0);
                                const percentage = totalScore ? ((totalScore / maxScore) * 100).toFixed(0) : '--';
                                return (
                                    <>
                                    <span className="text-sm text-muted-foreground mr-2">{percentage || '--'}%</span><span className="text-sm">{totalScore ? totalScore : '--'}/{maxScore}</span>
                                    </>
                                );
                                })()}
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    ))}
                    {(litmusTestDetails?.overallFeedback && litmusTestDetails.overallFeedback.length > 0) &&
                      <div className="mx-2 py-4 px-2 space-y-2">
                        <p className="text-sm text-muted-foreground">Feedback:</p>
                        {litmusTestDetails.overallFeedback[litmusTestDetails.overallFeedback.length - 1]?.feedback
                          .filter((feedback: any) => feedback?.data && feedback.data.length > 0)
                          .map((feedback: any, feedbackIndex: any) => (
                            <div key={feedbackIndex} className="space-y-1">
                              <p className="text-sm font-semibold">{feedback?.feedbackTitle}:</p>
                              {feedback?.data.map((criterion: any, criterionIndex: any) => (
                                <li key={criterionIndex} className="text-sm pl-3">
                                  {criterion}
                                </li>
                              ))}
                            </div>
                        ))}
                      </div>
                    }
                    </Card>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
