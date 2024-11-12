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
import { useState } from "react";
import { ScholarshipDistribution } from "../overview/scholarship-distribution";
import { ReviewComponent } from "./litmus-test-dialog/review";

interface LitmusTestDetailsProps {
  submissionId: string;
  onClose: () => void;
}

export function LitmusTestDetails({ submissionId, onClose }: LitmusTestDetailsProps) {
  const [open, setOpen] = useState(false);
  // In a real application, this data would be fetched based on the submissionId
  const submission = {
    id: submissionId,
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
          <h3 className="font-semibold">{submission.applicantName}</h3>
          <p className="text-sm text-muted-foreground">
            Submitted on {new Date(submission.submissionDate).toLocaleDateString()}
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
              <Badge>{submission.status}</Badge>
            </div>
            <Select defaultValue="under-review">
              <SelectTrigger>
                <SelectValue placeholder="Change status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
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
            {submission.tasks.map((task, taskIndex) => (
              <div key={taskIndex} className="border rounded-lg p-4 space-y-4">
                <div className="grid">
                  <h5 className="text-[#00A3FF] font-medium">{task.title}</h5>
                  <p className="text-sm text-muted-foreground">Submission Type: {task.type}</p>
                </div>
                
                <p className="text-sm text-muted-foreground">Judgement Criteria</p>
                <div className="space-y-1">
                  {task.criteria.map((criterion, criterionIndex) => (
                    <div key={criterionIndex} className="space-y-1">
                      <div className="flex justify-between">
                        <Label>{criterion.name}</Label>
                        <span className="text-sm">{criterion.score}/{task.total}</span>
                      </div>
                    </div>
                  ))}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[#00A3FF]">
                      <Label className="">Total</Label>
                      <div className="">
                        {(() => {
                          const totalScore = task.criteria.reduce((acc, criterion) => acc + criterion.score, 0);
                          const maxScore = task.total * task.criteria.length;
                          const percentage = ((totalScore / maxScore) * 100).toFixed(0);
                          return (
                            <>
                              <span className="text-sm text-muted-foreground mr-2">{percentage}%</span><span className="text-sm">{totalScore}/{maxScore}</span>
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
                src={index < submission.rating ? '/assets/images/yellow-star.svg' : '/assets/images/gray-star.svg'}
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
            <Select defaultValue={submission.scholarship}>
              <SelectTrigger>
                <SelectValue placeholder="Select scholarship slab" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="smart-mouth">Smart Mouth (5%)</SelectItem>
                <SelectItem value="smart-ass">Smart Ass (8%)</SelectItem>
                <SelectItem value="wise-ass">Wise Ass (10%)</SelectItem>
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
          <ReviewComponent /> 
        </DialogContent>
      </Dialog>
    </div>
  );
}