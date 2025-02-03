"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Form,
  FormMessage,
} from "@/components/ui/form";

import { CheckCircle, Plus, Send, SquarePen, Trash2 } from "lucide-react";
import { checkEmailExists, inviteCollaborators, updateCohort } from "@/app/api/cohorts";

// Roles array (as before)
const roles = [
  { value: "reviewer", label: "Application Reviewer" },
  { value: "interviewer", label: "Interviewer" },
  { value: "collector", label: "Fee Collector" },
  { value: "evaluator", label: "LITMUS Test Evaluator" },
];

// Zod schema (as before)
const formSchema = z.object({
  collaborators: z.array(
    z.object({
      email: z.string().email("Invalid email address"),
      role: z.string().nonempty("Role is required"),
      isInvited: z.boolean().optional(),
    })
  ),
});

interface CollaboratorsFormProps {
  onComplete: () => void;
  onCohortCreated: (cohort: any) => void;
  initialData?: any;
}

export function CollaboratorsForm({
  onComplete,
  onCohortCreated,
  initialData,
}: CollaboratorsFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      collaborators: initialData?.collaborators || [
        { email: "", role: "", isInvited: false },
      ],
    },
  });

  const [editingCollaborator, setEditingCollaborator] = useState<number | null>(null);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "collaborators",
  });

  useEffect(() => {
    if (fields.length === 0) {
      append({ email: "", role: "", isInvited: false });
    }
  }, [fields, append]);

  const handleEmailChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const emailVal = e.target.value.trim();

    form.setValue(`collaborators.${index}.email`, emailVal);
    form.clearErrors(`collaborators.${index}.email`);

    if (emailVal) {
      const result = await checkEmailExists(emailVal);
      if (!result.success) {
        form.setError(`collaborators.${index}.email`, {
          type: "manual",
          message: result.message || "User not found in the system",
        });
      }
    }
  };

  const handleEdit = (index: number) => {
    setEditingCollaborator(index); // Set the collaborator to edit
  };

  const handleCancelEdit = () => {
    setEditingCollaborator(null); // Cancel editing
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (initialData?._id) {
        const collaboratorsToUpdate = data.collaborators.map((collab) => ({
          email: collab.email,
          role: collab.role,
          isInvited: collab.isInvited ?? false,
        }));

        console.log("Collaborators data to send:", collaboratorsToUpdate);

        // Update the cohort
        const createdCohort = await updateCohort(initialData._id, {
          collaborators: collaboratorsToUpdate,
        });

        onCohortCreated(createdCohort.data);
        onComplete(); // proceed to the next step
      } else {
        console.error("Cohort ID is missing. Unable to update.");
      }
    } catch (error) {
      console.error("Failed to update cohort:", error);
    }
  };

  const handleInvite = async () => {
    try {
      if (initialData?._id) {
        await inviteCollaborators(initialData._id);
        alert("Collaborators invited successfully!");
      } else {
        console.error("Cohort ID is missing. Unable to invite collaborators.");
      }
    } catch (error) {
      console.error("Failed to invite collaborators:", error);
      alert("Failed to invite collaborators. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-h-[80vh] space-y-6 py-4"
      >
        <div className="space-y-4">
          {fields.map((collaborator, index) => (
            <Card key={collaborator.id}>
              <CardContent className="pt-6">
                {(editingCollaborator !== index && collaborator.isInvited) ? (
                      <div className="flex grid-cols-3 justify-between items-center">
                        <div className="w-2/5">{collaborator.email}</div>
                        <div className="w-1/5 flex gap-1 mx-auto items-center">
                          Invited
                          <CheckCircle className="w-4 h-4 text-[#2EB88A]" />
                        </div>
                        <div className="flex gap-1 justify-center items-center">

                        <div className="px-3 py-2 capitalize bg-[#262626] rounded">
                          {collaborator.role}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          onClick={() => handleEdit(index)} // On click, edit this collaborator
                          >
                          <SquarePen className="w-4 h-4"/>
                        </Button>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
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
                                `collaborators.${index}.email`
                              )}?`}
                            </div>
                            <div className="flex gap-2 justify-end">
                              <Button variant="outline">Cancel</Button>
                              <Button
                                className="bg-[#FF503D]/20 hover:bg-[#FF503D]/30 text-[#FF503D]"
                                onClick={() => remove(index)}
                                >
                                Delete
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                        </div>
                      </div>
                    ) : (
                <div className="grid gap-4">
                  <div className="grid gap-3 flex-1">
                    <Label>Email Address</Label>
                      <Controller
                      control={form.control}
                      name={`collaborators.${index}.email`}
                      render={({ field }) => (
                        <div className="flex justify-between items-center">
                          <Input
                            type="email"
                            placeholder="email@example.com"
                            // Use the field's value and the separate change handler
                            value={field.value || ""}
                            onChange={(e) => handleEmailChange(e, index)}
                          />
                          {fields.length > 1 && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
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
                                    `collaborators.${index}.email`
                                  )}?`}
                                </div>
                                <div className="flex gap-2 justify-end">
                                  <Button variant="outline">Cancel</Button>
                                  <Button
                                    className="bg-[#FF503D]/20 hover:bg-[#FF503D]/30 text-[#FF503D]"
                                    onClick={() => remove(index)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                      )}
                    />
                    {/* Display any validation or manual error messages */}
                    <FormMessage>
                      {form.formState.errors?.collaborators?.[index]?.email?.message}
                    </FormMessage>
                  </div>

                  {/* -- Role Select -- */}
                  <div className="grid gap-3">
                    <Label>Role</Label>
                    <Controller
                      control={form.control}
                      name={`collaborators.${index}.role`}
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem
                                key={role.value}
                                value={role.value}
                                disabled={
                                  // Example logic: only one "collector" allowed
                                  role.value === "collector" &&
                                  fields.some(
                                    (f) => f.role === role.value && f.id !== collaborator.id
                                  )
                                }
                              >
                                {role.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FormMessage>
                      {form.formState.errors?.collaborators?.[index]?.role?.message}
                    </FormMessage>
                  </div>
                </div>
                )}
                {editingCollaborator === index && (
                  <div className="mt-3">
                    <Button type="button" onClick={handleCancelEdit}>Save</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Invite and add collaborator buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            type="button"
            className="w-full bg-[#6808FE] hover:bg-[#6808FE]/80"
            onClick={handleInvite}
          >
            <Send className="mr-2 h-4 w-4" />
            Invite Collaborator
          </Button>
          <Button
            onClick={() => append({ email: "", role: "", isInvited: false })}
            variant="outline"
            type="button"
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Collaborator
          </Button>
        </div>

        {/* Submit (Update) */}
        <Button type="submit" className="w-full">
          Update Cohort
        </Button>
      </form>
    </Form>
  );
}
