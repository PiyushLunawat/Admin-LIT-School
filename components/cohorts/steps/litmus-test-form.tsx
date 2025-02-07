"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  GripVertical,
  XIcon,
  FolderPlus,
  FileIcon,
  Link2Icon,
  PlusIcon,
  FileLineChart,
  SmileIcon,
} from "lucide-react";
import { z } from "zod";
import {
  useForm,
  useFieldArray,
  Controller,
  UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { updateCohort } from "@/app/api/cohorts";

const formSchema = z.object({
  litmusTasks: z.array(
    z.object({
      id: z.string(),
      title: z.string().nonempty("Task title is required"),
      description: z.string().optional(),
      submissionTypes: z.array(
        z.object({
          id: z.string(),
          type: z.string().nonempty("Submission type is required"),
          characterLimit: z.coerce.number().min(1).optional(),
          maxFiles: z.coerce.string().min(1).optional(),
          maxFileSize: z.coerce.string().min(1).optional(),
          allowedTypes: z.array(z.string()).optional(),
        })
      ),
      judgmentCriteria: z.array(
        z.object({
          id: z.string(),
          name: z.string().nonempty("Criteria name is required"),
          points: z.coerce.string().min(1, "Points must be at least 1"),
          description: z.string().optional(),
        })
      ),
      resources: z.object({
        uploadedFile: z.any().optional(),
        resourceLink: z.string().optional(),
      }),
    })
  ),
  scholarshipSlabs: z.array(
    z.object({
      id: z.string(),
      name: z.string().nonempty("Slab name is required"),
      percentage: z.coerce.string().nonempty("Percentage is required"),
      clearance: z.coerce.string().nonempty("Clearance is required"),
      description: z.string().optional(),
    })
  ),
  litmusTestDuration: z.string().nonempty("Duration is required"),
  // litmusTestScheduler: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface LitmusTestFormProps {
  onNext: () => void;
  onCohortCreated: (cohort: any) => void;
  initialData?: any;
}

export function LitmusTestForm({
  onNext,
  onCohortCreated,
  initialData,
}: LitmusTestFormProps) {const litmusTestDetail = initialData?.litmusTestDetail?.[0];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: litmusTestDetail
      ? {
          litmusTasks: litmusTestDetail.litmusTasks,
          scholarshipSlabs: litmusTestDetail.scholarshipSlabs,
          litmusTestDuration: litmusTestDetail.litmusTestDuration,
          // litmusTestScheduler: litmusTestDetail.litmusTestScheduler,
        }
      : {
          litmusTasks:  [
            {
              id: generateId(),
              title: "",
              description: "",
              submissionTypes: [
                {
                  id: generateId(),
                  type: "",
                  characterLimit: undefined,
                  maxFiles: undefined,
                  maxFileSize: undefined,
                  allowedTypes: ["All"],
                },
              ],
              judgmentCriteria: [
                {
                  id: generateId(),
                  name: "",
                  points: "",
                  description: "",
                },
              ],
              resources: {
                uploadedFile: null,
                resourceLink: "",
              },
            },
          ],
          scholarshipSlabs: [
            {
              id: generateId(),
              name: "",
              percentage: "",
              clearance: "",
              description: "",
            },
          ],
          litmusTestDuration: "",
          // litmusTestScheduler: "",
        },

  });
  const [loading, setLoading] = useState(false);  
  const { control, handleSubmit, watch, setValue  } = form;
  
  const {
    fields: taskFields,
    append: appendTask,
    remove: removeTask,
  } = useFieldArray({
    control,
    name: "litmusTasks",
  });

  const {
    fields: slabFields,
    append: appendSlab,
    remove: removeSlab,
  } = useFieldArray({
    control,
    name: "scholarshipSlabs",
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true)
    try {
      console.log("Form data before submission:", data);
      if (initialData?._id) {
        const createdCohort = await updateCohort(initialData._id, {
          litmusTestDetail: data,
        });
        console.log("Cohort updated successfully");
        onCohortCreated(createdCohort.data);
        onNext();
      } else {
        console.error("Cohort ID is missing. Unable to update.");
      }
    } catch (error) {
      console.error("Failed to update cohort:", error);
    } finally {
      setLoading(false)
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-h-[80vh] space-y-6 py-4"
      >
        {/* LITMUS Tasks Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">LITMUS Tasks</h3>
          {taskFields.map((task, taskIndex) => (
            <TaskItem
              key={task.id}
              task={task}
              taskIndex={taskIndex}
              control={control}
              removeTask={removeTask}
              form={form}
              setValue={setValue} 
            />
          ))}
          <Button 
            type="button"
            onClick={() =>
              appendTask({
                id: generateId(),
                title: "",
                description: "",
                submissionTypes: [
                  {
                    id: generateId(),
                    type: "",
                    characterLimit: undefined,
                    maxFiles: undefined,
                    maxFileSize: undefined,
                    allowedTypes: ["All"],
                  },
                ],
                judgmentCriteria: [],
                resources: {
                  uploadedFile: null,
                  resourceLink: "",
                },
              })
            }
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>

        {/* Scholarship Slabs Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Scholarship Slabs</h3>
          {slabFields.map((slab, slabIndex) => (
            <ScholarshipSlabItem
            key={slab.id}
            slab={slab}
            slabIndex={slabIndex}
            control={control}
            removeSlab={removeSlab}
            form={form}
            />
          ))}
          <Button type="button"
            onClick={() =>
              appendSlab({
                id: generateId(),
                name: "",
                percentage: "",
                clearance: "",
                description: "",
              })
            }
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Scholarship Slab
          </Button>
        </div>

        {/* LITMUS Test Duration */}
        <div className="space-y-2">
          <FormField
            control={control}
            name="litmusTestDuration"
            render={({ field }) => (
              <FormItem>
                <Label>LITMUS Test Duration (days)</Label>
                <FormControl>
                  <Input type="number" min="1" placeholder="5 days" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* LITMUS Test Scheduler */}
        {/* <div className="space-y-2">
          <FormField
            control={control}
            name="litmusTestScheduler"
            render={({ field }) => (
              <FormItem>
                <Label>LITMUS Test Presentation Scheduler</Label>
                <FormControl>
                  <Textarea placeholder="Paste Calendly embed code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div> */}

        <Button type="submit" className="w-full" disabled={loading}>
          Next: Fee Structure
        </Button>
      </form>
    </Form>
  );
}

// Helper function to generate unique IDs
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// TaskItem Component
function TaskItem({
  task,
  taskIndex,
  control,
  removeTask,
  form,
  setValue,
}: {
  task: any;
  taskIndex: number;
  control: any;
  removeTask: (index: number) => void;
  form: UseFormReturn<FormData>;
  setValue: UseFormReturn<FormData>["setValue"];
}) {
  const {
    fields: submissionTypeFields,
    append: appendSubmissionType,
    remove: removeSubmissionType,
  } = useFieldArray({
    control,
    name: `litmusTasks.${taskIndex}.submissionTypes`,
  });

  const {
    fields: judgmentCriteriaFields,
    append: appendJudgmentCriteria,
    remove: removeJudgmentCriteria,
  } = useFieldArray({
    control,
    name: `litmusTasks.${taskIndex}.judgmentCriteria`,
  });

  // Resource state
  const [isLinkInputVisible, setIsLinkInputVisible] = React.useState(!!task?.resources?.resourceLink);

  return (
    <Card key={task.id}>
      <CardContent className="flex pl-0 items-start pt-6">
        <div className="cursor-grab px-4" onMouseDown={(e) => e.preventDefault()}>
          <GripVertical className="h-4 w-4" />
        </div>
        <div className="grid w-full gap-6">
          {/* Task Title */}
          <div className="flex justify-between items-end">
            <FormField
              control={control}
              name={`litmusTasks.${taskIndex}.title`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <Label className="text-[#00A3FF]">Task 0{taskIndex+1}</Label>
                  <FormControl>
                    <Input placeholder="e.g., Create a pitch deck" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.getValues("litmusTasks").length > 1 && (
              <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="text-destructive" >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" side="top" className="max-w-[345px] w-full">
                <div className="text-base font-medium mb-2">
                  {`Are you sure you would like to delete ${form.getValues(`litmusTasks.${taskIndex}.title`)}?`}
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" >Cancel</Button>
                  <Button className="bg-[#FF503D]/20 hover:bg-[#FF503D]/30 text-[#FF503D]" onClick={() => removeTask(taskIndex)}>Delete</Button>
                </div>
              </PopoverContent>
            </Popover>
            )}
          </div>

          {/* Task Description */}
          <FormField
            control={control}
            name={`litmusTasks.${taskIndex}.description`}
            render={({ field }) => (
              <FormItem>
                <Label>Description</Label>
                <FormControl>
                  <Textarea placeholder="Instructions or details" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submission Types */}
          <div className="grid gap-3">
            <Label>Submission Type</Label>
            {submissionTypeFields.map((sub, subIndex) => (
              <div className="flex gap-1 items-start" key={sub.id}>
                <div className="flex flex-wrap w-full bg-secondary/60 rounded-md p-3 gap-1.5">
                  <FormField
                    control={control}
                    name={`litmusTasks.${taskIndex}.submissionTypes.${subIndex}.type`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Label className="text-[#00A3FF]">
                          Submission Type 0{subIndex + 1}
                        </Label>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
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
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Conditional Config Fields */}
                  {renderConfigFields(
                    control,
                    taskIndex,
                    subIndex,
                    form.watch(
                      `litmusTasks.${taskIndex}.submissionTypes.${subIndex}.type`
                    )
                  )}
                </div>
                <Button type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSubmissionType(subIndex)}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button"
              variant="secondary"
              className="flex flex-1 gap-2"
              onClick={() =>
                appendSubmissionType({
                  id: generateId(),
                  type: "",
                  characterLimit: undefined,
                  maxFiles: undefined,
                  maxFileSize: undefined,
                  allowedTypes: [],
                })
              }
            >
              <FolderPlus className="w-4 h-4" /> Add a Submission Type
            </Button>
          </div>

          {/* Judgment Criteria */}
          <div className="grid gap-3">
            <Label>Judgment Criteria</Label>
            {judgmentCriteriaFields.map((cri, criIndex) => (
              <div className="flex gap-1 items-start" key={cri.id}>
                <div className="w-full bg-secondary/60 rounded-md p-3 gap-1.5">
                  <div className="flex gap-1.5 items-start">
                    <FormField
                      control={control}
                      name={`litmusTasks.${taskIndex}.judgmentCriteria.${criIndex}.name`}
                      render={({ field }) => (
                        <FormItem className="w-1/2">
                          <Label className="text-[#00A3FF]">
                            Criteria 0{criIndex + 1}
                          </Label>
                          <FormControl>
                            <Input
                              placeholder="Type Here"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`litmusTasks.${taskIndex}.judgmentCriteria.${criIndex}.points`}
                      render={({ field }) => (
                        <FormItem className="w-1/2">
                          <Label>Max Points</Label>
                          <FormControl>
                            <Input type="number" placeholder="10" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={control}
                    name={`litmusTasks.${taskIndex}.judgmentCriteria.${criIndex}.description`}
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <Label>Describe this criteria</Label>
                        <FormControl>
                          <Textarea placeholder="Type here" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeJudgmentCriteria(criIndex)}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button"
              variant="secondary"
              className="flex flex-1 gap-2"
              onClick={() =>
                appendJudgmentCriteria({
                  id: generateId(),
                  name: "",
                  points: "",
                  description: "",
                })
              }
            >
              <PlusIcon className="w-4 h-4" /> Add Judgment Criteria
            </Button>
          </div>

          {/* Resources Section */}
          <ResourcesSection
            control={control}
            setValue={setValue}
            taskIndex={taskIndex}
            isLinkInputVisible={isLinkInputVisible}
            setIsLinkInputVisible={setIsLinkInputVisible}
            link={task?.resources?.resourceLink || ""}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Render Config Fields Based on Submission Type
function renderConfigFields(
  control: any,
  taskIndex: number,
  subIndex: number,
  type: string
) {
  switch (type) {
    case "short":
    case "long":
      return (
        <FormField
          control={control}
          name={`litmusTasks.${taskIndex}.submissionTypes.${subIndex}.characterLimit`}
          render={({ field }) => (
            <FormItem className="w-1/2">
              <Label>Character Limit</Label>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter maximum characters"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "image":
    case "video":
      return (
        <>
          <FormField
            control={control}
            name={`litmusTasks.${taskIndex}.submissionTypes.${subIndex}.maxFiles`}
            render={({ field }) => (
              <FormItem>
                <Label>Max No. of Files</Label>
                <FormControl>
                  <Input type="number" placeholder="00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`litmusTasks.${taskIndex}.submissionTypes.${subIndex}.maxFileSize`}
            render={({ field }) => (
              <FormItem>
                <Label>Max Size per File(MB)</Label>
                <FormControl>
                  <Input type="number" placeholder="15 MB" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      );
      
    case "file":
      // Implement allowed file types if needed
      return (
        <>
          <FormField
            control={control}
            name={`litmusTasks.${taskIndex}.submissionTypes.${subIndex}.maxFiles`}
            render={({ field }) => (
              <FormItem>
                <Label>Max No. of Files</Label>
                <FormControl>
                  <Input type="number" placeholder="00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`litmusTasks.${taskIndex}.submissionTypes.${subIndex}.maxFileSize`}
            render={({ field }) => (
              <FormItem>
                <Label>Max Size per File(MB)</Label>
                <FormControl>
                  <Input type="number" placeholder="15 MB" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-2 mt-1">
            <Label>Allowed File Types</Label>
            <Controller
              control={control}
              name={`litmusTasks.${taskIndex}.submissionTypes.${subIndex}.allowedTypes`}
              defaultValue={["All"]} // Initialize with "All" selected
              render={({ field }) => (
                <div className="flex flex-wrap gap-1">
                  {["All", "DOC", "PPT", "PDF", "XLS", "PSD", "EPF", "AI"].map((type) => (
                    <div key={type} className="flex items-center">
                      <Checkbox className="hidden"
                        id={`${type}-${taskIndex}-${subIndex}`}
                        checked={field.value?.includes(type)}
                        onCheckedChange={(checked) => {
                          let newSelectedTypes = field.value || [];
                          if (checked) {
                            if (type === "All") {
                              newSelectedTypes = ["All"];
                            } else {
                              newSelectedTypes = newSelectedTypes.filter((t:any) => t !== "All");
                              newSelectedTypes.push(type);
                            }
                          } else {
                            newSelectedTypes = newSelectedTypes.filter((t:any) => t !== type);
                            if (newSelectedTypes.length === 0) {
                              newSelectedTypes = ["All"];
                            }
                          }
                          field.onChange(newSelectedTypes);
                        }}
                      />
                      <Label
                        htmlFor={`${type}-${taskIndex}-${subIndex}`}
                        className={`flex items-center cursor-pointer px-4 py-2 h-8 rounded-md border ${
                          field.value?.includes(type) ? "bg-[#6808FE]" : "bg-[#0A0A0A]"
                        }`}
                      >
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            />
          </div>
        </>
      );
    case "link":
      return (
        <FormField
          control={control}
          name={`litmusTasks.${taskIndex}.submissionTypes.${subIndex}.maxFiles`}
          render={({ field }) => (
            <FormItem className="w-1/2">
              <Label>Max No. of Links</Label>
              <FormControl>
                <Input type="number" placeholder="00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    default:
      return null;
  }
}

// Resources Section Component
function ResourcesSection({
  control,
  setValue,
  taskIndex,
  isLinkInputVisible,
  setIsLinkInputVisible,
  link,
}: any) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [resourceLink, setResourceLink] = useState(link || "");
  const [addedLink, setAddedLink] = useState<string | null>(link || null);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;

    if (selectedFiles && selectedFiles.length > 0) {
      const file = selectedFiles[0];

      // Set file size limit (e.g., 15MB)
      const MAX_FILE_SIZE_MB = 15;
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(`File size exceeds ${MAX_FILE_SIZE_MB} MB limit.`);
        return;
      }

      setUploadedFile(file);
      setValue(`litmusTasks.${taskIndex}.resources.uploadedFile`, file); // Update form value
      setError(null);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setValue(`litmusTasks.${taskIndex}.resources.uploadedFile`, null);
  };
  
  const handleAddLink = () => {
    setAddedLink(resourceLink);
  };
  
  const handleRemoveLink = () => {
    setAddedLink(null);
    setResourceLink("");
  };

  return (
    <div className="grid gap-3">
      <Label>Resources</Label>
      {uploadedFile && (
        <div className="flex items-center justify-between gap-2 mt-2 p-2 border rounded">
          <div className="flex gap-2 items-center text-sm">
            <FileIcon className="w-4 h-4" />
            {uploadedFile.name}
          </div>
          <XIcon
            className="w-4 h-4 cursor-pointer"
            onClick={handleRemoveFile}
          />
        </div>
      )}
     
     {isLinkInputVisible && (
  <FormField
    control={control}
    name={`litmusTasks.${taskIndex}.resources.resourceLink`}
    render={({ field }) => (
      <FormItem>
        <FormControl>
          <div className="relative flex items-center gap-2">
            <Link2Icon className="absolute left-2 top-3 w-4 h-4" />
            <Input
              className="pl-8 text-sm"
              placeholder="Enter URL here"
              {...field}
              value={resourceLink}
              onChange={(e) => {
                setResourceLink(e.target.value);
                field.onChange(e.target.value);
              }}
            />
            {addedLink === null ? (
              <Button
                type="button"
                onClick={() => handleAddLink()} // Properly invoking the function
                disabled={!field.value}
                className="absolute right-2 top-1.5 h-7 rounded-full"
              >
                Add
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => {handleRemoveLink();field.onChange("");}}
                size={"icon"}
                variant={"ghost"}
                className="absolute right-2 top-1.5 h-7 w-7"
              >
                <XIcon className="w-4 h-4" />
              </Button>
            )}
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
)}

      {/* {resourceLink && (
        <div className="flex items-center gap-2 p-2 border rounded">
          <Link2Icon className="w-4 h-4" />
          <span className="flex-1">{resourceLink}</span>
          <XIcon
            className="w-4 h-4 cursor-pointer"
            onClick={() =>
              control.setValue(
                `litmusTasks.${taskIndex}.resources.resourceLink`,
                ""
              )
            }
          />
        </div>
      )} */}
      <div className="flex gap-2.5">
        <Button type="button"
          variant="secondary"
          className="flex flex-1 gap-2"
          onClick={() =>
            document
              .getElementById(`file-upload-${taskIndex}`)
              ?.click()
          }
        >
          <FileIcon className="w-4 h-4" /> Upload Resource File
        </Button>
        <input
          type="file"
          id={`file-upload-${taskIndex}`}
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
        <Button type="button"
          variant="secondary"
          className="flex flex-1 gap-2"
          disabled={resourceLink}
          onClick={() => setIsLinkInputVisible(true)}
        >
          <Link2Icon className="w-4 h-4" /> Attach Resource Link
        </Button>
      </div>
    </div>
  );
}

// ScholarshipSlabItem Component
function ScholarshipSlabItem({
  slab,
  slabIndex,
  control,
  removeSlab,
  form,
}: {
  slab: any;
  slabIndex: number;
  control: any;
  removeSlab: (index: number) => void;
  form: UseFormReturn<FormData>;
}) {

  return (
    <Card key={slab.id}>
      <CardContent className="flex pl-0 items-start pt-6">
        <div className="cursor-grab px-4" onMouseDown={(e) => e.preventDefault()}>
          <GripVertical className="h-4 w-4" />
        </div>
        <div className="grid w-full gap-4">
          <div className="flex justify-between items-end">
            <FormField
              control={control}
              name={`scholarshipSlabs.${slabIndex}.name`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <Label>Slab Name</Label>
                  <FormControl>
                    <Input placeholder="e.g., Smart Mouth" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.getValues("scholarshipSlabs").length > 1 && (
              <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="text-destructive" >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" side="top" className="max-w-[345px] w-full">
                <div className="text-base font-medium mb-2">
                  {`Are you sure you would like to delete ${form.getValues(`scholarshipSlabs.${slabIndex}.name`)}?`}
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" >Cancel</Button>
                  <Button className="bg-[#FF503D]/20 hover:bg-[#FF503D]/30 text-[#FF503D]" onClick={() => removeSlab(slabIndex)}>Delete</Button>
                </div>
              </PopoverContent>
            </Popover>
            )}
          </div>
          <div className="flex gap-1.5 items-start">
            <FormField
              control={control}
              name={`scholarshipSlabs.${slabIndex}.percentage`}
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <Label>Scholarship Percentage</Label>
                  <FormControl>
                    <Input type="number" placeholder="5" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
  control={control}
  name={`scholarshipSlabs.${slabIndex}.clearance`}
  render={({ field }) => (
    <FormItem className="w-1/2">
      <Label>LITMUS Challenge Clearance (%)</Label>
      <FormControl>
        <div className="flex items-center gap-2">
          {/* First Input */}
          <Input
            type="number"
            placeholder="Start"
            value={typeof field.value === "string" && field.value.includes("-") ? field.value.split("-")[0] : ""}
            onChange={(e) => {
              const endValue = typeof field.value === "string" && field.value.includes("-") ? field.value.split("-")[1] : "";
              field.onChange(`${e.target.value}-${endValue}`);
            }}
          />
          <span>-</span>
          {/* Second Input */}
          <Input
            type="number"
            placeholder="End"
            value={typeof field.value === "string" && field.value.includes("-") ? field.value.split("-")[1] : ""}
            onChange={(e) => {
              const startValue = typeof field.value === "string" && field.value.includes("-") ? field.value.split("-")[0] : "";
              field.onChange(`${startValue}-${e.target.value}`);
            }}
          />
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

          </div>
          <FormField
            control={control}
            name={`scholarshipSlabs.${slabIndex}.description`}
            render={({ field }) => (
              <FormItem>
                <Label>Scholarship Description</Label>
                <FormControl>
                  <Textarea
                    placeholder="Describe who is this scholarship for?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
