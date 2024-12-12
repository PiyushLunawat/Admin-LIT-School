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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { ScholarshipDistribution } from "../overview/scholarship-distribution";
import { ReviewComponent } from "./litmus-test-dialog/review";
import { getCurrentStudents } from "@/app/api/student";

type BadgeVariant = "destructive" | "warning" | "secondary" | "success" | "lemon" | "onhold" | "default";

interface LitmusTestDetailsProps {
  application: any;
  onClose: () => void;
  onApplicationUpdate: () => void;
}

export function LitmusTestDetails({ application, onClose, onApplicationUpdate }: LitmusTestDetailsProps) {
  const [open, setOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [status, setStatus] = useState(application?.litmusTestDetails[0]?.litmusTaskId?.status);
  const [cohorts, setCohorts] = useState<any[]>([]);

  const getStatusColor = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "under review":
        return "secondary";
      case "pending":
        return "default";
      case "completed":
        return "success";
      default:
        return "default";
    }
  };

  // useEffect(() => {
  //   fetchStudent();
  // }, [applicationId]);
  

  // async function fetchStudent() {
  //   try {
  //     const student = await getCurrentStudents(applicationId);
  //     setApplication(student.data);
  //     console.log("student.data",student.data);
      
  //     setStatus(student.data?.litmusTestDetails[0]?.litmusTaskId?.status);
  //   } catch (error) {
  //     console.log("eadc",applicationId);      
  //     console.error("Failed to fetch student data:", error);
  //   }
  // }
  
  // if (!application) {
  //   return (
  //     <div className="h-full flex items-center justify-center">
  //       <p>Loading application details...</p>
  //     </div>
  //   );
  // }
  
  

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

  
  const submission = {
    id: 'bdbdb',
    applicantName: "John Doe",
    submissionDate: "2024-03-15",
    status: "Under Review",
    tasks: [
      {
        title: "Create a pitch deck",
        type: "File(PDF)",
        submission: "pitch-deck.pdf",
        total: 20,
        criteria: [
          { name: "Creativity", score: 18 },
          { name: "Clarity", score: 19 },
          { name: "Feasibility", score: 11 },
        ],
        feedback: [
          { type: "Strength", point: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit","Lorem ipsum dolor sit amet, consectetur adipiscing elit","Lorem ipsum dolor sit amet, consectetur adipiscing elit"]},
          { type: "Weakness", point: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit","Lorem ipsum dolor sit amet, consectetur adipiscing elit","Lorem ipsum dolor sit amet, consectetur adipiscing elit"]},
        ],
      },
      {
        title: "Market Analysis",
        type: "Video",
        submission: "market-analysis.docx",
        total: 20,
        criteria: [
          { name: "Research Depth", score: 7 },
          { name: "Analysis Quality", score: 14 },
          { name: "Insights", score: 13 },
        ],
        feedback: [
          { type: "Strength", point: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit","Lorem ipsum dolor sit amet, consectetur adipiscing elit","Lorem ipsum dolor sit amet, consectetur adipiscing elit"]},
          { type: "Weakness", point: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit","Lorem ipsum dolor sit amet, consectetur adipiscing elit","Lorem ipsum dolor sit amet, consectetur adipiscing elit"]},
        ],
      },
    ],

    evaluatorComments: [
      {
        author: "Sarah Admin",
        text: "Good presentation structure",
        timestamp: "2024-03-16 10:30 AM",
      },
    ],
    rating: 3,
    scholarship: "smart-mouth"
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
              <Badge className="capitalize">{application?.litmusTestDetails[0]?.litmusTaskId?.status}</Badge>
            </div>
            <Select defaultValue={application?.litmusTestDetails[0]?.litmusTaskId?.status}>
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
              <Button variant="outline" className="justify-start text-destructive">
                <UserMinus className="h-4 w-4 mr-2" />
                Mark as Dropped
              </Button>
            </div>
          </div>

          <Separator />

          {/* Tasks Evaluation */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">LITMUS Chanllenges</h4>
              <div className="flex gap-3">
                <Button size="zero" variant="ghost" className="flex gap-1 text-xs items-center text-muted-foreground" onClick={() => {setOpen(true);}}>
                  <EyeIcon className="w-3 h-3 text-white"/> View
                </Button>
                <Button size="zero" variant="ghost" className="flex gap-1 text-xs items-center text-muted-foreground" onClick={() => {setOpen(true);}}>
                  <Edit2Icon className="w-3 h-3 text-white"/> Edit Review
                </Button>
              </div>
            </div>
            <Button className="w-full flex gap-2">
              <FileSignature className=""/>Review Submission
            </Button>
            {application?.cohort?.litmusTestDetail[0]?.litmusTasks.map((task: any, taskIndex: any) => (
              <div key={taskIndex} className="border rounded-lg p-4 space-y-4">
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
                        <span className="text-sm">{criterion?.score || "--"}/{criterion?.points}</span>
                      </div>
                    </div>
                  ))}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[#00A3FF]">
                      <Label className="">Total</Label>
                      <div className="">
                        {(() => {
                          const totalScore = task?.judgmentCriteria.reduce((acc: any, criterion: any) => acc + criterion.score, 0);
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
          </div>

           <Separator />

          {/* Scholarship Assignment */}
          <div className="space-y-2">
            <h4 className="font-medium">Performance Rating</h4>
            <div className="flex space-x-1 bg-[#262626] p-2 rounded-lg justify-center mx-auto">
            {[...Array(5)].map((_, index) => (
              <img
                key={index}
                src={index < application?.rating ? '/assets/images/yellow-star.svg' : '/assets/images/gray-star.svg'}
                alt="Star"
                className="h-6 w-6"
              />
              ))}
            </div>
          </div>

          <Separator />

          {/* Scholarship Assignment */}
          <div className="space-y-2">
            <h4 className="font-medium">Scholarship Assignment</h4>
            <Select defaultValue={'--'}>
              <SelectTrigger>
                <SelectValue placeholder="Select scholarship slab" />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value='--'>Select Slab</SelectItem>
              {application?.cohort?.litmusTestDetail[0]?.scholarshipSlabs.map((slab: any, slabIndex: any) => (
                <SelectItem value={slab?.id}>{slab?.name} ({slab?.percentage}%)</SelectItem>
              ))}
              </SelectContent>
            </Select>
          </div>
{/* 
          <Separator /> */}

          {/* Comments Section */}
          {/* <div className="space-y-4">
            <h4 className="font-medium">Evaluator Comments</h4>
            {submission.evaluatorComments.map((comment, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <p className="font-medium">{comment.author}</p>
                  <p className="text-sm text-muted-foreground">{comment.timestamp}</p>
                </div>
                <p className="text-sm">{comment.text}</p>
              </div>
            ))}
            <Textarea placeholder="Add a comment..." />
            <Button className="w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Comment
            </Button>
          </div> */}
        </div>
      </ScrollArea>

       {/* Dialog to display "Hi" message */}
       <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <ReviewComponent application={application}/> 
        </DialogContent>
      </Dialog>
    </div>
  );
}