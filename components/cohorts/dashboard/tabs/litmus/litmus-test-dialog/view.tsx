import { updateLitmusTaskStatus } from "@/app/api/student";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SelectSeparator } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { log } from "console";
import { ArrowUpRight, Download, File, FileIcon, FileText, FileTextIcon, HandMetal, ImageIcon, Link, Link2, Link2Icon, VideoIcon } from "lucide-react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { boolean } from "zod";

interface ReviewComponentProps {
  application: any;
  onApplicationUpdate: () => void; // Add this line
}

interface Section {
  title: string;
  data?: [];
}


export function ViewComponent({ application, onApplicationUpdate }: ReviewComponentProps) {
  
  const latestCohort = application?.appliedCohorts?.[application?.appliedCohorts.length - 1];
  const cohortDetails = latestCohort?.cohortId;
  const litmusTestDetails = latestCohort?.litmusTestDetails;
  const litmusTaskId = litmusTestDetails?._id ;

  const [rating, setRating] = useState<number>(litmusTestDetails?.performanceRating || 0);
  
  const [hoverRating, setHoverRating] = useState<number>(0);
  const max = 5;

  const handleClick = (value: number) => {
    setRating(value);
  };

  const handleMouseEnter = (value: number) => {
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };


  const sections: Section[] = [
    {
      title: "Strengths",
      data: litmusTestDetails?.overAllfeedback?.[0]?.feedback?.[0]?.data || [],
    },
    {
      title: "Weakness",
      data: litmusTestDetails?.overAllfeedback?.[0]?.feedback?.[1]?.data || [],
    },
    {
      title: "Opportunities",
      data: litmusTestDetails?.overAllfeedback?.[0]?.feedback?.[2]?.data || [],
    },
    {
      title: "Threats",
      data: litmusTestDetails?.overAllfeedback?.[0]?.feedback?.[3]?.data || [],
    },
  ];
  

  const [feedbackInputs, setFeedbackInputs] = useState<{ [title: string]: string }>({
    Strengths: "• ",
    Weakness: "• ",
    Opportunities: "• ",
    Threats: "• ",
  });


  useEffect(() => {
    let changed = false;
    const updatedFeedbackInputs = { ...feedbackInputs };
  
    sections?.forEach((section) => {
      if (section.data && section.data.length > 0) {
        const bulletLines = section.data.map((line) => `• ${line}`).join("\n");
        if (updatedFeedbackInputs[section.title] !== bulletLines) {
          updatedFeedbackInputs[section.title] = bulletLines;
          changed = true;
        }
      } else {
        if (!updatedFeedbackInputs[section.title].startsWith("• ")) {
          updatedFeedbackInputs[section.title] = "• ";
          changed = true;
        }
      }
    });
  
    // Only update if something actually changed
    if (changed) {
      setFeedbackInputs(updatedFeedbackInputs);
    }
  }, [sections, feedbackInputs]);
  


  const formatInput = (value: string): string => {
    const lines = value.split('\n');
    const formattedLines = lines.filter(line => {
      const trimmed = line.trimStart();
      return trimmed.startsWith('• ');
    });
    return formattedLines.join('\n');
  };


  const handleSectionKeyDown = (title: string, e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setFeedbackInputs((prev) => {
        const newValue = prev[title] + "\n• ";
        // Only apply formatInput here
        return {
          ...prev,
          [title]: formatInput(newValue),
        };
      });
    }
  };
  
  const handleSectionChange = (title: string, e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    // Just update the state without formatting
    setFeedbackInputs((prev) => ({
      ...prev,
      [title]: value,
    }));
  };
  

  const tasks = cohortDetails?.litmusTestDetail[0]?.litmusTasks || [];

  const [taskScores, setTaskScores] = useState<number[][]>(
    tasks.map((task: any, index: number) =>
      task.judgmentCriteria.map((criteria: any, cIndex: number) => {
        const initialScore = application?.litmusTestDetails?.[0]?.litmusTaskId?.results?.[index]?.score?.[cIndex]?.score || 0;
        return initialScore; // Return the initial score for this criteria
      })
    )
  );
  
  
  const handleSliderChange = (taskIndex: number, criteriaIndex: number, values: number[]) => {
    const val = values[0]; // slider returns an array
    setTaskScores((prev) => {
      const newScores = [...prev];
      const criteriaScores = [...newScores[taskIndex]];
      criteriaScores[criteriaIndex] = val;
      newScores[taskIndex] = criteriaScores;
      return newScores;
    });
  };

  return (
    <div className="space-y-3">
      {/* Header Section */}
      <div className="flex items-center gap-4 border-b pb-3">
        <Avatar className="h-16 w-16">
          <AvatarImage src={application?.profileUrl} className="object-cover" />
          <AvatarFallback>{application?.firstName?.[0] || "-"}{application?.lastName?.[0] || "-"}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h2 className="text-base font-semibold">{application?.firstName+" "+application?.lastName}</h2>
          <div className="flex gap-2 h-5 items-center">
            <p className="text-sm text-muted-foreground">{application?.email}</p>
            <Separator orientation="vertical" />
            <p className="text-sm text-muted-foreground">{application?.mobileNumber}</p>
          </div>
        </div>
      </div>

      {/* Task Section */}
      {cohortDetails?.litmusTestDetail[0]?.litmusTasks.map((Task: any, index: any) => (
      <div key={index} className="space-y-6 ">
      <div>
        <Badge variant='blue' className="px-3 mt-4 text-md font-semibold -mb-2">
          Task 0{index+1}
        </Badge>
      </div>

      <div className="space-y-3">
      <div className="">
        <p className="text-lg font-semibold pl-3">{Task.title}</p>
        <div className="space-y-2 list-disc pl-6 text-sm">{Task?.description}</div>
      </div>

      <div className="space-y-1">
        <h4 className="font-semibold pl-3">Resources</h4>
        <div className="space-y-2">
          <div className='w-full space-y-2'>
            {Task?.resources?.resourceFiles.map((file: any, index: number) => (
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

            {Task?.resources?.resourceLinks.map((link: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-2 mt-2 px-3 border rounded-xl ">
                <div className="flex items-center gap-2 ">
                  <Link2 className="w-4 h-4" />
                  <div className="text-white text-sm truncate max-w-[700px]">{link}</div>
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
    </div>

    {litmusTestDetails?.litmusTasks?.[litmusTestDetails?.litmusTasks.length - 1]?.tasks && 
     <div className="space-y-2">
        <Badge variant={'pending'} className="px-3 py-1 text-md font-medium">
          Submission 0{index+1}
        </Badge>
            {litmusTestDetails?.litmusTasks?.[litmusTestDetails?.litmusTasks.length - 1]?.tasks?.[index]?.texts?.map((textItem: string, id: number) => (
              <div key={`text-${id}`} className="flex items-center gap-2 mt-2 px-4 py-2 border rounded-xl">
                {textItem}
              </div>
            ))}
            {litmusTestDetails?.litmusTasks?.[litmusTestDetails?.litmusTasks.length - 1]?.tasks?.[index]?.links?.map((linkItem: string, id: number) => (
              <div key={`link-${id}`} className="flex items-center gap-2 mt-2 p-3 border rounded-xl">
                <Link2Icon className="w-4 h-4" />
                <a href={linkItem} target="_blank" rel="noopener noreferrer" className="text-white">
                  {linkItem}
                </a>
              </div>
            ))}
            {litmusTestDetails?.litmusTasks?.[litmusTestDetails?.litmusTasks.length - 1]?.tasks?.[index]?.images?.map((imageItem: string, id: number) => (
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
            {litmusTestDetails?.litmusTasks?.[litmusTestDetails?.litmusTasks.length - 1]?.tasks?.[index]?.videos?.map((videoItem: string, id: number) => (
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
            {litmusTestDetails?.litmusTasks?.[litmusTestDetails?.litmusTasks.length - 1]?.tasks?.[index]?.files?.map((fileItem: string, id: number) => (
              <div key={`file-${id}`} className="flex items-center gap-2 mt-2 p-3 border rounded-xl">
                <FileIcon className="w-4 h-4" />
                <a href={fileItem} target="_blank" rel="noopener noreferrer" className="text-white">
                  {fileItem.split('/').pop()}
                </a>
              </div>
            ))}
      </div>}

      {/* <div className="space-y-4">
        <h3 className="text-md font-medium">Criteria Evaluation</h3>
        {Task?.judgmentCriteria.map((criteria: any, cIndex: any) => (
          <div className="space-y-2 pl-3" key={cIndex}>
          <div className="flex justify-between">
            <Label>{criteria.name}</Label>
            <span className="text-sm">{[taskScores[index][cIndex]]}/{criteria.points}</span>
          </div>
          <Slider
            value={[taskScores[index][cIndex]]} // Use the state value
            max={criteria.points}
            step={1}
            className="w-full"
            onValueChange={(values) => handleSliderChange(index, cIndex, values)}
          />

        </div>))}
      </div> */}
      <SelectSeparator className="mt-8"/>
      </div>))}

      {/* Performance Rating Section */}
      {/* <div className="space-y-2">
        <div className="flex justify-between items-center my-6">
          <h3 className="">Performance Rating</h3>
          <div className="flex space-x-1">
          {Array.from({ length: max }, (_, i) => i + 1).map((value) => {
            const isFilled = hoverRating >= value || (!hoverRating && rating >= value);
            return (
              <button
                key={value}
                type="button"
                onClick={() => handleClick(value)}
                onMouseEnter={() => handleMouseEnter(value)}
                onMouseLeave={handleMouseLeave}
                className="focus:outline-none"
                aria-label={`Rate ${value} star${value > 1 ? 's' : ''}`}
              >
                <span
                  className={`text-2xl transition-colors ${
                    isFilled ? 'text-[#F8E000]' : 'text-[#A3A3A366]'
                  }`}
                >
                  ★
                </span>
              </button>
            );
          })}
        </div>
        </div>
      <SelectSeparator className="mt-8"/>
      </div> */}

      {/* Strengths and Weaknesses Section */}
      {/* <div className="space-y-4">
      <h3 className="">Feedback</h3>

      <div className="space-y-4">
      {sections.map((section) => (
        <Card key={section.title} className="p-4">
          <h4 className="flex gap-2 items-center text-base font-medium mb-3">
            <HandMetal className="w-4 h-4 rotate-90"/>{section.title}
          </h4>
            <Textarea
              id={section.title}
              value={feedbackInputs[section.title]}
              className="px-3 text-sm"
              onChange={(e) => handleSectionChange(section.title, e)}
              onKeyDown={(e) => handleSectionKeyDown(section.title, e)}
              placeholder="Type here..."
              rows={3}
              cols={40}
            />
        </Card>
      ))}
      </div>
    </div> */}
    
      {/* Publish Button */}
      {/* <div className="text-center">
        <Button className="w-full" onClick={handlePublish}>
          Publish Review
        </Button>
      </div> */}
    </div>
  );
}
