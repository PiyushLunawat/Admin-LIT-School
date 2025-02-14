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
import { date } from "zod";
import { Card } from "@/components/ui/card";

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
      case "initiated":
        return "default";
      case "under review":
        return "secondary";
      case "accepted":
      case "selected":
        return "success";
      case "rejected":
      case "not qualified":
        return "warning";
      case "on hold":
      case "waitlist":
        return "onhold";
      case "interview scheduled":
        return "default";
      case "interview rescheduled":
        return "lemon";
      case "interview concluded":
        return "lemon";
      default:
        return "secondary";
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [applicationId]);

  async function fetchStudent() {
    try {
      const student = await getCurrentStudents(applicationId?._id);
      setApplication(student.data);
      const currentStatus = student.data?.applicationDetails?.applicationStatus;

      if (currentStatus === "Interview Scheduled") {
        checkInterviewStatus(student.data?.applicationDetails?.applicationTestInterviews);
      }

      
      if(['Interview Scheduled', 'interview cancelled', 'concluded', 'waitlist', 'selected', 'not qualified'].includes(student.data?.applicationDetails?.applicationStatus))
        setInterview(true)
      else setInterview(false)

      setStatus(student.data?.applicationDetails?.applicationStatus);
    } catch (error) {
      console.error("Failed to fetch student data:", error);
    }
  }

  function checkInterviewStatus(interviews: any) {
    if (!interviews || interviews.length === 0) return;

    const lastInterview = interviews[interviews.length - 1];
    const endTime = lastInterview?.endTime; // Assume endTime is a string like "3:00 PM"
    const currentTime = new Date();

    if (endTime) {
      const endDate = getEndTimeDate(endTime);
console.log("timee", (endDate < currentTime), endDate, currentTime)
      if (endDate < currentTime) {
        setStatus("Interview Concluded");
      }
    }
  }

  
  function getEndTimeDate(timeString: string): Date {
    const currentDate = new Date();
    const [time, period] = timeString.split(" ");
    const [hours, minutes] = time.split(":");

    let hoursInt = parseInt(hours, 10);
    if (period === "PM" && hoursInt !== 12) {
      hoursInt += 12;
    } else if (period === "AM" && hoursInt === 12) {
      hoursInt = 0;
    }

    const endTimeDate = new Date(currentDate);
    endTimeDate.setHours(hoursInt, parseInt(minutes, 10), 0, 0); // Set the time on the current date

    return endTimeDate;
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
              <h4 className="font-medium">Current Status</h4>
              <Badge className="capitalize" variant={getStatusColor(status || "")}>{status}</Badge>
            </div>
            {interview ? 
            <div className="space-y-3">  
            <div className="space-y-1">
              {application?.applicationDetails?.applicationTestInterviews.map((interview: any, index: any) => (
                  <div key={index} className="flex justify-between text-muted-foreground text-sm">
                    <div className="flex justify-center gap-3 items-center">
                      <div className="flex gap-1 items-center">
                        <Clock4 className="w-4 h-4"/>{interview?.startTime || interview?.endTime}
                      </div>
                      <div className="flex gap-1 items-center">
                        <Calendar className="w-4 h-4"/>{new Date(interview?.meetingDate).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="capitalize">Interview {interview?.meetingStatus}</p>
                  </div>
              ))}
              </div>
              <Select
               disabled={['Interview Scheduled','interview cancelled', 'not qualified', 'selected'].includes(application?.applicationDetails?.applicationStatus)}
               value={status}
               onValueChange={handleInterviewStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {!['not qualified', 'waitlist', 'selected'].includes(application?.applicationDetails?.applicationStatus) &&
                    <SelectItem className="capitalize" value={application?.applicationDetails?.applicationStatus}>
                      <span className="capitalize">{application?.applicationDetails?.applicationStatus}</span>
                    </SelectItem>
                  }
                  <SelectItem value="waitlist">Waitlist</SelectItem>
                  <SelectItem value="selected">Accepted</SelectItem>
                  <SelectItem value="not qualified">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full flex gap-1 text-sm items-center -mt-1" onClick={() => {setInterviewFeedbackOpen(true);}}>
                <FileSignature className="w-4 h-4"/>Interview Feedback
              </Button>
            </div> : 
            (
              <Select 
              disabled={['initiated', 'accepted', 'rejected'].includes(application?.applicationDetails?.applicationStatus)} 
                value={application?.applicationDetails?.applicationStatus} 
                onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue className="" placeholder="Change status" />
                </SelectTrigger>
                <SelectContent>
                  {!['on hold', 'accepted', 'rejected'].includes(application?.applicationDetails?.applicationStatus) &&
                    <SelectItem className="capitalize" value={application?.applicationDetails?.applicationStatus}>
                      <span className="capitalize">{application?.applicationDetails?.applicationStatus}</span>
                    </SelectItem>
                  }
                  <SelectItem value="on hold">Put On Hold</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
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
              <Button variant="outline" className="justify-start" 
              // onClick={() => setInterviewOpen(true)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
              <Button variant="outline" className="border-none bg-[#FF503D1A] hover:bg-[#FF503D]/20 justify-start text-destructive" onClick={()=>setMarkedAsDialogOpen(true)}>
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
            {(!interview && application?.applicationDetails?.applicationStatus==='under review' ) && 
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
              
              {application?.applicationDetails?.applicationTasks[application?.applicationDetails?.applicationTasks.length - 1]?.applicationTaskDetail?.applicationTasks[0]?.overallFeedback[0]?.feedback && 
              <Card className="p-4 space-y-2">
                <h5 className="font-medium ">Application On Hold</h5>
                {application?.applicationDetails?.applicationTasks[application?.applicationDetails?.applicationTasks.length - 1]?.applicationTaskDetail?.applicationTasks[0]?.overallFeedback.map((feedback: any, index: any) => (
                  <div key={index} className="">
                    <h5 className="font-medium text-base text-muted-foreground">Reason:</h5>
                    {feedback?.feedback.map((item: any, i: any) => (
                      <ul key={i} className="ml-4 sm:ml-6 space-y-2 list-disc">
                        <li className="text-sm" key={i}>
                          {item}
                        </li>
                      </ul>
                    ))}
                    <div className="flex justify-between items-center mt-2">
                      <div className="font-medium text-sm text-muted-foreground">Updated by Admin</div>
                      <div className="font-medium text-sm text-muted-foreground">{new Date(feedback?.timestamp).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </Card>
            }
            
            {application?.applicationDetails?.applicationTestInterviews.map((interview: any, index: any) => (
              interview?.feedback[interview?.feedback.length - 1] && 
              <Card key={index} className="p-4 space-y-2">
                <h5 className="font-medium ">Interview Feedback</h5>
                <div className="">
                  <h5 className="font-medium text-base text-muted-foreground">Feedback:</h5>
                  {interview?.feedback[interview?.feedback.length - 1]?.comments.map((item: any, i: any) => (
                    <ul key={i} className="ml-4 sm:ml-6 space-y-2 list-disc">
                      <li className="text-sm" key={i}>
                        {item}
                      </li>
                    </ul>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-medium text-sm text-muted-foreground">Updated by Admin</div>
                  <div className="font-medium text-sm text-muted-foreground">{new Date(interview?.feedback[interview?.feedback.length - 1]?.date).toLocaleDateString()}</div>
                </div>
              </Card>
            ))}
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
            applicationId={application?.applicationDetails?._id}
            initialStatus={status}
            interview={application?.applicationDetails?.applicationTestInterviews?.[application?.applicationDetails?.applicationTestInterviews.length - 1]}
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