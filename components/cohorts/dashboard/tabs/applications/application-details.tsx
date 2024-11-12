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
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogTrigger, DialogContent,  } from "@/components/ui/dialog";
import { useState } from "react";
import SubmissionView from "./submission-view";
import ApplicationFeedback from "./application-feedback";

interface ApplicationDetailsProps {
  applicationId: string;
  onClose: () => void;
}

export function ApplicationDetails({ applicationId, onClose }: ApplicationDetailsProps) {

  const [open, setOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false); // For ApplicationFeedback dialog
  const [status, setStatus] = useState("Under Review");

  // In a real application, this data would be fetched based on the applicationId
  const application = {
    id: applicationId,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    status: "under-review",
    submissionDate: "2024-03-15",
    tasks: [
      {
        title: "Share an Embarrassing Story",
        type: "Long Text",
        description: "Share an embarrassing or an adventurous story from your life in 500 words. How did this experience influence your perspective?",
        resources: { filename: "Filename.pdf", link: "http://localhost:3000/dashboard/cohorts" },
        submission: "Lorem ipsum dolor sit amet...",
        wordLimit: "200w",

      },
      {
        title: "Portfolio Submission",
        type: "File",
        description: "For Rapido (a bike taxi service), identify five influencers you believe would be a good fit for their social media campaigns. For each influencer, explain why you chose them and how they align with Rapido's brand perception and community goals.",
        resources: { filename: "Filename.pdf", link: "http://localhost:3000/dashboard/cohorts" },
        submission: "portfolio.pdf",
        fileSize: "20mb",
      },
    ],
    comments: [
      {
        author: "Sarah Admin",
        text: "Good communication skills",
        timestamp: "2024-03-16 10:30 AM",
      },
    ],
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    if (newStatus === "accepted" || newStatus === "on-hold") {
      setFeedbackOpen(true);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{application.name}</h3>
          <p className="text-sm text-muted-foreground">{application.email}</p>
          <p className="text-sm text-muted-foreground">{application.phone}</p>
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
              <Badge>{application.status}</Badge>
            </div>
            <Select defaultValue={application.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Change status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="accepted">Accept</SelectItem>
                <SelectItem value="rejected">Reject</SelectItem>
                <SelectItem value="on-hold">Put On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Quick Actions */}
          <div className="space-y-2">
            <h4 className="font-medium">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" className="justify-start">
                <img src="/assets/images/whatsapp-icon.svg" className="h-4 w-4 mr-2" />
                Send WhatsApp
              </Button>
              <Button variant="outline" className="justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
              <Button variant="outline" className="justify-start text-destructive">
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
              <Button variant="ghost" className="flex gap-1 text-xs items-center text-muted-foreground" onClick={() => {setOpen(true);}}>
                <EyeIcon className="w-4 h-4 text-white"/> View
              </Button>
            </div>
            {application.tasks.map((task, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-1">
                  <h5 className="font-medium text-[#00A3FF]">{task.title}</h5>
                <p className="text-muted-foreground text-sm">Submission Type: {task.type}</p>
                {/* <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Good
                  </Button>
                  <Button variant="outline" size="sm">
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    Needs Work
                  </Button>
                </div> */}
              </div>
            ))}
          </div>

          {/* <Separator />

          
          <div className="space-y-4">
            <h4 className="font-medium">Comments</h4>
            {application.comments.map((comment, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <p className="font-medium">{comment.author}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {comment.timestamp}
                  </div>
                </div>
                <p className="text-sm">{comment.text}</p>
              </div>
            ))}
            <Textarea placeholder="Add a comment..." />
            <Button className="w-full">Add Comment</Button>
          </div> */}
        </div>
      </ScrollArea>

       {/* Application Feedback Dialog */}
       <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent className="max-w-4xl py-4 px-6">
          <ApplicationFeedback
            name={application.name}
            email={application.email}
            phone={application.phone}
            tasks={application.tasks}
            onClose={() => setFeedbackOpen(false)}
            onUpdateStatus={(newStatus, feedback) => {
              // Handle feedback submission logic here
              setFeedbackOpen(false);
              setStatus(newStatus);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl py-2 px-6">  
          <div className="flex justify-between items-center pb-4 border-b border-gray-700">
            <div>
              <h3 className="text-xl font-semibold">{application.name}</h3>
              <div className="flex gap-4 h-5 items-center">
                <p className="text-sm text-muted-foreground">{application.email}</p>
                <Separator orientation="vertical" />
                <p className="text-sm text-muted-foreground">{application.phone}</p>
              </div>
            </div>
          </div>
          <SubmissionView tasks={application.tasks} />
        </DialogContent>
      </Dialog>

    </div>
  );
}