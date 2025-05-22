"use client";

import type React from "react";

import { updateCohort } from "@/app/api/cohorts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  FileIcon,
  FolderPlus,
  GripVertical,
  Link2Icon,
  LoaderCircle,
  Plus,
  Trash2,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
  },
});

// Modified schema to ensure numeric fields are always defined with default values
const formSchema = z.object({
  applicationFormDetail: z.array(
    z.object({
      task: z.array(
        z.object({
          id: z.string(),
          title: z.string().nonempty("Task title is required"),
          description: z.string().optional(),
          config: z.array(
            z.object({
              type: z.string().nonempty("Task type is required"),
              characterLimit: z.coerce.number().min(1).default(1000),
              maxFiles: z.coerce.number().min(1).default(1),
              maxFileSize: z.coerce.number().min(1).default(500),
              allowedTypes: z.array(z.string()).default(["All"]),
            })
          ),
          resources: z.object({
            resourceFiles: z.array(z.string().optional()),
            resourceLinks: z.array(
              z.string().url("Please enter a valid Link URL").optional()
            ),
          }),
        })
      ),
    })
  ),
});

interface ApplicationFormBuilderProps {
  onNext: () => void;
  onCohortCreated: (cohort: any) => void;
  initialData?: any;
}

export function ApplicationFormBuilder({
  onNext,
  onCohortCreated,
  initialData,
}: ApplicationFormBuilderProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicationFormDetail:
        initialData?.applicationFormDetail &&
        initialData.applicationFormDetail.length > 0
          ? initialData.applicationFormDetail
          : [
              {
                task: [
                  {
                    id: Math.random().toString(36).substr(2, 9),
                    title: "",
                    description: "",
                    config: [
                      {
                        type: "",
                        characterLimit: 1000, // Default value
                        maxFiles: 1, // Default value
                        maxFileSize: 500, // Default value
                        allowedTypes: ["All"],
                      },
                    ],
                    resources: {
                      resourceFiles: [],
                      resourceLinks: [],
                    },
                  },
                ],
              },
            ],
    },
  });
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit } = form;

  const { fields: applicationFormFields } = useFieldArray({
    control,
    name: "applicationFormDetail",
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      console.log("Form data before submission:", data);

      if (initialData?._id) {
        const createdCohort = await updateCohort(initialData._id, {
          applicationFormDetail: data.applicationFormDetail,
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
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-h-[80vh] p-4"
      >
        {applicationFormFields.map(
          (applicationFormField, applicationFormIndex) => (
            <div key={applicationFormField.id} className="space-y-4">
              <TaskList
                nestIndex={applicationFormIndex}
                control={control}
                form={form}
              />
            </div>
          )
        )}

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={loading}>
          Next: LITMUS Test
        </Button>
      </form>
    </Form>
  );
}

function TaskList({ nestIndex, control, form }: any) {
  const {
    fields: taskFields,
    append: appendTask,
    remove: removeTask,
  } = useFieldArray({
    control,
    name: `applicationFormDetail.${nestIndex}.task`,
  });

  useEffect(() => {
    if (taskFields.length === 0) {
      appendTask({
        id: Math.random().toString(36).substr(2, 9),
        title: "",
        description: "",
        config: [
          {
            type: "",
            characterLimit: 1000, // Default value
            maxFiles: 1, // Default value
            maxFileSize: 500, // Default value
            allowedTypes: ["All"],
          },
        ],
        resources: {
          resourceFiles: [],
          resourceLinks: [],
        },
      });
    }
  }, [taskFields, appendTask]);

  return (
    <div className="space-y-4">
      {taskFields.map((taskField: any, taskIndex: number) => (
        <Task
          key={taskField.id}
          nestIndex={nestIndex}
          control={control}
          form={form}
          taskField={taskField}
          taskIndex={taskIndex}
          removeTask={removeTask}
        />
      ))}

      {/* Add Task Button */}
      <Button
        type="button"
        className="w-full flex gap-2 items-center"
        onClick={() =>
          appendTask({
            id: Math.random().toString(36).substring(2, 9),
            title: "",
            description: "",
            config: [
              {
                type: "",
                characterLimit: 1000, // Default value
                maxFiles: 1, // Default value
                maxFileSize: 500, // Default value
                allowedTypes: ["All"],
              },
            ],
            resources: {
              resourceFiles: [],
              resourceLinks: [],
            },
          })
        }
      >
        <Plus className="h-4 w-4" />
        Add Task
      </Button>
    </div>
  );
}

function Task({
  nestIndex,
  control,
  form,
  taskField,
  taskIndex,
  removeTask,
  setValue,
}: any) {
  const {
    fields: configFields,
    append: appendConfig,
    remove: removeConfig,
  } = useFieldArray({
    control,
    name: `applicationFormDetail.${nestIndex}.task.${taskIndex}.config`,
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [resourceLink, setResourceLink] = useState("");
  const [isLinkInputVisible, setIsLinkInputVisible] = useState(false);
  const [addedLink, setAddedLink] = useState<string | null>(null);

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
  };

  const handleRemoveLink = () => {
    setAddedLink(null);
  };

  return (
    <Card key={taskField.id}>
      <CardContent className="flex pl-0 items-start pt-6">
        <div className="cursor-grab hover:bg-accent p-2 rounded-md mx-2">
          <GripVertical className="h-4 w-4" />
        </div>
        <div className="grid w-full gap-6">
          {/* Task Title */}
          <FormField
            control={control}
            name={`applicationFormDetail.${nestIndex}.task.${taskIndex}.title`}
            render={({ field }: any) => (
              <FormItem>
                <Label className="text-[#00A3FF]">Task 0{taskIndex + 1}</Label>
                <FormControl>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., Share an Embarrassing Story"
                      {...field}
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        align="end"
                        side="top"
                        className="max-w-[345px] w-full"
                      >
                        <div className="text-base font-medium mb-2">
                          {`Are you sure you would like to delete ${form.getValues(
                            `applicationFormDetail.${nestIndex}.task.${taskIndex}.title`
                          )}?`}
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline">Cancel</Button>
                          <Button
                            className="bg-[#FF503D]/20 hover:bg-[#FF503D]/30 text-[#FF503D]"
                            onClick={() => removeTask(taskIndex)}
                          >
                            Delete
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Task Description */}
          <FormField
            control={control}
            name={`applicationFormDetail.${nestIndex}.task.${taskIndex}.description`}
            render={({ field }: any) => (
              <FormItem>
                <Label>Description</Label>
                <FormControl>
                  <Textarea placeholder="Instructions or details" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Config Fields */}
          <div className="grid gap-3">
            <Label>Submission Type</Label>
            {configFields.map((configField: any, configIndex: number) => (
              <Config
                key={configField.id}
                nestIndex={nestIndex}
                taskIndex={taskIndex}
                configIndex={configIndex}
                control={control}
                form={form}
                removeConfig={removeConfig}
              />
            ))}
            <Button
              type="button"
              className="flex gap-2 items-center"
              variant="secondary"
              onClick={() =>
                appendConfig({
                  type: "",
                  characterLimit: 1000, // Default value
                  maxFiles: 1, // Default value
                  maxFileSize: 500, // Default value
                  allowedTypes: ["All"],
                })
              }
            >
              <FolderPlus className="w-4 h-4" /> Add a Submission Type
            </Button>
          </div>

          {/* Resources Section */}
          <ResourcesSection
            control={control}
            setValue={setValue}
            nestIndex={nestIndex}
            taskIndex={taskIndex}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function ResourcesSection({ control, setValue, nestIndex, taskIndex }: any) {
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [fileSizeInput, setFileSizeInput] = useState<string>("500");

  // Add this after the useState declarations in ResourcesSection
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    else if (bytes < 1024 * 1024 * 1024)
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    else return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  };

  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({
    control,
    name: `applicationFormDetail.${nestIndex}.task.${taskIndex}.resources.resourceLinks`,
  });

  const {
    fields: fileFields,
    append: appendFile,
    remove: removeFile,
  } = useFieldArray({
    control,
    name: `applicationFormDetail.${nestIndex}.task.${taskIndex}.resources.resourceFiles`,
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setUploadProgress(0);

    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const file = selectedFiles[0];

    // Add file size validation - 500 MB limit
    const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      setError(
        `File size exceeds the 500 MB limit. Current size: ${(
          file.size /
          (1024 * 1024)
        ).toFixed(2)} MB. Please select a smaller file.`
      );
      e.target.value = ""; // Clear the file input
      return;
    }

    const fileKey = generateUniqueFileName(file.name);
    setFileName(fileKey);

    // Example size limit for direct vs. multipart: 5MB
    const CHUNK_SIZE = 100 * 1024 * 1024; // 5 MB

    // Clear the file input so user can re-select if needed
    e.target.value = "";

    try {
      setUploading(true);

      let fileUrl = "";
      if (file.size <= CHUNK_SIZE) {
        // Use direct upload
        fileUrl = await uploadDirect(file, fileKey);
        console.log("uploadDirect File URL:", fileUrl);
      } else {
        // Use multipart upload
        fileUrl = await uploadMultipart(file, CHUNK_SIZE, fileKey);
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

  const handleDeleteFile = async (fileKey: string, index?: number) => {
    try {
      if (!fileKey) {
        console.error("Invalid file URL:", fileKey);
        return;
      }

      // AWS S3 DeleteObject Command
      const deleteCommand = new DeleteObjectCommand({
        Bucket: "dev-application-portal", // Replace with your bucket name
        Key: fileKey, // Key extracted from file URL
      });

      await s3Client.send(deleteCommand);
      console.log("File deleted successfully from S3:", fileKey);

      // Remove from UI
      removeFile(index);
    } catch (error) {
      console.error("Error deleting file:", error);
      setError("Failed to delete file. Try again.");
    }
  };

  // Direct upload to S3 using a single presigned URL
  const uploadDirect = async (file: File, fileKey: string) => {
    // Step 1: Get presigned URL from your server
    // Make sure your endpoint returns something like { url: string }
    const { data } = await axios.post(
      `${process.env.API_URL}/admin/generate-presigned-url`,
      {
        bucketName: "dev-application-portal",
        key: fileKey,
      }
    );
    const { url, key } = data; // Suppose your API returns both presigned `url` and `key`
    console.log("whatatata", url.split("?")[0]);

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
  const uploadMultipart = async (
    file: File,
    chunkSize: number,
    fileKey: string
  ) => {
    // Step 1: Initiate
    const uniqueKey = fileKey;
    const initiateRes = await axios.post(
      `${process.env.API_URL}/admin/initiate-multipart-upload`,
      {
        bucketName: "dev-application-portal",
        key: uniqueKey,
      }
    );
    const { uploadId } = initiateRes.data;

    // Step 2: Upload each chunk
    const totalChunks = Math.ceil(file.size / chunkSize);
    let totalBytesUploaded = 0;
    const parts: { ETag: string; PartNumber: number }[] = [];

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      const partRes = await axios.post(
        `${process.env.API_URL}/admin/generate-presigned-url-part`,
        {
          bucketName: "dev-application-portal",
          key: uniqueKey,
          uploadId,
          partNumber: i + 1,
        }
      );
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
    const partRes = await axios.post(
      `${process.env.API_URL}/admin/complete-multipart-upload`,
      {
        bucketName: "dev-application-portal",
        key: uniqueKey,
        uploadId,
        parts,
      }
    );

    // Return final S3 URL
    return `https://dev-application-portal.s3.amazonaws.com/${uniqueKey}`;
  };

  // Just a helper to generate a unique file name
  const generateUniqueFileName = (originalName: string) => {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${originalName}`;
  };

  return (
    <div className="grid gap-3">
      <Label>Resources</Label>

      {/* 1) Render the existing file URLs (resourceFiles) */}
      {fileFields.map((field, index) => (
        <div className="flex items-center" key={field.id}>
          {/* If storing the file as a string, we can show a truncated version or full URL */}
          <FormField
            control={control}
            name={`applicationFormDetail.${nestIndex}.task.${taskIndex}.resources.resourceFiles.${index}`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="relative flex items-center gap-2">
                    <FileIcon className="absolute left-2 top-3 w-4 h-4" />
                    <Input
                      type="url"
                      className="pl-8 pr-12 text-sm truncate text-white w-full"
                      placeholder="Enter resource link"
                      {...field}
                      readOnly
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1.5 h-7 rounded-full"
                      onClick={() =>
                        handleDeleteFile(field.value.split("/").pop(), index)
                      }
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

      {uploading && (
        <div className="flex items-center justify-between border rounded-md py-1.5 px-2">
          <div className="flex items-center gap-2">
            <FileIcon className="w-4 h-4" />
            <div className="text-sm truncate">{fileName}</div>
          </div>
          <div className="flex items-center gap-2">
            {uploadProgress === 100 ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Progress
                  className="h-1 w-20"
                  states={[
                    {
                      value: uploadProgress,
                      widt: uploadProgress,
                      color: "#ffffff",
                    },
                  ]}
                />
                <span>{uploadProgress}%</span>
              </>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 rounded-full"
              onClick={() => handleDeleteFile(fileName)}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Handle resource links as before */}
      {linkFields.map((field, index) => (
        <div className="flex items-center" key={field.id}>
          <FormField
            control={control}
            name={`applicationFormDetail.${nestIndex}.task.${taskIndex}.resources.resourceLinks.${index}`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="relative flex items-center gap-2">
                    <Link2Icon className="absolute left-2 top-3 w-4 h-4" />
                    <Input
                      type="url"
                      className="pl-8 text-sm pr-12 truncate"
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
          disabled={uploading}
          type="button"
          variant="secondary"
          className="flex flex-1 gap-2 items-center"
          onClick={() => {
            document.getElementById(`file-upload-${taskIndex}`)?.click();
          }}
        >
          <FileIcon className="w-4 h-4" />
          Upload Resource File (Max: 500 MB)
        </Button>
        <input
          type="file"
          id={`file-upload-${taskIndex}`}
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept="*/*" // You can restrict this further if needed
        />
        <Button
          type="button"
          variant="secondary"
          className="flex flex-1 gap-2"
          onClick={() => appendLink("")}
        >
          <Link2Icon className="w-4 h-4" /> Attach Resource Link
        </Button>
      </div>
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-md p-2 mt-2">
          <p className="text-red-500 text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}

function Config({
  nestIndex,
  taskIndex,
  configIndex,
  control,
  form,
  removeConfig,
}: any) {
  const type = form.watch(
    `applicationFormDetail.${nestIndex}.task.${taskIndex}.config.${configIndex}.type`
  );
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

  return (
    <div className="flex gap-1 items-start">
      <div className="flex flex-wrap w-full bg-secondary/60 p-3 rounded-md gap-1.5">
        {/* Type Selection */}
        <FormField
          control={control}
          name={`applicationFormDetail.${nestIndex}.task.${taskIndex}.config.${configIndex}.type`}
          render={({ field }: any) => (
            <FormItem className="flex flex-col flex-1 ">
              <Label className="text-[#00A3FF] mt-2 mb-[3px]">
                Submission Type 0{configIndex + 1}
              </Label>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
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

        {/* Conditional Config Fields based on type */}
        {type === "short" || type === "long" ? (
          <FormField
            control={control}
            name={`applicationFormDetail.${nestIndex}.task.${taskIndex}.config.${configIndex}.characterLimit`}
            render={({ field }: any) => (
              <FormItem>
                <Label>Character Limit</Label>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter maximum characters"
                    {...field}
                    value={field.value || 1000} // Ensure value is never undefined
                    onChange={(e) => {
                      const value =
                        e.target.value === ""
                          ? 1000
                          : Number.parseInt(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        {type === "image" || type === "video" ? (
          <>
            <FormField
              control={control}
              name={`applicationFormDetail.${nestIndex}.task.${taskIndex}.config.${configIndex}.maxFiles`}
              render={({ field }: any) => (
                <FormItem>
                  <Label>Max No. of Files</Label>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="00"
                      {...field}
                      value={field.value || 1} // Ensure value is never undefined
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? 1
                            : Number.parseInt(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`applicationFormDetail.${nestIndex}.task.${taskIndex}.config.${configIndex}.maxFileSize`}
              render={({ field }: any) => (
                <FormItem>
                  <Label>Max Size per File (MB)</Label>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="15 MB"
                      {...field}
                      value={field.value.toString()} // Ensure value is never undefined
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value);
                        // Limit to 500 MB maximum
                        const limitedValue = Math.min(value, 500);
                        field.onChange(limitedValue);
                      }}
                      max={500} // HTML attribute to limit input
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ) : null}

        {type === "file" ? (
          <>
            <FormField
              control={control}
              name={`applicationFormDetail.${nestIndex}.task.${taskIndex}.config.${configIndex}.maxFiles`}
              render={({ field }: any) => (
                <FormItem>
                  <Label>Max No. of Files</Label>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="00"
                      {...field}
                      value={field.value || 1} // Ensure value is never undefined
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? 1
                            : Number.parseInt(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`applicationFormDetail.${nestIndex}.task.${taskIndex}.config.${configIndex}.maxFileSize`}
              render={({ field }: any) => (
                <FormItem>
                  <Label>Max Size per File (MB)</Label>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="15 MB"
                      {...field}
                      value={field.value.toString()} // Ensure value is never undefined
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value);
                        // Limit to 500 MB maximum
                        const limitedValue = Math.min(value, 500);
                        field.onChange(limitedValue);
                      }}
                      max={500} // HTML attribute to limit input
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-2 mt-1">
              <Label>Allowed File Types</Label>
              <div className="flex flex-wrap gap-1">
                {["All", "DOC", "PPT", "PDF", "XLS", "PSD", "EPF", "AI"].map(
                  (type) => (
                    <div key={type} className="flex items-center">
                      <Checkbox
                        id={type}
                        className="hidden"
                        onClick={() => toggleFileType(type)}
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleFileType(type)}
                      />
                      <Label
                        htmlFor={type}
                        className={`flex items-center cursor-pointer px-4 py-2 h-8 rounded-md border $ {
                    selectedTypes.includes(type) ? "bg-[#6808FE]" : "bg-[#0A0A0A]"
                  }`}
                      >
                        {type}
                      </Label>
                    </div>
                  )
                )}
              </div>
            </div>
          </>
        ) : null}

        {type === "link" ? (
          <FormField
            control={control}
            name={`applicationFormDetail.${nestIndex}.task.${taskIndex}.config.${configIndex}.maxFiles`}
            render={({ field }: any) => (
              <FormItem>
                <Label>Max No. of Links</Label>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="00"
                    {...field}
                    value={field.value || 1} // Ensure value is never undefined
                    onChange={(e) => {
                      const value =
                        e.target.value === ""
                          ? 1
                          : Number.parseInt(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => removeConfig(configIndex)}
      >
        <XIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
