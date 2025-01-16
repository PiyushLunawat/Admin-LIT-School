"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Mail,
  MessageSquare,
  UserMinus,
  X,
  ThumbsUp,
  ThumbsDown,
  Clock,
  EyeIcon,
  FileSignature,
  Clock4,
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
import { Dialog, DialogTrigger, DialogContent,  } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import SubmissionView from "./submission-view";
import ApplicationFeedback from "./application-dialog/application-feedback";
import { getCurrentStudents } from "@/app/api/student";
import { log } from "console";
import { PreviousMessage } from "../communications/communication-dialog/preview-message";
import { SendMessage } from "./application-dialog/send-message";
import InterviewFeedback from "./application-dialog/interview-feedback";
import { MarkedAsDialog } from "@/components/students/sections/drop-dialog";
import { SchedulePresentation } from "@/components/common-dialog/schedule-presentation";

type BadgeVariant = "destructive" | "warning" | "secondary" | "success" | "lemon" | "onhold" | "default";
interface ApplicationDetailsProps {
  applicationId: any;
  onClose: () => void;
  onApplicationUpdate: () => void;
}

export function ApplicationDetails({ applicationId, onClose, onApplicationUpdate  }: ApplicationDetailsProps) {

  const [open, setOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [interview, setInterview] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [interviewOpen, setInterviewOpen] = useState(false);
  const [interviewFeedbackOpen, setInterviewFeedbackOpen] = useState(false);
  const [application, setApplication] = useState<any>(null);
  const [markedAsDialogOpen, setMarkedAsDialogOpen] = useState(false)
  const [status, setStatus] = useState(application?.applicationDetails?.applicationStatus || "under review");
 
  const getStatusColor = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "under review":
        return "secondary";
      case "accepted":
        return "success";
      case "rejected":
        return "warning";
      case "on hold":
        return "onhold";
      case "interview scheduled":
        return "default";
      case "interview rescheduled":
        return "lemon";
      case "update status":
        return "lemon";
      default:
        return "default";
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [applicationId]);

  async function fetchStudent() {
    try {
      const student = await getCurrentStudents(applicationId?._id);
      setApplication(student.data);
      console.log("student.data",student.data?.applicationDetails?.applicationStatus);
      
      if(student.data?.applicationDetails?.applicationStatus === 'accepted' || student.data?.applicationDetails?.applicationStatus === 'rejected')
        setInterview(true)
      else setInterview(false)

      setStatus(student.data?.applicationDetails?.applicationStatus);
    } catch (error) {
      console.error("Failed to fetch student data:", error);
    }
  }

  const handleSendMessage = (type: string, recipient: string) => {
    setSelectedMessage(type);
    setRecipient(recipient)
    setMessageOpen(true);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    if (newStatus === "accepted" || newStatus === "on hold" || newStatus === "rejected" || newStatus === "under review") {
      setFeedbackOpen(true);
    }
  };

  const handleInterviewStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    if (newStatus === "accepted" || newStatus === "on hold" || newStatus === "rejected" || newStatus === "under review") {
      setInterviewFeedbackOpen(true);
    }
  };

  const handleStatusUpdate = (newStatus: string) => {
    // Update application status locally and reload application data
    setStatus(newStatus);
    onApplicationUpdate();
    fetchStudent();
  };


  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
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
              <h4 className="font-medium">Current Status</h4>
              <Badge className="capitalize" variant={getStatusColor(application?.applicationDetails?.applicationStatus || "")}>{application?.applicationDetails?.applicationStatus}</Badge>
            </div>
            {interview ? 
            <>  
              <div className="flex justify-between text-muted-foreground text-sm">
                <div className="flex justify-center gap-3 items-center">
                  <div className="flex gap-1 items-center">
                    <Clock4 className="w-4 h-4"/>12:45 PM
                  </div>
                  <div className="flex gap-1 items-center">
                    <Calendar className="w-4 h-4"/>20/03/2024
                  </div>
                </div>
                <p className="text-xs">Interview concluded</p>
              </div>
              <Select value={application?.applicationDetails?.applicationStatus?.interview} onValueChange={handleInterviewStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concluded">Reschedule Interview</SelectItem>
                  <SelectItem value="accepted">Complete</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full flex gap-1 text-sm items-center -mt-1" onClick={() => {setInterviewFeedbackOpen(true);}}>
                <FileSignature className="w-4 h-4"/>Interview Feedback
              </Button>
            </> : 
            (application?.applicationDetails?.applicationStatus!=='initiated' && 
              <Select value={application?.applicationDetails?.applicationStatus} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Change status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="initiated">Initiated</SelectItem>
                  <SelectItem value="under review">Under Review</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="on hold">Put On Hold</SelectItem>
                </SelectContent>
              </Select>
            )
          }
          </div>

          <Separator />

          {/* Quick Actions */}
          <div className="space-y-2">
            <h4 className="font-medium">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              {/* <Button variant="outline" className="justify-start" onClick={() => handleSendMessage('email', application?.email)}>
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => handleSendMessage('whatsapp', application?.mobileNumber)}>
                <img src="/assets/images/whatsapp-icon.svg" className="h-4 w-4 mr-2"/>
                Send WhatsApp
              </Button> */}
              <Button variant="outline" className="justify-start" onClick={() => setInterviewOpen(true)}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
              <Button variant="outline" className="justify-start text-destructive" onClick={()=>setMarkedAsDialogOpen(true)}>
                <UserMinus className="h-4 w-4 mr-2" />
                Mark as Dropped
              </Button>
            </div>
          </div>

          <Separator />

          {/* Application Tasks */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Application Tasks</h4>
              {status !== 'under review' && 
              <Button variant="ghost" className="flex gap-1 text-xs items-center text-muted-foreground" onClick={() => {setOpen(true);}}>
                <EyeIcon className="w-4 h-4 text-white"/> View
              </Button>}
            </div>
            {(!interview && application?.applicationDetails?.applicationStatus!=='initiated' ) && 
              <Button className="w-full flex gap-1 text-sm items-center -mt-1" onClick={() => {setFeedbackOpen(true);}}>
                <FileSignature className="w-4 h-4"/>Review Submission
              </Button>}
             {application?.cohort?.applicationFormDetail?.[0]?.task.map((task: any, index: any) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="">
                  <h5 className="font-medium text-[#00A3FF]">{task.title}</h5>
                  <p className="text-muted-foreground text-sm capitalize">
                    Submission Type:{" "}
                    {task.config
                      .map((configItem: any) => configItem.type)
                      .join(", ")}
                  </p>
                </div>
                {(status === 'accepted' || status === 'rejected') && 
                <div className="">
                <h5 className="font-medium text-muted-foreground">Feedback</h5>
                {application?.applicationDetails?.applicationTasks[0]?.applicationTaskDetail?.applicationTasks[0]?.tasks[index]?.feedback.map((item: any, i: any) => (
                  <ul key={i} className="ml-4 sm:ml-6 space-y-2 list-disc">
                    <li className="text-sm" key={i}>
                      {item}
                    </li>
                  </ul>
                ))}
                </div>}
              </div>
            ))} 
            {status === 'on hold' && 
              <div className="border rounded-lg p-4 space-y-2">
                <h5 className="font-medium ">Application On Hold</h5>
                <div className="">
                  <h5 className="font-medium text-sm text-muted-foreground">Reason:</h5>
                  {application?.applicationDetails?.applicationTasks[0]?.applicationTaskDetail?.applicationTasks[0]?.overallFeedback[0]?.feedback.map((item: any, i: any) => (
                    <ul key={i} className="ml-4 sm:ml-6 space-y-2 list-disc">
                      <li className="text-sm" key={i}>
                        {item}
                      </li>
                    </ul>
                  ))}
                </div>
                <h5 className="font-medium text-xs text-muted-foreground">Updated by Admin</h5>
              </div>
            }
          </div>
        </div>
      </ScrollArea>

       {/* Application Feedback Dialog */}
       <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent className="max-w-4xl py-4 px-6">
          <ApplicationFeedback
            name={application?.firstName}
            email={application?.email}
            phone={application?.mobileNumber}
            tasks={application?._id}
            initialStatus={status}
            ques={application?.cohort?.applicationFormDetail?.[0]?.task} 
            submission={application?.applicationDetails?.applicationTasks[0]?.applicationTaskDetail?.applicationTasks[0]}
            onClose={() => setFeedbackOpen(false)}
            onUpdateStatus={(newStatus) => handleStatusUpdate(newStatus)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={interviewOpen} onOpenChange={setInterviewOpen}>
        <DialogContent className="max-w-2xl">
          <SchedulePresentation student={application} interviewr={['interviewer']}/>
        </DialogContent>
      </Dialog>

      <Dialog open={interviewFeedbackOpen} onOpenChange={setInterviewFeedbackOpen}>
        <DialogContent className="max-w-4xl py-4 px-6">
          <InterviewFeedback
            name={application?.firstName}
            email={application?.email}
            phone={application?.mobileNumber}
            tasks={application?._id}
            initialStatus={status}
            ques={application?.cohort?.applicationFormDetail?.[0]?.task} 
            submission={application?.applicationDetails?.applicationTasks[0]?.applicationTaskDetail?.applicationTasks[0]}
            onClose={() => setFeedbackOpen(false)}
            onUpdateStatus={(newStatus) => handleStatusUpdate(newStatus)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl py-2 pb-6 px-6 ">  
          <div className="flex justify-between items-center pb-4 border-b border-gray-700">
            <div>
              <h3 className="text-xl font-semibold">{application?.firstName+' '+application?.lastName}</h3>
              <div className="flex gap-4 h-5 items-center">
                <p className="text-sm text-muted-foreground">{application?.email}</p>
                <Separator orientation="vertical" />
                <p className="text-sm text-muted-foreground">{application?.mobileNumber}</p>
              </div>
            </div>
          </div>
          <SubmissionView tasks={application?.cohort?.applicationFormDetail?.[0]?.task} submission={application?.applicationDetails?.applicationTasks[0]?.applicationTaskDetail?.applicationTasks[0]}/>
        </DialogContent>
      </Dialog>

      <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
        <DialogContent className="max-w-4xl">
          <SendMessage
            type={selectedMessage}
            recipient={recipient}
          />
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