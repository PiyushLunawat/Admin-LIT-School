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

interface ApplicationDetailsProps {
  applicationId: string;
  onClose: () => void;
}

export function ApplicationDetails({ applicationId, onClose }: ApplicationDetailsProps) {
  const application = {
    id: applicationId,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    status: "Under Review",
    submissionDate: "2024-03-15",
    tasks: [
      {
        title: "Share an Embarrassing Story",
        type: "Long Text",
        submission: "Lorem ipsum dolor sit amet...",
      },
      {
        title: "Portfolio Submission",
        type: "File",
        submission: "portfolio.pdf",
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

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{application.name}</h3>
          <p className="text-sm text-muted-foreground">{application.email}</p>
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
            <Select defaultValue="under-review">
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
                <MessageSquare className="h-4 w-4 mr-2" />
                Request Info
              </Button>
              <Button variant="outline" className="justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Interview
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
                    {`Are you sure you would like to drop `}
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

          {/* Application Tasks */}
          <div className="space-y-4">
            <h4 className="font-medium">Application Tasks</h4>
            {application.tasks.map((task, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <h5 className="font-medium">{task.title}</h5>
                  <Badge variant="secondary">{task.type}</Badge>
                </div>
                <p className="text-sm">{task.submission}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Good
                  </Button>
                  <Button variant="outline" size="sm">
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    Needs Work
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Comments Section */}
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
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}