"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Download,
  X,
  Award,
  MessageSquare,
  Star,
  Eye,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface SubmissionDetailsProps {
  submissionId: string;
  onClose: () => void;
}

export function SubmissionDetails({ submissionId, onClose }: SubmissionDetailsProps) {
  // In a real application, this data would be fetched based on the submissionId
  const submission = {
    id: submissionId,
    applicantName: "John Doe",
    submissionDate: "2024-03-15",
    status: "Under Review",
    tasks: [
      {
        title: "Create a pitch deck",
        type: "File",
        submission: "pitch-deck.pdf",
        criteria: [
          { name: "Creativity", score: 0 },
          { name: "Clarity", score: 0 },
          { name: "Feasibility", score: 0 },
        ],
      },
      {
        title: "Market Analysis",
        type: "Document",
        submission: "market-analysis.docx",
        criteria: [
          { name: "Research Depth", score: 0 },
          { name: "Analysis Quality", score: 0 },
          { name: "Insights", score: 0 },
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
                Schedule Presentation
              </Button>
              <Button variant="outline" className="justify-start">
                <Eye className="h-4 w-4 mr-2" />
                View Files
              </Button>
              <Button variant="outline" className="justify-start">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
              <Button variant="outline" className="justify-start">
                <Star className="h-4 w-4 mr-2" />
                Award Scholarship
              </Button>
            </div>
          </div>

          <Separator />

          {/* Tasks Evaluation */}
          <div className="space-y-4">
            <h4 className="font-medium">Tasks Evaluation</h4>
            {submission.tasks.map((task, taskIndex) => (
              <div key={taskIndex} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between">
                  <h5 className="font-medium">{task.title}</h5>
                  <Badge variant="secondary">{task.type}</Badge>
                </div>
                
                {/* File Preview/Download */}
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">{task.submission}</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                
                {/* Evaluation Criteria */}
                <div className="space-y-4">
                  {task.criteria.map((criterion, criterionIndex) => (
                    <div key={criterionIndex} className="space-y-2">
                      <div className="flex justify-between">
                        <Label>{criterion.name}</Label>
                        <span className="text-sm">{criterion.score}/10</span>
                      </div>
                      <Slider
                        defaultValue={[criterion.score]}
                        max={10}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
                
                {/* Task Feedback */}
                <div className="space-y-2">
                  <Label>Task Feedback</Label>
                  <Textarea 
                    placeholder="Enter feedback for this task..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Scholarship Assignment */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Scholarship Assignment</h4>
              <Award className="h-5 w-5 text-muted-foreground" />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select scholarship slab" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="smart-mouth">Smart Mouth (5%)</SelectItem>
                <SelectItem value="smart-ass">Smart Ass (8%)</SelectItem>
                <SelectItem value="wise-ass">Wise Ass (10%)</SelectItem>
              </SelectContent>
            </Select>
            <Textarea 
              placeholder="Add justification for scholarship decision..."
              className="min-h-[100px]"
            />
          </div>

          <Separator />

          {/* Comments Section */}
          <div className="space-y-4">
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
            <Textarea 
              placeholder="Add a comment..."
              className="min-h-[100px]"
            />
            <Button className="w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Comment
            </Button>
          </div>

          {/* Save Changes */}
          <Button className="w-full">Save Evaluation</Button>
        </div>
      </ScrollArea>
    </div>
  );
}