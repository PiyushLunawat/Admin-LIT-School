import React, { useEffect, useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getStudentApplication,
  updateStudentApplicationStatus,
  updateStudentTaskFeedback,
  updateStudentTaskFeedbackAccep,
} from "@/app/api/student";
import { Separator } from "@/components/ui/separator";
import { FileIcon, ImageIcon, Link2Icon, MinusIcon, PlusIcon, VideoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { log } from "console";
import { Textarea } from "@/components/ui/textarea";

interface Task {
  _id: string;
  title: string;
}

interface InterviewFeedbackProps {
  name: string;
  email: string;
  phone: string;
  tasks: string;
  initialStatus: string;
  ques: any;
  submission: any;
  onClose: () => void;
  onUpdateStatus: (status: string, feedback: { [key: string]: string[] }) => void;
}

const InterviewFeedback: React.FC<InterviewFeedbackProps> = ({
  name,
  email,
  phone,
  tasks,
  initialStatus,
  ques,
  submission,
  onClose,
  onUpdateStatus,
}) => {
  const [status, setStatus] = useState<string>(initialStatus || 'concluded');
  const [feedbacks, setFeedbacks] = useState<{
    [taskId: string]: string[];
  }>({});
  const [reason, setReason] = useState<string[]>([""]);
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [feedbackId, setFeedbackId] = useState("");
  const [reasonItemValue, setReasonItemValue] = useState("• ");


  useEffect(() => {
    async function fetchApplicationDetails() {
      try {
        const applicationDetails = await getStudentApplication(tasks);
        console.log("Application Details:", applicationDetails.data.applicationTasks[0]?.tasks);
        setTaskList(applicationDetails.data.applicationTasks[0]?.tasks || []);
        setFeedbackId(applicationDetails.data?.applicationTasks[0]?._id)
      } catch (error) {
        console.error("Error fetching application details:", error);
      }
    }
    fetchApplicationDetails();
  }, [tasks]);

  const handleStatusChange = (value: string) => {
    setStatus(value);
    if (value === "on hold") {
      // If reason is effectively empty, initialize with a bullet
      if (reasonItemValue.trim() === "" || reasonItemValue.trim() === "•") {
        setReasonItemValue("• ");
      }
    } else if (value === "accepted" || value === "rejected") {
      setFeedbacks((prevFeedbacks) => {
        const newFeedbacks = { ...prevFeedbacks };
        // For each task, if there is no feedback or it's empty, init with ["• "]
        taskList.forEach((task) => {
          const existing = newFeedbacks[task._id];
          if (!existing || existing.length === 0) {
            newFeedbacks[task._id] = ["• "];
          }
        });
        return newFeedbacks;
      });
    }
  };

  const formatInput = (value: string): string => {
    const lines = value.split('\n');
    const formattedLines = lines.filter(line => {
      const trimmed = line.trimStart();
      return trimmed.startsWith('• ');
    });
    return formattedLines.join('\n');
  };

  const handleKeyDownForReasons = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setReasonItemValue(prevValue => {
        const newValue = prevValue + '\n• ';
        return formatInput(newValue);
      });
    }
  };

  const handleChangeForReasons = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setReasonItemValue(formatInput(value));
  };
  
  const canUpdate = (): boolean => {
      const trimmed = reasonItemValue.replace(/•/g, "").trim();
      return trimmed.length > 0;
    return true; // fallback
  };

  async function handleApplicationUpdate(
    applicationId: string,
    newStatus: string
  ) {
    try {
        const validReasons = reason.filter((r) => r.trim() !== "");
        console.log("Sending feedback:", {
          feedbackId,
          newStatus,
          feedbackData: validReasons,
        });

        const feedback = { feedbackData: validReasons };
        const res = await updateStudentTaskFeedback( applicationId, feedbackId, newStatus, feedback, );
        console.log( `Feedback for application ${applicationId} submitted successfully`, res );
    
      onUpdateStatus(newStatus, feedbacks);
      onClose();
    } catch (error) {
      console.error("Failed to update application status or feedback:", error);
    }
  }

  return (
    <div className="">
      <div className="flex justify-between items-center pb-4 border-b border-gray-700 mb-4">
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">{email}</p>
          <p className="text-sm text-muted-foreground">{phone}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Status Selector */}
        <div>
          <Label>Status</Label>
          <Select onValueChange={handleStatusChange} value={status}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="concluded">Interview Concluded</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

          <div>
            <Label className="text-lg ">Feedback</Label>
            <Textarea
              id="reasonItem"
              value={reasonItemValue}
              className="px-3 text-base"
              onChange={handleChangeForReasons}
              onKeyDown={handleKeyDownForReasons}
              placeholder="Type here..."
              rows={3}
              cols={40}
            />
          </div>

        <Button
          className="w-full mt-4"
          onClick={() => handleApplicationUpdate(tasks, status)}
          disabled={!canUpdate()}
        >
          Update Interview Status
        </Button>
      </div>
    </div>
  );
};

export default InterviewFeedback;
