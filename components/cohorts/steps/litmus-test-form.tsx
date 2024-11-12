"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChangeEvent, useState } from "react";
import { CrossIcon, FileIcon, FilePlus, FolderPlus, GripVertical, Link2Icon, Plus, PlusIcon, Trash2, XIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface LitmusTestFormProps {
  onNext: () => void;
  initialData?: any;
}

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

export function LitmusTestForm({ onNext }: LitmusTestFormProps) {
  const [tasks, setTasks] = useState<Task[]>([{
    id: Math.random().toString(36).substr(2, 9),
    title: "",
    type: "",
    description: "",
    config: {},
  }]);


  const [submissionType, setSubmissionType] = useState<Array<{
    id: string;
    submissionType: string;
    characterLimit?: number;
    maxFiles?: number;
    maxFileSize?: number;
    allowedTypes?: string[];
  }>>([]);

  const [judgementCriteria, setJudgementCriteria] = useState<Array<{
    id: string;
    name: string;
    points: number;
    description: string;
  }>>([]);

  const [scholarshipSlabs, setScholarshipSlabs] = useState<Array<{
    id: string;
    name: string;
    percentage: number;
    clearance: number;
    description: string;
  }>>([]);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [resourceLink, setResourceLink] = useState("");
  const [isLinkInputVisible, setIsLinkInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [addedLink, setAddedLink] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["All"]);
  const suggestions = ["Communication", "Creativity", "Leadership", "Teamwork", "Problem Solving"];
  const [suggestedItems, setSuggestedItems] = useState<string[]>(suggestions);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [showdescription, setShowdescription] = useState(false);

  const handleAddCriteria = (name: string) => {
    if (name.trim()) {
      console.log("Criteria added:", name);
      setInputValue("");
      setShowSuggestion(false); // Hide suggestions after adding
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleAddCriteria(suggestion);
    setInputValue(suggestion);
    setShowSuggestion(false); // Hide suggestions after selection
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Filter suggestions based on user input
    if (value) {
      const filteredSuggestions = suggestedItems.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestedItems(filteredSuggestions);
      setShowSuggestion(filteredSuggestions.length > 0);
    } else {
      setSuggestedItems(["Communication", "Creativity", "Leadership", "Teamwork", "Problem Solving"]); // Reset suggestions
      setShowSuggestion(false);
    }
  };


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

  const addJudgementCriteria = () => {
    setJudgementCriteria([
      ...judgementCriteria,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: "",
        points: 0,
        description:"",
      },
    ]);
  };

  const addScholarshipSlab = () => {
    setScholarshipSlabs([
      ...scholarshipSlabs,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: "",
        percentage: 0,
        clearance: 0,
        description:"",
      },
    ]);
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
    <div className="max-h-[80vh] overflow-y-auto space-y-6 py-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">LITMUS Tasks</h3>
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="flex pl-0 items-start pt-6">
            <div className="cursor-grab px-4" onMouseDown={(e) => e.preventDefault()} >
              <GripVertical className="h-4 w-4" />
            </div>
              <div className="grid w-full gap-6">
                <div className="flex justify-between items-end">
                  <div className="grid gap-3 flex-1">
                    <Label>Task Title</Label>
                    <Input placeholder="e.g., Create a pitch deck" />
                  </div>
                  {(tasks.length > 1 && <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => setTasks(tasks.filter((t) => t.id !== task.id))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>)}
                </div>
                <div className="grid gap-3">
                  <Label>Description</Label>
                  <Textarea placeholder="Instructions or details" />
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
                  <Label>Judgement Criteria</Label>
                  {judgementCriteria.map((cri, id) => (
                    <div className="flex gap-1 items-start">
                    <div className=" w-full bg-secondary/60 p-3 gap-1.5">
                    <div className="flex gap-1.5 items-center">
                    <div className="grid w-1/2 gap-2">
                      <Label className="text-[#00A3FF]">Criteria 0{id+1}</Label>
                      <div className="relative">
        <div className="w-full border-b border-[#27272A] py-2 flex justify-between items-center">
          <Input
            id="criteria"
            className=" "
            type="text"
            placeholder="Type Here"
            value={inputValue}
            onChange={handleInputChange}
            required
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddCriteria(inputValue);  // Use inputValue to add criteria
                }
              }}
            onClick={() => { setShowSuggestion(true); }}
          />
        </div>
        {showSuggestion && suggestedItems.length > 0 && (
        <ul className="absolute left-0 top-full mt-1 bg-[#09090B] border text-white shadow-lg rounded-md z-10 w-full">
          {suggestedItems.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-700"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      </div>
                      </div >
                      <div className="w-1/2 grid gap-2">
                        <Label>Max Points</Label>
                        <Input type="number" placeholder="10" />
                      </div>
                     </div>
                    <div className="grid gap-2 mt-2">
                      <Label>Describe this criteria</Label>
                      <Textarea  placeholder="Type here" />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className=""
                    onClick={() => setJudgementCriteria(judgementCriteria.filter((s) => s.id !== cri.id))}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                  </div>
                  ))}
                  <Button variant='secondary' className="flex flex-1 gap-2" onClick={addJudgementCriteria}>
                      <PlusIcon className="w-4 h-4"/> Add Judgement Criteria
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
        <Button onClick={addTask} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Scholarship Slabs</h3>
        {scholarshipSlabs.map((slab) => (
          <Card key={slab.id}>
            <CardContent className="flex pl-0 items-start pt-6">
            <div className="cursor-grab px-4" onMouseDown={(e) => e.preventDefault()} >
              <GripVertical className="h-4 w-4" />
            </div>
              <div className="grid w-full gap-4">
                <div className="flex justify-between items-end">
                  <div className="grid gap-3 flex-1">
                    <Label>Slab Name</Label>
                    <Input placeholder="e.g., Smart Mouth" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => setScholarshipSlabs(scholarshipSlabs.filter((s) => s.id !== slab.id))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                 <div className="flex gap-1.5 items-center">
                  <div className="w-1/2 grid gap-3">
                    <Label>Scholarship Percentage</Label>
                    <Input placeholder="5" />
                  </div>
                  <div className="w-1/2 grid gap-3">
                    <Label>LITMUS Challenge Clearanc</Label>
                    <Input placeholder="10-30" />
                  </div>
                 </div>
                <div className="grid gap-3">
                  <Label>Scholarship Description</Label>
                  <Textarea  placeholder="Describe who is this scholorship for?" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        <Button onClick={addScholarshipSlab} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Scholarship Slab
        </Button>
      </div>
      
      <div className="space-y-2">
        <Label>LITMUS Test Duration</Label>
        <Input placeholder="DD:HH:MM" />
      </div>

      <div className="space-y-2">
        <Label>LITMUS Test Presentaton Scheduler</Label>
        <Textarea placeholder="Paste Calendly embed code" />
      </div>
      
      <Button onClick={onNext} className="w-full">
        Next: Fee Structure
      </Button>
    </div>
  );
}