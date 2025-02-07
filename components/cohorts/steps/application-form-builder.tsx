"use client";

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
import { Plus, Trash2, GripVertical, XIcon, FolderPlus, Link2Icon, FileIcon } from "lucide-react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { updateCohort } from "@/app/api/cohorts";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";

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
              characterLimit: z.coerce.number().min(1).optional(),
              maxFiles: z.coerce.number().min(1).optional(),
              maxFileSize: z.coerce.number().min(1).optional(),
              allowedTypes: z.array(z.string()).optional(),
            })
          ),
          resourceLink: z.string().optional(), // Add this line
        })
      ),
      // calendlyEmbedCode: z.string().optional(),
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
        initialData?.applicationFormDetail && initialData.applicationFormDetail.length > 0
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
                        characterLimit: undefined,
                        maxFiles: undefined,
                        maxFileSize: undefined,
                        allowedTypes: ["All"],
                      },
                    ],
                    resourceLink: "",
                  },
                ],
                // calendlyEmbedCode: "",
              },
            ],
    },
  });  
  const [loading, setLoading] = useState(false);  
  const { control, handleSubmit } = form;

  const {
    fields: applicationFormFields,
  } = useFieldArray({
    control,
    name: "applicationFormDetail",
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true)
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
      setLoading(false)
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-h-[80vh] p-4"
      >
        {applicationFormFields.map((applicationFormField, applicationFormIndex) => (
          <div key={applicationFormField.id} className="space-y-4">
            <TaskList
              nestIndex={applicationFormIndex}
              control={control}
              form={form}
            />

            {/* Calendly Embed Code */}
            {/* <FormField
              control={control}
              name={`applicationFormDetail.${applicationFormIndex}.calendlyEmbedCode`}
              render={({ field }) => (
                <FormItem>
                  <Label>Interview Scheduler (Calendly)</Label>
                  <FormControl>
                    <Textarea className="min-h-4" placeholder="Paste Calendly embed code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>
        ))}

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
            characterLimit: undefined,
            maxFiles: undefined,
            maxFileSize: undefined,
            allowedTypes: ["All"],
          },
        ],
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
            id: Math.random().toString(36).substr(2, 9),
            title: "",
            description: "",
            config: [
              {
                type: "",
                characterLimit: undefined,
                maxFiles: undefined,
                maxFileSize: undefined,
                allowedTypes: ["All"],
              },
            ],
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
                <Label className="text-[#00A3FF]">Task 0{taskIndex+1}</Label>
                <FormControl>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., Share an Embarrassing Story"
                      {...field}
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button type="button" variant="ghost" size="icon" className="text-destructive" >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="end" side="top" className="max-w-[345px] w-full">
                        <div className="text-base font-medium mb-2">
                          {`Are you sure you would like to delete ${form.getValues(`applicationFormDetail.${nestIndex}.task.${taskIndex}.title`)}?`}
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" >Cancel</Button>
                          <Button className="bg-[#FF503D]/20 hover:bg-[#FF503D]/30 text-[#FF503D]" onClick={() => removeTask(taskIndex)}>Delete</Button>
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
                  characterLimit: undefined,
                  maxFiles: undefined,
                  maxFileSize: undefined,
                  allowedTypes: ["All"],
                })
              }
            >
              <FolderPlus className="w-4 h-4" /> Add a Submission Type
            </Button>
          </div>

          {/* Resources Section */}
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
  {!addedLink ? (
    <div className="relative flex items-center gap-2">
      <Link2Icon className="absolute left-2 top-3 w-4 h-4" />
      <Input
        className="pl-8 text-sm"
        placeholder="Enter URL here"
        value={resourceLink}
        onChange={(e) => setResourceLink(e.target.value)}
      />
      <Button
        type="button"
        onClick={handleAddLink}
        disabled={!resourceLink}
        className="absolute right-2 top-1.5 h-7 rounded-full"
      >
        Add
      </Button>
    </div>
  ) : (
    <div className="flex items-center gap-2 p-2 border rounded">
      <Link2Icon className="w-4 h-4" />
      <span className="flex-1">{addedLink}</span>
      <XIcon className="w-4 h-4 cursor-pointer" onClick={handleRemoveLink} />
    </div>
  )}
  <div className="flex gap-2.5">
    <Button
      type="button"
      variant='secondary'
      className="flex flex-1 gap-2"
      onClick={() => document.getElementById(`file-upload-${taskField.id}`)?.click()}
    >
      <FileIcon className="w-4 h-4"/> Upload Resource File
    </Button>
    <input
      type="file"
      id={`file-upload-${taskField.id}`}
      style={{ display: "none" }}
      onChange={handleFileUpload}
    />
    <Button
      type="button"
      variant='secondary'
      className="flex flex-1 gap-2"
      onClick={() => setIsLinkInputVisible(true)}
    >
      <Link2Icon className="w-4 h-4"/> Attach Resource Link
    </Button>
  </div>
</div>
        </div>
        

      </CardContent>
    </Card>
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
              <Label className="text-[#00A3FF] mt-2 mb-[3px]">Submission Type 0{configIndex+1}</Label>
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
                  <Input type="number" placeholder="Enter maximum characters" {...field} />
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
                    <Input type="number" placeholder="00" {...field} />
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
                    <Input type="number" placeholder="15 MB" {...field} />
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
                    <Input type="number" placeholder="00" {...field} />
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
                    <Input type="number" placeholder="15 MB" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-2 mt-1">
            <Label>Allowed File Types</Label> 
              <div className="flex flex-wrap gap-1">
              {["All", "DOC", "PPT", "PDF", "XLS", "PSD", "EPF", "AI"].map((type) => (
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
        ) : null}

        {type === "link" ? (
          <FormField
            control={control}
            name={`applicationFormDetail.${nestIndex}.task.${taskIndex}.config.${configIndex}.maxFiles`}
            render={({ field }: any) => (
              <FormItem>
                <Label>Max No. of Links</Label>
                <FormControl>
                  <Input type="number" placeholder="00" {...field} />
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
