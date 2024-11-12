"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Plus, Trash2, GripVertical, FileIcon, LinkIcon, Link2Icon, XIcon, FolderPlus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface Task {
  id: string;
  title: string;
  type: string;
  description: string;
  config: {
    characterLimit?: number;
    maxFiles?: number;
    maxFileSize?: number;
    allowedTypes?: string[];
  };
}

interface ApplicationFormBuilderProps {
  onNext: () => void;
  initialData?: any;
}

const fileTypeOptions = {
  image: [
    { value: "image/jpeg", label: "JPEG" },
    { value: "image/png", label: "PNG" },
    { value: "image/gif", label: "GIF" },
    { value: "image/webp", label: "WebP" },
  ],
  video: [
    { value: "video/mp4", label: "MP4" },
    { value: "video/webm", label: "WebM" },
    { value: "video/quicktime", label: "MOV" },
  ],
  file: [
    { value: "application/pdf", label: "PDF" },
    { value: "application/msword", label: "DOC" },
    { value: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", label: "DOCX" },
    { value: "application/vnd.ms-powerpoint", label: "PPT" },
    { value: "application/vnd.openxmlformats-officedocument.presentationml.presentation", label: "PPTX" },
    { value: "text/plain", label: "TXT" },
  ],
};

export function ApplicationFormBuilder({ onNext }: ApplicationFormBuilderProps) {
  const [tasks, setTasks] = useState<Task[]>([ {
    id: Math.random().toString(36).substr(2, 9),
    title: "",
    type: "",
    description: "",
    config: {},
  }]);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [openTypeSelect, setOpenTypeSelect] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [resourceLink, setResourceLink] = useState("");
  const [isLinkInputVisible, setIsLinkInputVisible] = useState(false);
  const [addedLink, setAddedLink] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["All"]);

const toggleFileType = (type: string) => {
  if (type === "All") {
    setSelectedTypes(["All"]);
  } else {
    setSelectedTypes((prevTypes) => {
      if (prevTypes.includes(type)) {
        const newTypes = prevTypes.filter((t) => t !== type);
        return newTypes.length === 0 ? ["All"] : newTypes;
      } else {
        const newTypes = prevTypes.filter((t) => t !== "All");
        return [...newTypes, type];
      }
    });
  }
};

  const [submissionType, setSubmissionType] = useState<Array<{
    id: string;
    submissionType: string;
    characterLimit?: number;
    maxFiles?: number;
    maxFileSize?: number;
    allowedTypes?: string[];
  }>>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const handleAddLink = () => {
    setAddedLink(resourceLink);
    setResourceLink("");
    setIsLinkInputVisible(false);
  };

  const handleRemoveLink = () => {
    setAddedLink(null);
  };

  const addTask = () => {
    setTasks([
      ...tasks,
      {
        id: Math.random().toString(36).substr(2, 9),
        title: "",
        type: "",
        description: "",
        config: {},
      },
    ]);
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map((task) => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const updateTaskConfig = (id: string, config: Partial<Task['config']>) => {
    setTasks(tasks.map((task) => 
      task.id === id ? { ...task, config: { ...task.config, ...config } } : task
    ));
  };

  
  const addSubmissionType = () => {
    setSubmissionType([
      ...submissionType,
      {
        id: Math.random().toString(36).substr(2, 9),
        submissionType: "",
      },
    ]);
  };


  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedTaskId || draggedTaskId === targetId) return;

    const draggedIndex = tasks.findIndex(t => t.id === draggedTaskId);
    const targetIndex = tasks.findIndex(t => t.id === targetId);

    const newTasks = [...tasks];
    const [draggedTask] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, draggedTask);
    setTasks(newTasks);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  const renderConfigFields = (task: Task) => {

    switch (task.type) {
      case "short":
      case "long":
        return (
          <div className="grid w-1/2 gap-2">
            <Label>Character Limit</Label>
            <Input
              type="number"
              placeholder="Enter maximum characters"
              value={task.config.characterLimit || ""}
              onChange={(e) => updateTaskConfig(task.id, {
                characterLimit: parseInt(e.target.value) || undefined
              })}
            />
          </div>
        );

      case "image":
      case "video":
        return (
          <div className="flex gap-1.5">
            <div className="grid gap-2">
              <Label>Max No. of Files</Label>
              <Input
                type="number"
                placeholder="00"
                value={task.config.maxFiles || ""}
                onChange={(e) => updateTaskConfig(task.id, {
                  maxFiles: parseInt(e.target.value) || undefined
                })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Max Size per File(MB)</Label>
              <Input
                type="number"
                placeholder="15 MB"
                value={task.config.maxFileSize || ""}
                onChange={(e) => updateTaskConfig(task.id, {
                  maxFileSize: parseInt(e.target.value) || undefined
                })}
              />
            </div>
          </div>
        );

      case "file":
        return (
          <>
          <div className="flex gap-1.5">
            <div className="grid gap-2">
              <Label>Max No. of Files</Label>
              <Input
                type="number"
                placeholder="00"
                value={task.config.maxFiles || ""}
                onChange={(e) => updateTaskConfig(task.id, {
                  maxFiles: parseInt(e.target.value) || undefined
                })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Max Size per File(MB)</Label>
              <Input
                type="number"
                placeholder="15 MB"
                value={task.config.maxFileSize || ""}
                onChange={(e) => updateTaskConfig(task.id, {
                  maxFileSize: parseInt(e.target.value) || undefined
                })}
              />
            </div>
          </div>
          <div className="grid gap-2 mt-1">
            <Label>Allowed File Types</Label> 
              <div className="flex flex-wrap gap-1">
              {["All", "DOC Formats", "PPT Formats", "PDF", "Excel Formats", "PSD", "EPF", "AI"].map((type) => (
                <div key={type} className="flex items-center">
                <Checkbox id={type} className="hidden"
                  onClick={() => toggleFileType(type)}
                  checked={selectedTypes.includes(type)}
                  onChange={() => toggleFileType(type)}/>
                <Label
                  htmlFor={type}
                  className={`flex items-center cursor-pointer px-4 py-2 h-8 rounded-md border ${
                    selectedTypes.includes(type) ? "bg-[#6808FE]" : "bg-[#0A0A0A]"
                  }`}
                >
                  {type}
                </Label>
              </div>
              ))}
            </div>
          </div>
        </>
        );

        case "link":
        return (
          <div className="grid w-1/2 gap-2">
            <Label>Max No. of Links</Label>
            <Input
              type="number"
              placeholder="00"
              value={task.config.characterLimit || ""}
              onChange={(e) => updateTaskConfig(task.id, {
                characterLimit: parseInt(e.target.value) || undefined
              })}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto p-4">
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card 
            key={task.id}
            draggable
            onDragStart={(e) => handleDragStart(e, task.id)}
            onDragOver={(e) => handleDragOver(e, task.id)}
            onDragEnd={handleDragEnd}
            className={cn(
              "transition-opacity",
              draggedTaskId === task.id ? "opacity-50" : ""
            )}
          >
            <CardContent className="flex pl-0 items-start pt-6">
            <div className="cursor-grab px-4" onMouseDown={(e) => e.preventDefault()} >
              <GripVertical className="h-4 w-4" />
            </div>
              <div className="grid w-full gap-6">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-6 flex-1">
                    <div className="grid gap-3 flex-1">
                      <Label>Task Title</Label>
                      <Input 
                        placeholder="e.g., Share an Embarrassing Story" 
                        value={task.title}
                        onChange={(e) => updateTask(task.id, { title: e.target.value })}
                      />
                    </div>
                  </div>
                  {(tasks.length > 1 && <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => removeTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>)}
                </div>
                <div className="grid gap-3">
                  <Label>Description</Label>
                  <Textarea 
                    placeholder="Instructions or details"
                    value={task.description}
                    onChange={(e) => updateTask(task.id, { description: e.target.value })}
                  />
                </div>
                <div className="grid gap-3">
                  <Label>Submission Type</Label>
                  {submissionType.map((sub, id) => (
                    <div className="flex gap-1 items-start">
                  <div className="flex flex-wrap w-full bg-secondary p-3 gap-1.5">
                    <div className="flex flex-col flex-1 gap-2">
                      <Label className="text-[#00A3FF]">Submission Type 0{id+1}</Label>
                      <Select value={task.type} onValueChange={(value) => updateTask(task.id, { type: value, config: {} })} >
                        <SelectTrigger>
                          <SelectValue className="" placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">Short Answer</SelectItem>
                          <SelectItem value="long">Long Text</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="file">File</SelectItem>
                          <SelectItem value="link">Link</SelectItem>
                        </SelectContent>
                      </Select>
                    </div >
                    {task.type && renderConfigFields(task)}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className=""
                    onClick={() => setSubmissionType(submissionType.filter((s) => s.id !== sub.id))}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                  </div>
                  ))}
                  <Button variant='secondary' className="flex flex-1 gap-2" onClick={addSubmissionType}>
                      <FolderPlus className="w-4 h-4"/> Add a Submission Type
                    </Button>
                </div>
                <div className="grid gap-3">
                  <Label>Resources</Label>
                  {uploadedFile && (
                    <div className="flex items-center justify-between gap-2 mt-2 p-2 border rounded">
                      <div className="flex gap-2 items-center text-sm">
                        <FileIcon className="w-4 h-4" />
                        {uploadedFile.name}
                      </div>
                      <XIcon className="w-4 h-4 cursor-pointer" onClick={handleRemoveFile} />
                    </div>
                  )}
                  {isLinkInputVisible && (
                    <div className="relative flex items-center gap-2">
                      <Link2Icon className="absolute left-2 top-3 w-4 h-4" />
                      <Input
                        className="pl-8 text-sm"
                        placeholder="Enter URL here"
                        value={resourceLink}
                        onChange={(e) => setResourceLink(e.target.value)}
                      />
                      <Button
                        onClick={handleAddLink}
                        disabled={!resourceLink}
                        className="absolute right-2 top-1.5 h-7 rounded-full"
                      >
                        Add
                      </Button>
                    </div>
                  )}
          
                  {/* Display Added Link */}
                  {addedLink && (
                    <div className="flex items-center gap-2 p-2 border rounded">
                      <Link2Icon className="w-4 h-4" />
                      <span className="flex-1">{addedLink}</span>
                      <XIcon className="w-4 h-4 cursor-pointer" onClick={handleRemoveLink} />
                    </div>
                  )}
                  <div className="flex gap-2.5">
                    <Button variant='secondary' className="flex flex-1 gap-2" onClick={() => document.getElementById(`file-upload-${task.id}`)?.click()}>
                    <FileIcon className="w-4 h-4"/> Upload Resource File
                    </Button>
                    <input
                      type="file"
                      id={`file-upload-${task.id}`}
                      style={{ display: "none" }}
                      onChange={handleFileUpload}
                    />
                    <Button variant='secondary' className="flex flex-1 gap-2" onClick={() => setIsLinkInputVisible(true)}>
                      <Link2Icon className="w-4 h-4"/> Attach Resource Link
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={addTask} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Task
      </Button>

      <div className="space-y-2">
        <Label>Interview Scheduler (Calendly)</Label>
        <Textarea placeholder="Paste Calendly embed code" />
      </div>

      <Button onClick={onNext} className="w-full">
        Next: LITMUS Test
      </Button>
    </div>
  );
}