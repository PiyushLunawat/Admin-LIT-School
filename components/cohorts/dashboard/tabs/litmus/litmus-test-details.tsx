"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  UserMinus,
  X,
  Download,
  Star,
  MessageSquare,
  EyeIcon,
  Edit2Icon,
  FileIcon,
  FileSignature,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { ScholarshipDistribution } from "../overview/scholarship-distribution";
import { ReviewComponent } from "./litmus-test-dialog/review";
import { getCurrentStudents } from "@/app/api/student";
import { Card } from "@/components/ui/card";
import { ViewComponent } from "./litmus-test-dialog/view";

type BadgeVariant = "destructive" | "warning" | "secondary" | "success" | "lemon" | "onhold" | "default";

interface LitmusTestDetailsProps {
  application: any;
  onClose: () => void;
  onApplicationUpdate: () => void;
}

export function LitmusTestDetails({ application, onClose, onApplicationUpdate }: LitmusTestDetailsProps) {
  const [open, setOpen] = useState(false);
  const [vopen, setVopen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [status, setStatus] = useState(application?.litmusTestDetails[0]?.litmusTaskId?.status);
  const [cohorts, setCohorts] = useState<any[]>([]);  

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
    if (newStatus === "accepted" || newStatus === "on hold" || newStatus === "rejected" || newStatus === "under review") {
      setFeedbackOpen(true);
    }
  };

  const handleStatusUpdate = (newStatus: string) => {
    // Update application status locally and reload application data
    setStatus(newStatus);
    onApplicationUpdate();
    // fetchStudent();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{application?.firstName+" "+application?.lastName}</h3>
          <p className="text-sm text-muted-foreground">
            Submitted on {new Date(application?.litmusTestDetails[0]?.litmusTaskId?.createdAt).toLocaleDateString()}
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
              <Badge className="capitalize" variant={getStatusColor(application?.litmusTestDetails[0]?.litmusTaskId?.status || "pending")}>{application?.litmusTestDetails[0]?.litmusTaskId?.status || "pending"}</Badge>
            </div>
            <Select value={application?.litmusTestDetails[0]?.litmusTaskId?.status || "pending"}>
              <SelectTrigger>
                <SelectValue placeholder="Change status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under review">Under Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Quick Actions */}
          <div className="space-y-2">
            <h4 className="font-medium">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Presenta...
              </Button>
              <Button variant="outline" className="justify-start">
                <Download className="h-4 w-4 mr-2" />
                Download Files
              </Button>
              <Button variant="outline" className="justify-start">
                <Star className="h-4 w-4 mr-2" />
                Award Scholarship
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-destructive">
                    <UserMinus className="h-4 w-4 mr-2" />
                    Mark as Dropped
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" side="top" className="max-w-[345px] w-full">
                  <div className="text-base font-medium mb-2">
                    {`Are you sure you would like to drop ${application?.firstName+" "+application?.lastName}`}
                  </div>
                  <div className="flex gap-2 ">
                    <Button variant="outline" className="flex-1" >Cancel</Button>
                    <Button className="bg-[#FF503D]/20 hover:bg-[#FF503D]/30 text-[#FF503D] flex-1" >Drop</Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Separator />

          {/* Tasks Evaluation */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">LITMUS Chanllenges</h4>
              <div className="flex gap-3">
                <Button size="zero" variant="ghost" className="flex gap-1 text-xs items-center text-muted-foreground" onClick={() => {setVopen(true);}}>
                  <EyeIcon className="w-3 h-3 text-white"/> View
                </Button>
                {application?.litmusTestDetails[0]?.litmusTaskId?.status === 'completed' && <Button size="zero" variant="ghost" className="flex gap-1 text-xs items-center text-muted-foreground" onClick={() => {setOpen(true);}}>
                  <Edit2Icon className="w-3 h-3 text-white"/> Edit Review
                </Button>}
              </div>
            </div>
            {application?.litmusTestDetails[0]?.litmusTaskId?.status === 'under review' && <Button className="w-full flex gap-2" onClick={() => {setOpen(true);}}>
              <FileSignature className=""/>Review Submission
            </Button>}
            <Card>
            {application?.cohort?.litmusTestDetail[0]?.litmusTasks.map((task: any, taskIndex: any) => (
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
                        <span className="text-sm">{application?.litmusTestDetails[0]?.litmusTaskId?.results[taskIndex]?.score[criterionIndex]?.score || "--"}/{criterion?.points}</span>
                      </div>
                    </div>
                  ))}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[#00A3FF]">
                      <Label className="font-semibold">Total</Label>
                      <div className="">
                        {(() => {
                          const totalScore = application?.litmusTestDetails[0]?.litmusTaskId?.results[taskIndex]?.score.reduce((acc: any, criterion: any) => acc + criterion.score, 0);
                          const maxScore = task?.judgmentCriteria.reduce((acc: any, criterion: any) => acc + criterion.points, 0);
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
            <div className="mx-2 py-4 px-2 space-y-2">               
              <p className="text-sm text-muted-foreground">Feedback:</p>
              {application?.litmusTestDetails[0]?.litmusTaskId?.overAllfeedback[0]?.feedback.map((feedback: any, feedbackIndex: any) => (
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

            </Card>
          </div>

           <Separator />

          {/* Scholarship Assignment */}
          <div className="space-y-2">
            <h4 className="font-medium">Performance Rating</h4>
            <div className="flex space-x-1 bg-[#262626] p-2 rounded-lg justify-center mx-auto">
            {[...Array(5)].map((_, index) => (
              <span className={`text-2xl transition-colors ${
              index < application?.litmusTestDetails[0]?.litmusTaskId?.performanceRating ? 'text-[#F8E000]' : 'text-[#A3A3A366]'}`}>
                ★
              </span>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <ReviewComponent application={application} onApplicationUpdate={onApplicationUpdate}/>
        </DialogContent>
      </Dialog>
      <Dialog open={vopen} onOpenChange={setVopen}>
        <DialogContent className="max-w-4xl">
          <ViewComponent application={application} onApplicationUpdate={onApplicationUpdate}/>
        </DialogContent>
      </Dialog>

    </div>
  );
}