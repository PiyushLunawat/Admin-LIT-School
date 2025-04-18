import React, { useEffect, useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateInterviewStatus } from "@/app/api/student";

interface InterviewFeedbackProps {
  name: string;
  email: string;
  phone: string;
  applicationId: string;
  initialStatus: string;
  interview: any;
  onClose: () => void;
  onUpdateStatus: (status: string, feedback: { [key: string]: string[] }) => void;
}

const InterviewFeedback: React.FC<InterviewFeedbackProps> = ({
  name,
  email,
  phone,
  applicationId,
  initialStatus,
  interview,
  onClose,
  onUpdateStatus,
}) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>(initialStatus || "concluded");
  const [feedbacks, setFeedbacks] = useState<{ [taskId: string]: string[] }>({});
  const [reason, setReason] = useState<string[]>([]);
  const [reasonItemValue, setReasonItemValue] = useState("• ");

  const handleStatusChange = (value: string) => {
    setStatus(value);
    if (reasonItemValue.trim() === "" || reasonItemValue.trim() === "•") {
      setReasonItemValue("• ");
    }
  };

  const formatInput = (value: string): string => {
    const lines = value.split("\n");
    const formattedLines = lines.filter((line) => {
      const trimmed = line.trimStart();
      return trimmed.startsWith("• ");
    });
    return formattedLines.join("\n");
  };

  const handleKeyDownForReasons = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setReasonItemValue((prevValue) => {
        const newValue = prevValue + "\n• ";
        return formatInput(newValue);
      });
    }
  };

  const handleChangeForReasons = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setReasonItemValue(formatInput(value));
    // Update reason array based on input
    const reasons = value
      .split("\n")
      .filter((line) => line.trim().startsWith("• "))
      .map((line) => line.trim());
    setReason(reasons);
  };

  const canUpdate = (): boolean => {
    return (reason.length > 0 && ['not qualified', 'waitlist', 'selected'].includes(status)); 
  };

  async function handleInterviewUpdate(newStatus: string) {
    setLoading(true);
    try {
      const validReasons = reason
      .map((line) => line.trim().replace(/^•\s*/, "")) // Remove bullets and trim spaces
      .filter((r) => r.trim() !== "");
      const meetingId = interview?._id;
  
      // Build a normal object (not FormData)
      const payload = {
        meetingId,
        meetingStatus: "concluded", // Always concluded
        feedback: validReasons,
        applicationId,
        applicationStatus: newStatus,
      };
      console.log("Interview update response", payload);
  
      // Send it as JSON
      const response = await updateInterviewStatus(JSON.stringify(payload));
      console.log("Interview update response", response);
  
      onUpdateStatus(newStatus, feedbacks);
      onClose();
    } catch (error) {
      console.error("Failed to update application status or feedback:", error);
    } finally {
      setLoading(false);
    }
  }
  

  return (
    <div>
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
              {!['not qualified', 'waitlist', 'selected'].includes(status) &&
                <SelectItem className="capitalize" value={status}>
                  <span className="capitalize">{status}</span>
                </SelectItem>
              }
              <SelectItem value="waitlist">Waitlist</SelectItem>
              <SelectItem value="selected">Accepted</SelectItem>
              <SelectItem value="not qualified">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-lg ">Feedback</Label>
          <Textarea
            id="reasonItem"
            value={reasonItemValue}
            className="px-3 text-base h-[125px]"
            onChange={handleChangeForReasons}
            onKeyDown={handleKeyDownForReasons}
            placeholder="Type here..."
            rows={3}
            cols={40}
          />
        </div>

        <Button
          className="w-full mt-4"
          onClick={() => handleInterviewUpdate(status)}
          disabled={!canUpdate() || loading
            //  || latestCohort?.status === 'dropped'
            }
        >
          Update Interview Status
        </Button>
      </div>
    </div>
  );
};

export default InterviewFeedback;
