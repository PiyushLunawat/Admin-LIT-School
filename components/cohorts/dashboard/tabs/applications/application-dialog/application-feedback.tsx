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
import { ArrowUpRight, Download, FileIcon, ImageIcon, Link2, Link2Icon, MinusIcon, PlusIcon, VideoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { log } from "console";
import { Textarea } from "@/components/ui/textarea";

interface Task {
  _id: string;
  title: string;
}

interface ApplicationFeedbackProps {
  application: any;
  initialStatus: string;
  ques: any;
  submission: any;
  onClose: () => void;
  onUpdateStatus: (status: string, feedback: { [key: string]: string[] }) => void;
}

const ApplicationFeedback: React.FC<ApplicationFeedbackProps> = ({
  application, initialStatus, ques, submission, onClose, onUpdateStatus,
}) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>(initialStatus);
  const [feedbacks, setFeedbacks] = useState<{ [taskId: string]: string[]; }>({});
  const [reason, setReason] = useState<string[]>([""]);
  const [reasonItemValue, setReasonItemValue] = useState("• ");

  const latestCohort = application?.appliedCohorts?.[application?.appliedCohorts.length - 1];
  const applicationId = latestCohort?.applicationDetails?._id;
  const applicationTaskId = latestCohort?.applicationDetails?.applicationTasks?.[latestCohort?.applicationDetails?.applicationTasks.length - 1]?._id;
  const subTaskId = latestCohort?.applicationDetails?.applicationTasks?.[latestCohort?.applicationDetails?.applicationTasks.length - 1]?.applicationTasks[0]?._id;

  const taskList = (latestCohort?.applicationDetails?.applicationTasks[0]?.applicationTasks[0]?.tasks || []);

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
        taskList.forEach((task: any) => {
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
  
  const canUpdate = (): boolean => {
    if (status === "under review") return false;

    if (status === "on hold") {
      // Make sure there's something beyond just "• " in reasonItemValue
      const trimmed = reasonItemValue.replace(/•/g, "").trim();
      return trimmed.length > 0;
    }

    if (status === "accepted" || status === "rejected") {
      // Check if for each task, there's feedback that isn't purely bullet(s).
      const allFeedback = Object.values(feedbacks).flat(); // Flatten all tasks
      // If we find at least some text beyond "• ", we consider it valid
      return allFeedback.some((fb) => {
        const stripped = fb.replace(/•/g, "").trim();
        return stripped.length > 0;
      });
    }
    return true; // fallback
  };

  async function handleApplicationUpdate(
    status: string
  ) {
    try {
      setLoading(true)
        if (status === "on hold") {
        // Filter out empty reasons
        const validReasons = reasonItemValue
        .split('\n') // Split the string into individual lines
        .map((line) => line.trim().replace(/^•\s*/, "")) // Remove bullets and trim spaces
        .filter((r) => r.trim() !== ""); // Filter out empty lines

        
        const feedback = {
          feedbackData: validReasons
        };
        
        console.log("Sending feedback:", {
          applicationId,
          applicationTaskId,
          subTaskId,
          status,
          feedback,
        });

        const res = await updateStudentTaskFeedback(
          applicationId,
          applicationTaskId,
          subTaskId,
          status,
          feedback,
        );

        console.log(
          `Feedback for application ${applicationId} submitted successfully`,
          res
        );
      }
      
      else if (status === "rejected" || status === "accepted") {
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
          applicationTaskId,
          subTaskId,
          status,
          feedbackData
        });

        // Send feedback data to backend
        const res = await updateStudentTaskFeedbackAccep(
          applicationId,
          applicationTaskId,
          subTaskId,
          status,
          { feedbackData }
        );
        console.log(
          `Feedback for application ${applicationId} submitted successfully`,
          res
        );
      }

      onUpdateStatus(status, feedbacks);
      onClose();
    } catch (error) {
      console.error("Failed to update application status or feedback:", error);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="">
      <div className="flex justify-between items-center pb-4 border-b border-gray-700 mb-4">
        <div>
          <h3 className="text-lg font-semibold">{application?.firstName+' '+application?.lastName}</h3>
          <p className="text-sm text-muted-foreground">{application?.email}</p>
          <p className="text-sm text-muted-foreground">{application?.mobileNumber}</p>
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

        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Course Dive</h3>
            <div className='space-y-1'>
              <h4 className="font-medium text-[#00A3FF]">Why are you interested in joining The LIT School?</h4>
              <div className="mt-2">
                <div className="flex items-center gap-2 text-sm mt-2 px-4 py-2 border rounded-xl">{submission?.courseDive?.[0]}</div> 
              </div>
            </div>
            <div className='space-y-1'>
              <h4 className="font-medium text-[#00A3FF]">What are your career goals or aspirations??</h4>
              <div className="mt-2">
                <div className="flex items-center gap-2 text-sm mt-2 px-4 py-2 border rounded-xl">{submission?.courseDive?.[1]}</div> 
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {ques.map((task: any, index: any) => (
          <React.Fragment key={index}>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Task 0{index + 1}</h3>
              <div className="space-y-1">
                <h4 className="font-medium text-[#00A3FF]">{task?.title}</h4>
                <p className="text-sm text-muted-foreground">{task?.description}</p>
              </div>

              <div className="space-y-1">
                <h4 className="font-semibold pl-3">Resources</h4>
                <div className="space-y-2">
                  <div className='w-full space-y-2'>
                    {task?.resources?.resourceFiles.map((file: any, index: number) => (
                      <div key={index} className="flex items-center justify-between gap-2 mt-2 px-3 border rounded-xl ">
                        <div className="flex items-center gap-2">
                          <FileIcon className="w-4 h-4" />
                          <span className="text-white text-sm truncate max-w-[700px]">{file.split('/').pop()}</span>
                        </div>
                        <Button variant="ghost" size="icon" type='button' onClick={() => window.open(file, "_blank")}
                          className="text-white rounded-xl">
                          <ArrowUpRight className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
  
                    {task?.resources?.resourceLinks.map((link: any, index: number) => (
                      <div key={index} className="flex items-center justify-between gap-2 mt-2 px-3 border rounded-xl ">
                        <div className="flex items-center gap-2 truncate">
                          <Link2 className="w-4 h-4" />
                          <span className="text-white text-sm truncate max-w-[700px]">{link}</span>
                        </div>
                        <Button
                          variant="ghost" size="icon" type='button' onClick={() => window.open(link, "_blank")}
                          className="text-white rounded-xl">
                          <ArrowUpRight className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <Badge variant="pending" className="px-3 py-2 text-sm">
                    Submission
                  </Badge>
                  <div className="text-muted-foreground text-sm mt-2">
                    Type:{" "}
                    {task?.config.map((configItem: any) => configItem?.type).join(", ")}
                  </div>
                </div>
                <div className='flex flex-wrap gap-2 mt-2'>
                  {submission?.tasks[index]?.text?.map((textItem: string, id: number) => (
                    <div key={`text-${id}`} className="w-full flex items-center gap-2 text-sm px-4 py-2 border rounded-xl">
                      {textItem}
                    </div>
                  ))}
                  {submission?.tasks[index]?.links?.map((linkItem: string, id: number) => (
                    <div key={`link-${id}`} className="w-full flex items-center justify-between gap-2 text-sm p-3 border rounded-xl">
                      <div className='flex items-center gap-2 text-sm truncate'>
                        <Link2Icon className="w-4 h-4" />
                        <a href={linkItem} target="_blank" rel="noopener noreferrer" className="text-white">
                          {linkItem}
                        </a>
                      </div>
                      <Button variant="ghost" size="icon" type='button' className="text-white rounded-xl"
                        onClick={() => window.open(linkItem, "_blank")}>
                        <Download className="w-4 h-4 " />
                      </Button>
                    </div>
                  ))}
                  {submission?.tasks[index]?.images?.map((imageItem: string, id: number) => (
                    <div key={`image-${id}`} className="w-full flex flex-col items-center text-sm border rounded-xl">
                      <img src={imageItem} alt={imageItem.split('/').pop()} className='w-full h-[420px] object-contain rounded-t-xl' />
                      <div className='w-full flex justify-between items-center p-3 border-t'>
                        <div className='flex items-center gap-2 text-sm truncate'>
                          <ImageIcon className="w-4 h-4" />
                          <span className='w-[220px] text-white truncate'>
                            {imageItem.split('/').pop()}
                          </span>
                        </div>
                        <Button variant={'ghost'} size={'zero'} className=''>
                          <a href={imageItem} target="_blank" rel="noopener noreferrer" className="">
                            <Download className="w-4 h-4 " />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                  {submission?.tasks[index]?.videos?.map((videoItem: string, id: number) => (
                    <div key={`video-${id}`} className="w-full flex flex-col w-fit items-center text-sm border rounded-xl">
                      <video controls preload="none" className='h-[420px] rounded-t-xl'>
                        <source src={videoItem} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <div className='w-full flex justify-between items-center p-3 border-t'>
                        <div className='flex items-center gap-2 text-sm truncate'>
                          <VideoIcon className="w-4 h-4" />
                          <span className='w-[220px] text-white truncate'>
                            {videoItem.split('/').pop()}
                          </span>
                        </div>
                        <Button variant={'ghost'} size={'zero'} className=''>
                          <a href={videoItem} target="_blank" rel="noopener noreferrer" className="">
                            <Download className="w-4 h-4 " />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                  {submission?.tasks[index]?.files?.map((fileItem: string, id: number) => (
                    <div key={`file-${id}`} className="w-full flex items-center justify-between gap-2 text-sm p-3 border rounded-xl">
                      <div className='flex items-center gap-2 text-sm truncate'>
                        <FileIcon className="w-4 h-4" />
                        <a href={fileItem} target="_blank" rel="noopener noreferrer" className="text-white">
                          {fileItem.split('/').pop()}
                        </a>
                      </div>
                      <Button variant={'ghost'} size={'zero'} className=''>
                        <a href={fileItem} target="_blank" rel="noopener noreferrer" className="">
                          <Download className="w-4 h-4 " />
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {(status === "accepted" || status === "rejected") && (
                <>
                  <h4 className="font-medium !mt-4">Feedback</h4>
                  <div key={taskList[index]?._id}>
                    <div className="w-full grid border rounded-md ">
                      {(feedbacks[taskList[index]?._id] || [""]).map((feedbackItem, idx) => (
                        <div key={idx} className="flex items-center space-x-2 mb-2 w-full">
                          <Textarea
                            id="feedbackItem"
                            value={feedbackItem}
                            className="px-3 text-base w-full"
                            onChange={(e) =>
                              handleFeedbackChangeForFeedback(taskList[index]?._id, idx, e)
                            }
                            onKeyDown={(e) =>
                              handleFeedbackKeyDownForFeedback(taskList[index]?._id, idx, e)
                            }
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
          </React.Fragment>
        ))}

        {/* Conditional Reason or Feedback */}
        {(status === "on hold") && (
          <div className="space-y-1">
            <Label className="text-lg ">Provide Reasons</Label>
            <Textarea
              id="reasonItem"
              value={reasonItemValue}
              className="px-3 text-base"
              onChange={handleChangeForReasons}
              onKeyDown={handleKeyDownForReasons}
              placeholder="Type here..."
              rows={5}
              cols={40}
              />
          </div>
        )}
        
        <Button
          className="w-full mt-4"
          onClick={() => handleApplicationUpdate(status)}
          disabled={!canUpdate() || loading || latestCohort?.status === 'dropped'}
        >
          {loading ? 'Updating...' : 'Update Status'}
        </Button>
      </div>
    </div>
  );
};

export default ApplicationFeedback;
