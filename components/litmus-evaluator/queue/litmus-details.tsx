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
import { getCurrentStudents } from "@/app/api/student";
import { Card } from "@/components/ui/card";
import { MarkedAsDialog } from "@/components/students/sections/drop-dialog";
import { SchedulePresentation } from "@/components/common-dialog/schedule-presentation";
import { AwardScholarship } from "@/components/cohorts/dashboard/tabs/litmus/litmus-test-dialog/award-scholarship";
import { ViewComponent } from "@/components/cohorts/dashboard/tabs/litmus/litmus-test-dialog/view";
import { ReviewComponent } from "@/components/cohorts/dashboard/tabs/litmus/litmus-test-dialog/review";

type BadgeVariant = "destructive" | "warning" | "secondary" | "success" | "lemon" | "onhold" | "default";

interface LitmusDetailsProps {
  application: any;
  onClose: () => void;
  onApplicationUpdate: () => void;
}

export function LitmusDetails({ application, onClose, onApplicationUpdate }: LitmusDetailsProps) {
  const [open, setOpen] = useState(false);
  const [vopen, setVopen] = useState(false);
  const [schOpen, setSchOpen] = useState(false);
  const [interviewOpen, setInterviewOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [status, setStatus] = useState(application?.litmusTestDetails[0]?.litmusTaskId?.status);
  const [cohorts, setCohorts] = useState<any[]>([]);  
  const [sch, setSch] = useState<any>(null);
  const [markedAsDialogOpen, setMarkedAsDialogOpen] = useState(false)

  const colorClasses = ['text-emerald-600', 'text-[#3698FB]', 'text-[#FA69E5]', 'text-orange-600'];

  const getColor = (slabName: string): string => {
    const index = application?.cohort?.litmusTestDetail?.[0]?.scholarshipSlabs.findIndex(
      (slab: any) => slab.name === slabName
    );
    
    return index !== -1 ? colorClasses[index % colorClasses.length] : 'text-default';
  };


  useEffect(() => {
    setSch(application?.cousrseEnrolled?.[application?.cousrseEnrolled?.length - 1]?.semesterFeeDetails);
}, [application]);

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

  function handleDownloadAll() {
    // Safety checks
    const tasks = application?.litmusTestDetails?.[0]?.litmusTaskId?.litmustasks[0] || [];
    if (!Array.isArray(tasks)) return;
  
    // Collect all file URLs
    const urls: string[] = [];
  
    tasks.forEach((taskObj, index) => {
      const task = taskObj?.task;
      if (!task) return;
    
      // Here you have access to task.files, task.images, task.videos, etc.
      // console.log(`Task #${index} files:`, task.files);
      // console.log(`Task #${index} images:`, task.images);
      // console.log(`Task #${index} videos:`, task.videos);

      urls.push(...(task.files || []));
      urls.push(...(task.images || []));
      urls.push(...(task.videos || []));
    });
  
    // Download each URL
    urls.forEach((url) => {
      // Derive a filename from the URL (optional)
    console.log(`URL:`, url);

      const fileName = url.split("/").pop() || "download";
  
      // Create an invisible <a> element
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName; 
      link.style.display = "none";
  
      // Add it to the document so we can click it
      document.body.appendChild(link);
  
      // Programmatically click the link to trigger download
      link.click();
  
      // Remove it after the download starts
      document.body.removeChild(link);
    });
  }
  

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{application?.firstName+" "+application?.lastName}</h3>
          <p className="text-sm text-muted-foreground">{application?.email}</p>
          <p className="text-sm text-muted-foreground">{application?.mobileNumber}</p>
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
            {application?.litmusTestDetails[0]?.litmusTaskId?.status !== 'completed' &&
            <Select value={application?.litmusTestDetails[0]?.litmusTaskId?.status || "pending"}>
              <SelectTrigger>
                <SelectValue placeholder="Change status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under review">Under Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>}
          </div>

          <Separator />

          {/* Quick Actions */}
          <div className="space-y-2">
            <h4 className="font-medium">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="justify-start " 
              // onClick={() => setInterviewOpen(true)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                <span className="truncate w-[170px]">Schedule Presentation</span>
              </Button>
              <Button variant="outline" className="justify-start" onClick={handleDownloadAll}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Files
              </Button>
                {sch ? 
                  <Button variant="outline" className={`justify-start ${getColor(sch?.scholarshipName)}`} onClick={() => setSchOpen(true)}>
                    <div className="flex gap-2 items-center">
                      <span className="text-lg pb-[2px]">★ </span> {sch?.scholarshipName+' '+(sch?.scholarshipPercentage+'%')}
                    </div> 
                  </Button>
                    :
                  <Button variant="outline" className="justify-start">
                    <div className="flex gap-2 items-center text-muted-foreground">
                      <Star className="h-4 w-4" />
                      Award Scholarship
                    </div>
                  </Button>
                }
              <Button variant="outline" className="border-none bg-[#FF503D1A] hover:bg-[#FF503D]/20 justify-start text-destructive" onClick={()=>setMarkedAsDialogOpen(true)}>
                <UserMinus className="h-4 w-4 mr-2" />
                Mark as Dropped
              </Button>
            </div>
          </div>

          <Separator />

          {/* Tasks Evaluation */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">LITMUS Challenges</h4>
              <div className="flex gap-3">
                <Button size="zero" variant="ghost" className="flex gap-1 text-xs items-center text-muted-foreground" onClick={() => {setVopen(true);}}>
                  <EyeIcon className="w-3 h-3 text-white"/> View Task
                </Button>
                {application?.litmusTestDetails[0]?.litmusTaskId?.status === 'completed' && <Button size="zero" variant="ghost" className="flex gap-1 text-xs items-center text-muted-foreground" onClick={() => {setOpen(true);}}>
                  <Edit2Icon className="w-3 h-3 text-white"/> Edit Review
                </Button>}
              </div>
            </div>
            {(() => {
                const litmusTest = application?.litmusTestDetails?.[0]?.litmusTaskId
                const taskScores = litmusTest?.results || [];
                let totalScore = 0;
                let totalPercentage = 0;
                let maxScore = 0;
      
                taskScores.forEach((task: any) => {
                  const taskScore = task?.score?.reduce((acc: any, criterion: any) => acc + criterion.score, 0);
                  const taskMaxScore = task?.score?.reduce((acc: any, criterion: any) => acc + criterion.totalScore, 0);
                  const taskPercentage = taskMaxScore ? (taskScore / taskMaxScore) * 100 : 0;
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
                          <span className="text-sm text-muted-foreground mr-2">{(avgTaskScore).toFixed(2) || '--'}%</span><span className="text-sm">{totalScore ? totalScore : '--'}/{maxScore}</span>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
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
                        <span className="text-sm">
                          {
                            // Check if the score exists and display the score, otherwise display a default value
                            application?.litmusTestDetails[0]?.litmusTaskId?.results[taskIndex]?.score[criterionIndex]?.score
                              ? (application?.litmusTestDetails[0]?.litmusTaskId?.results[taskIndex]?.score[criterionIndex]?.score+'/')
                              : "" 
                          }
                          {criterion?.points}
                        </span>
                      </div>
                    </div>
                  ))}
                  {(() => {
                      const totalScore = application?.litmusTestDetails[0]?.litmusTaskId?.results[taskIndex]?.score.reduce((acc: any, criterion: any) => acc + criterion.score, 0);
                      const maxScore = task?.judgmentCriteria.reduce((acc: any, criterion: any) => acc + Number(criterion.points), 0);
                      const percentage = totalScore ? ((totalScore / maxScore) * 100).toFixed(0) : '--';
                      
                      if(totalScore)
                      return (
                        <>
                          <div className="space-y-1">
                            <div className="flex items-end justify-between text-[#00A3FF]">
                              <Label className="font-semibold">Total</Label>
                              <div className="">
                                <span className="text-sm text-muted-foreground mr-2">{percentage || '--'}%</span><span className="text-sm">{totalScore ? totalScore : '--'}/{maxScore}</span>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                </div>
              </div>
            ))}
            {application?.litmusTestDetails[0]?.litmusTaskId?.overAllfeedback[0]?.feedback.length > 0 &&
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
            }
            </Card>
          </div>

           <Separator />

          {/* Scholarship Assignment */}
          <div className="space-y-2">
              <h4 className="font-medium">Performance Rating</h4>
              <div className="flex space-x-1 bg-[#262626] p-2 rounded-lg justify-center mx-auto">
              {[...Array(5)].map((_, index) => (
                <span key={index} className={`text-2xl transition-colors ${
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

      <Dialog open={interviewOpen} onOpenChange={setInterviewOpen}>
        <DialogContent className="max-w-2xl">
          <SchedulePresentation student={application} interviewr={['evaluator']}/>
        </DialogContent>
      </Dialog>

      <Dialog open={schOpen} onOpenChange={setSchOpen}>
        <DialogContent className="max-w-5xl">
          <AwardScholarship student={application} />
        </DialogContent>
      </Dialog>

      <Dialog open={markedAsDialogOpen} onOpenChange={setMarkedAsDialogOpen}>
        <DialogContent className="max-w-4xl py-4 px-6">
          <MarkedAsDialog student={application}/>
        </DialogContent>
      </Dialog>

    </div>
  );
}