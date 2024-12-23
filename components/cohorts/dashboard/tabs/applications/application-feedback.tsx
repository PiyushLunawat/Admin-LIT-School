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

interface ApplicationFeedbackProps {
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

const ApplicationFeedback: React.FC<ApplicationFeedbackProps> = ({
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
  const [status, setStatus] = useState<string>(initialStatus);
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
        console.log("Application Details:", applicationDetails.data.applicationTasks[0]?._id);
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
    if (value !== "on hold" && value !== "rejected") {
      setReasonItemValue("• ");
    } else if (reason.length === 0) {
      setReasonItemValue("• ");
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

  const handleFeedbackKeyDownForFeedback = (taskId: string, idx: number, e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setFeedbacks(prevFeedbacks => {
        
        const taskFeedback = prevFeedbacks[taskId] || [];
        const updatedValue = formatInput((taskFeedback[idx] || "") + '\n• ');
        console.log("11",updatedValue);
        const newTaskFeedback = [...taskFeedback];
        newTaskFeedback[idx] = updatedValue;
        return { ...prevFeedbacks, [taskId]: newTaskFeedback };
      });
    }
  };

  const handleFeedbackChangeForFeedback = (taskId: string, idx: number, e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setFeedbacks(prevFeedbacks => {
      const taskFeedback = prevFeedbacks[taskId] || [];
      const newTaskFeedback = [...taskFeedback];
      newTaskFeedback[idx] = formatInput(value);
      console.log("2",formatInput(newTaskFeedback[0]));

      return { ...prevFeedbacks, [taskId]: [formatInput(newTaskFeedback[0])] };
    });
  };
  
  async function handleApplicationUpdate(
    applicationId: string,
    newStatus: string
  ) {
    try {
      if (newStatus === "under review") {

        const res = await updateStudentApplicationStatus(
          applicationId,
          newStatus,
        );

        console.log(
          `Feedback for application ${applicationId} submitted successfully`,
          res
        );
      }

      else if (newStatus === "on hold") {
        // Filter out empty reasons
        const validReasons = reasonItemValue
        .split('\n') // Split the string into individual lines
        .map((line) => line.trim().replace(/^•\s*/, "")) // Remove bullets and trim spaces
        .filter((r) => r.trim() !== ""); // Filter out empty lines

        console.log("Sending feedback:", {
          feedbackId,
          newStatus,
          feedbackData: validReasons,
        });

        const feedback = {
          feedbackData: validReasons
        };
      

        const res = await updateStudentTaskFeedback(
          applicationId,
          feedbackId,
          newStatus,
          feedback,
        );

        console.log(
          `Feedback for application ${applicationId} submitted successfully`,
          res
        );
      }
      
      else if (newStatus === "rejected" || newStatus === "accepted") {
        // Prepare an array of task feedback
        console.log("cons",feedbacks)
        const feedbackData = Object.keys(feedbacks).map((taskId) => {
          // Flatten all lines from all entries
          const lines = feedbacks[taskId]
            .flatMap(entry => entry.split('\n'))            // split each entry by new line
            .map(line => line.replace(/^•\s*/, '').trim())  // remove bullet and trim
            .filter(line => line.length > 0);               // remove empty lines if any
        
          return {
            taskId,
            feedback: lines,
          };
        });
        
        console.log("Transformed Feedback:", feedbackData);
      

        console.log("Accepted feedback:", {
          applicationId,
          feedbackId,
          newStatus,
          feedbackData,
        });

        // Send feedback data to backend
        const res = await updateStudentTaskFeedbackAccep(
          applicationId,
          feedbackId,
          newStatus,
          { feedbackData }
        );
        console.log(
          `Feedback for application ${applicationId} submitted successfully`,
          res
        );
      }

      // // Update application status
      // const result = await updateStudentApplicationStatus(
      //   applicationId,
      //   newStatus
      // );
      // console.log("Application status updated successfully:", result);

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
              <SelectItem value="under review">Under Review</SelectItem>
              <SelectItem value="on hold">On Hold</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>


       
          <>
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Course Dive</h3>
            <div className='space-y-1'>
              <h4 className="font-medium text-[#00A3FF]">Why are you interested in joining The LIT School?</h4>
              <div className="mt-2">
                <div className="flex items-center gap-2 mt-2 px-4 py-2 border rounded-xl">{submission?.courseDive?.text1}</div> 
              </div>
            </div>
            <div className='space-y-1'>
              <h4 className="font-medium text-[#00A3FF]">What are your career goals or aspirations??</h4>
              <div className="mt-2">
                <div className="flex items-center gap-2 mt-2 px-4 py-2 border rounded-xl">{submission?.courseDive?.text2}</div> 
              </div>
            </div>
          </div>

          <Separator className="my-8" />

        {ques.map((task: any, index: any) => (<>
          <div key={index} className="space-y-1">
            <h3 className="text-lg font-semibold">Task 0{index + 1}</h3>
            <div className='space-y-1'>
              <h4 className="font-medium text-[#00A3FF]">{task?.title}</h4>
              <p className="text-sm text-muted-foreground">{task?.description}</p>
            </div>

            <div className="mt-4">
              <div className='flex justify-between items-center'>
                <Badge variant="lemon"  className="px-3 py-2 text-sm bg-[#FFF552]/[0.2] border-[#FFF552]">
                  Submission
                </Badge>
                <div className="text-muted-foreground text-sm mt-2">
                  Type: {task?.config
                      .map((configItem: any) => configItem?.type)
                      .join(", ")}
                </div>
              </div>
              {submission?.tasks[index]?.task?.text?.map((textItem: string, id: number) => (
              <div key={`text-${id}`} className="flex items-center gap-2 mt-2 px-4 py-2 border rounded-xl">
                {textItem}
              </div>
            ))}
            {submission?.tasks[index]?.task?.links?.map((linkItem: string, id: number) => (
              <div key={`link-${id}`} className="flex items-center gap-2 mt-2 p-2 border rounded-xl">
                <Link2Icon className="w-4 h-4" />
                <a href={linkItem} target="_blank" rel="noopener noreferrer" className="text-white">
                  {linkItem}
                </a>
              </div>
            ))}
            {submission?.tasks[index]?.task?.images?.map((imageItem: string, id: number) => (
              <div key={`image-${id}`} className="flex items-center gap-2 mt-2 p-2 border rounded-xl">
                <ImageIcon className="w-4 h-4" />
                <a href={imageItem} target="_blank" rel="noopener noreferrer" className="text-white">
                  {imageItem.split('/').pop()}
                </a>
              </div>
            ))}
            {submission?.tasks[index]?.task?.videos?.map((videoItem: string, id: number) => (
              <div key={`video-${id}`} className="flex items-center gap-2 mt-2 p-2 border rounded-xl">
                <VideoIcon className="w-4 h-4" />
                <a href={videoItem} target="_blank" rel="noopener noreferrer" className="text-white">
                  {videoItem.split('/').pop()}
                </a>
              </div>
            ))}
            {submission?.tasks[index]?.task?.files?.map((fileItem: string, id: number) => (
              <div key={`file-${id}`} className="flex items-center gap-2 mt-2 p-2 border rounded-xl">
                <FileIcon className="w-4 h-4" />
                <a href={fileItem} target="_blank" rel="noopener noreferrer" className="text-white">
                  {fileItem.split('/').pop()}
                </a>
              </div>
            ))}
            </div>

        {(status === "accepted" || status === "rejected") && (
          <>
            <h4 className="font-medium !mt-4">Feedback</h4>
            <div key={taskList[index]?._id}>
              {/* Feedback input for each task */}
              <div className="w-full grid border rounded-md ">
              {(feedbacks[taskList[index]?._id] || [""]).map((feedbackItem, idx) => (
                <div key={idx} className="flex items-center space-x-2 mb-2 w-full">
                    <Textarea
                      id="feedbackItem"
                      value={feedbackItem}
                      className="px-3 text-base w-full"
                      onChange={(e) => handleFeedbackChangeForFeedback(taskList[index]?._id, idx, e)}
                      onKeyDown={(e) => handleFeedbackKeyDownForFeedback(taskList[index]?._id, idx, e)}
                      placeholder="Type here..."
                      rows={3}
                      cols={40}
                      />
                  </div>
              ))}
              </div>  
            </div>
          </>
        )}
          </div>
            {index < ques?.length - 1 && <Separator className="my-8" />}
        </>))}
        </>  

        {/* Conditional Reason or Feedback */}
        {(status === "on hold") && (
          <div>
            <Label className="text-lg ">Provide Reasons</Label>
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
        )}
        
        <Button
          className="w-full mt-4"
          onClick={() => handleApplicationUpdate(tasks, status)}
        >
          Update Status
        </Button>
      </div>
    </div>
  );
};

export default ApplicationFeedback;
