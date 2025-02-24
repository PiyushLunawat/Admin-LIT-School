"use client";

import React, { useState } from "react";
import axios from "axios";
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

import {
  S3Client,
  DeleteObjectCommand,
  AbortMultipartUploadCommand,
  ListPartsCommand,
} from "@aws-sdk/client-s3";
import { Progress } from "@/components/ui/progress";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

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
        resourceFiles: z.array(z.string().optional(),),
        resourceLinks: z.array(z.string().url('Please enter a valid Link URL').optional(),),
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
                resourceFiles: [],
                resourceLinks: [],
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
      <form onSubmit={handleSubmit(onSubmit)} className="max-h-[80vh] space-y-6 py-4" >
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
                  resourceFiles: [],
                  resourceLinks: [],
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
}: any) {
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState("");

  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({
    control,
    name: `litmusTasks.${taskIndex}.resources.resourceLinks`,
  });

  const {
    fields: fileFields,
    append: appendFile,
    remove: removeFile,
  } = useFieldArray({
    control,
    name: `litmusTasks.${taskIndex}.resources.resourceFiles`,
  });
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setUploadProgress(0);

    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const file = selectedFiles[0];
    setFileName(file.name);

    // Example size limit for direct vs. multipart: 5MB
    const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB

    // Clear the file input so user can re-select if needed
    e.target.value = "";

    try {
      setUploading(true);

      let fileUrl = "";
      if (file.size <= CHUNK_SIZE) {
        // Use direct upload
        fileUrl = await uploadDirect(file);
        console.log("uploadDirect File URL:", fileUrl);
      } else {
        // Use multipart upload
        fileUrl = await uploadMultipart(file, CHUNK_SIZE);
        console.log("uploadMultipart File URL:", fileUrl);
      }

      // Append the final S3 URL to resourcesFiles in the form
      appendFile(fileUrl);

    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  // Direct upload to S3 using a single presigned URL
  const uploadDirect = async (file: File) => {
    // Step 1: Get presigned URL from your server
    // Make sure your endpoint returns something like { url: string }
    const { data } = await axios.post(`${process.env.API_URL}/admin/generate-presigned-url`, {
      bucketName: "dev-application-portal",
      key: generateUniqueFileName(file.name),
    });
    const { url, key } = data; // Suppose your API returns both presigned `url` and `key`
    console.log("whatatata",url.split("?")[0]);

    // Step 2: PUT file to that URL
      const partResponse = await axios.put(url, file, {
      headers: { "Content-Type": file.type },
      onUploadProgress: (evt: any) => {
        if (!evt.total) return;
        const percentComplete = Math.round((evt.loaded / evt.total) * 100);
        setUploadProgress(percentComplete);
      },
    });

    // Final S3 URL
    return `${url.split("?")[0]}`;
  };

  /**
   * Multipart upload with 5MB chunks, using your server endpoints for:
   * - initiate-multipart-upload
   * - generate-presigned-url-part
   * - complete-multipart-upload
   */
  const uploadMultipart = async (file: File, chunkSize: number) => {
    // Step 1: Initiate
    const uniqueKey = generateUniqueFileName(file.name);
    const initiateRes = await axios.post(`${process.env.API_URL}/admin/initiate-multipart-upload`, {
      bucketName: "dev-application-portal",
      key: uniqueKey,
    });
    const { uploadId } = initiateRes.data;

    // Step 2: Upload each chunk
    const totalChunks = Math.ceil(file.size / chunkSize);
    let totalBytesUploaded = 0;
    const parts: { ETag: string; PartNumber: number }[] = [];

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      const partRes = await axios.post(`${process.env.API_URL}/admin/generate-presigned-url-part`, {
        bucketName: "dev-application-portal",
        key: uniqueKey,
        uploadId,
        partNumber: i + 1,
      });
      const { url } = partRes.data;

      // Upload the chunk
      const uploadRes = await axios.put(url, chunk, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (evt: any) => {
          if (!evt.total) return;
          totalBytesUploaded += evt.loaded;
          const percent = Math.round((totalBytesUploaded / file.size) * 100);
          setUploadProgress(Math.min(percent, 100));
        },
      });
      parts.push({ PartNumber: i + 1, ETag: uploadRes.headers.etag });
    }

    // Step 3: Complete
    const partRes = await axios.post(`${process.env.API_URL}/admin/complete-multipart-upload`, {
      bucketName: "dev-application-portal",
      key: uniqueKey,
      uploadId,
      parts,
    });

    // Return final S3 URL
    return `https://dev-application-portal.s3.amazonaws.com/${uniqueKey}`;
  };

  // Just a helper to generate a unique file name
  const generateUniqueFileName = (originalName: string) => {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${randomStr}-${originalName}`;
  };

  return (
    <div className="grid gap-3">
      <Label>Resources</Label>

      {/* 1) Render the existing file URLs (resourceFiles) */}
      {fileFields.map((field, index) => (
        <div
          key={field.id}
          className="border rounded-md flex justify-between items-center py-1.5 px-2"
        >
          <div className="flex items-center gap-2">
            <FileIcon className="w-4 h-4" />
            {/* If storing the file as a string, we can show a truncated version or full URL */}
            <FormField
              control={control}
              name={`litmusTasks.${taskIndex}.resources.resourceFiles.${index}`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                  <p className="truncate text-sm">
                    {field.value || "No file URL"}
                  </p>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 rounded-full"
            onClick={() => removeFile(index)}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {uploading && (
        <div className="flex items-center justify-between border rounded-md py-1.5 px-2">
          <div className="flex items-center gap-2">
            <FileIcon className="w-4 h-4" />
            <div className="text-sm">{fileName}</div>
          </div>
          <div className="flex items-center gap-2">
            <Progress className="h-1 w-20" states={[ { value: uploadProgress, widt: uploadProgress, color: '#ffffff' }]} />
            <span>{uploadProgress}%</span>
          </div>
        </div>
      )}

      {/* Handle resource links as before */}
      {linkFields.map((field, index) => (
        <div className="flex items-center" key={field.id}>
          <FormField
            control={control}
            name={`litmusTasks.${taskIndex}.resources.resourceLinks.${index}`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="relative flex items-center gap-2">
                    <Link2Icon className="absolute left-2 top-3 w-4 h-4" />
                    <Input
                      type="url"
                      className="pl-8 text-sm"
                      placeholder="Enter resource link"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLink(index)}
                      className="absolute right-2 top-1.5 h-7 rounded-full"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}

      <div className="flex gap-2.5">
        <Button
          type="button"
          variant="secondary"
          className="flex flex-1 gap-2 items-center"
          onClick={() => {
            document.getElementById(`file-upload-${taskIndex}`)?.click();
          }}
        >
          <FileIcon className="w-4 h-4" />
          Upload Resource File
        </Button>
        <input
          type="file"
          id={`file-upload-${taskIndex}`}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <Button type="button"
          variant="secondary"
          className="flex flex-1 gap-2"
          onClick={() => appendLink("")}
        >
          <Link2Icon className="w-4 h-4" /> Attach Resource Link
        </Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
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
