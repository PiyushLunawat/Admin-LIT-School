"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  checkEmailExists,
  deleteCollaborator,
  editCollaborator,
  inviteCollaborators,
  updateCohort,
} from "@/app/api/cohorts";
import { useToast } from "@/hooks/use-toast";
import { deleteCollaborator as deleteCollaboratorFromStore } from "@/lib/features/cohort/cohortSlice";
import { CheckCircle, Plus, Send, SquarePen, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";

// Roles array
const roles = [
  // { value: "application_reviewer", label: "Application Reviewer" },
  { value: "interviewer", label: "Application Interviewer" },
  { value: "fee_collector", label: "Fee Collector" },
  { value: "Litmus_test_reviewer", label: "LITMUS Test Evaluator" },
];

// Zod schema
const formSchema = z.object({
  collaborators: z.array(
    z.object({
      email: z.string().email("Invalid email address"),
      role: z.string().nonempty("Role is required"),
      isInvited: z.boolean().optional(),
      isAccepted: z.boolean().optional(),
      cohortId: z.string().optional(),
      collaboratorId: z.string().optional(),
      roleId: z.string().optional(),
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
  const formatCollaborators = (collaborators: any[] = []) => {
    return collaborators.flatMap((collab) =>
      (collab.roles || []).map((roleObj: any) => ({
        email: collab.email || "",
        role: roleObj.role || "Unknown Role",
        isInvited: roleObj.isInvited || false,
        isAccepted: roleObj.isAccepted || false,
        cohortId: roleObj.cohortId || "",
        collaboratorId: collab._id || "",
        roleId: roleObj._id || "",
      }))
    );
  };

  // Usage
  const formattedCollaborators = formatCollaborators(
    initialData?.collaborators || []
  );
  console.log("one", formatCollaborators(initialData?.collaborators));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      collaborators: formatCollaborators(initialData?.collaborators || []) || [
        {
          email: "",
          role: "",
          isInvited: false,
          isAccepted: false,
          cohortId: "",
          collaboratorId: "",
          roleId: "",
        },
      ],
    },
  });
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [deleteLoading, setdeleteLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [editingCollaborator, setEditingCollaborator] = useState<number | null>(
    null
  );

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "collaborators",
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (fields.length === 0) {
      append({
        email: "",
        role: "",
        isInvited: false,
        isAccepted: false,
        cohortId: "",
        collaboratorId: "",
        roleId: "",
      });
    }
  }, [fields, append]);

  const getRole = (role: string) => {
    switch (role) {
      case "application_reviewer":
        return "Application Reviewer";
      case "interviewer":
        return "Application Interviewer";
      case "fee_collector":
        return "Fee Collector";
      case "Litmus_test_reviewer":
        return "LITMUS Test Evaluator";
      default:
        return "--";
    }
  };

  const handleRoleChange = async (value: string, index: number) => {
    form.setValue(`collaborators.${index}.role`, value); // Directly set the role value
    form.clearErrors(`collaborators.${index}.email`); // Clear email errors

    if (["interviewer", "Litmus_test_reviewer"].includes(value)) {
      const emailVal = form.getValues(`collaborators.${index}.email`).trim();

      // Check if email exists if the role is interviewer or evaluator
      if (emailVal) {
        const result = await checkEmailExists(emailVal);
        if (!result.success) {
          // Only show error if the email looks complete (contains "@" and ".")
          if (emailVal.includes("@") && emailVal.includes(".")) {
            form.setError(`collaborators.${index}.email`, {
              type: "manual",
              message: "This email doesn't have an account on Cal.LIT",
            });
          }
        } else {
          // Clear previous errors if email is valid
          form.clearErrors(`collaborators.${index}.email`);
        }
      }
    }
  };

  const handleCheckEmail = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const emailVal = e.target.value.trim();
    const role = form.getValues(`collaborators.${index}.role`);
    form.setValue(`collaborators.${index}.email`, emailVal);
    form.clearErrors(`collaborators.${index}.email`);

    if (emailVal && ["interviewer", "Litmus_test_reviewer"].includes(role)) {
      const result = await checkEmailExists(emailVal);
      if (!result.success) {
        form.setError(`collaborators.${index}.email`, {
          type: "manual",
          message: "This email doesn't have an account on CalendLIT",
        });
      }
    }
  };

  const handleEdit = (index: number) => {
    setEditingCollaborator(index);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      if (initialData?._id) {
        const collaboratorsToUpdate = data.collaborators.map((collab) => ({
          email: collab.email,
          role: collab.role,
        }));

        console.log("Collaborators data to send:", collaboratorsToUpdate);

        // Update the cohort
        const createdCohort = await updateCohort(initialData._id, {
          collaborators: collaboratorsToUpdate,
        });
        console.log("A", createdCohort);

        form.reset({
          collaborators: formatCollaborators(createdCohort.data.collaborators),
        });
        onCohortCreated(createdCohort.data);
        onComplete();
      } else {
        console.error("Cohort ID is missing. Unable to update.");
      }
    } catch (error) {
      console.error("Failed to update cohort:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (data: z.infer<typeof formSchema>) => {
    try {
      setInviteLoading(true);
      if (initialData?._id) {
        const collaboratorsToUpdate = data.collaborators.map((collab) => ({
          email: collab.email,
          role: collab.role,
        }));

        const updatedCohort = await updateCohort(initialData._id, {
          collaborators: collaboratorsToUpdate,
        });
        console.log("updateCohort", updatedCohort);
        form.reset({
          collaborators: formatCollaborators(updatedCohort.data.collaborators),
        });
        onCohortCreated(updatedCohort.data);

        const invited = await inviteCollaborators(initialData._id);

        console.log("invited", updatedCohort);

        toast({
          title: "Collaborators invited successfully!",
          variant: "success",
        });

        onCohortCreated(invited.data);

        form.reset({
          collaborators: invited.data.collaborators,
        });
      } else {
        toast({
          title: "Cohort ID is missing. Unable to invite collaborators!",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to invite collaborators:", error);
      toast({
        title: `Failed to invite collaborators:`,
        description: `${error}!`,
        variant: "destructive",
      });
    } finally {
      setInviteLoading(false);
    }
  };

  const handleDeleteCollab = async (
    cohortId?: string,
    collaboratorId?: string,
    roleId?: string,
    index?: number
  ) => {
    try {
      setdeleteLoading(true);

      if (cohortId && collaboratorId && roleId && typeof index === "number") {
        const deletePayload = { cohortId, collaboratorId, roleId };

        const deleteRes = await deleteCollaborator(deletePayload);

        remove(index); // remove from UI/form
        console.log(deleteRes);

        dispatch(deleteCollaboratorFromStore(collaboratorId));

        toast({
          title: "Collaborator deleted successfully!",
          variant: "success",
        });
      } else if (typeof index === "number") {
        remove(index); // just remove from form
        toast({
          title: "Unsaved collaborator removed.",
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Failed to delete collaborators:", errorMessage);
      toast({
        title: `Failed to delete collaborator: ${errorMessage}`,
        variant: "warning",
      });
    } finally {
      setdeleteLoading(false);
    }
  };

  const handleSaveEdit = async (
    roleId?: string,
    collabId?: string,
    role?: string
  ) => {
    try {
      setSaveLoading(true);

      const editPayload = {
        roleId: roleId,
        collaboratorId: collabId,
        role: role,
      };
      if (roleId && collabId && role) {
        const editResp = await editCollaborator(editPayload);
        console.log("edited", editResp);

        // onCohortCreated(editResp.data);
        toast({
          title: "Collaborator edited successfully!",
          variant: "success",
        });
      } else {
        toast({
          title: "Cohort ID is missing. Unable to edit collaborators!",
          variant: "warning",
        });
      }
    } catch (error) {
      console.error("Failed to edit collaborators:", error);
      toast({
        title: `Failed to edit collaborator:`,
        description: `${error}!`,
        variant: "warning",
      });
    } finally {
      setSaveLoading(false);
      setEditingCollaborator(null);
    }
  };

  const anyNotInvited = fields.some((collab) => !collab.isInvited);

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
                {editingCollaborator !== index && collaborator.isInvited ? (
                  <div className="w-full flex grid-cols-3 justify-between items-center">
                    <div className="w-3/5 flex-1">{collaborator.email}</div>
                    <div className="w-1/5 flex gap-1 mx-auto items-center">
                      Invited
                      <CheckCircle className="w-4 h-4 text-[#2EB88A]" />
                    </div>
                    <div className="flex gap-1 flex-1 justify-end items-center">
                      <div className="px-3 py-2 capitalize bg-[#262626] rounded">
                        {getRole(collaborator.role)}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={() => handleEdit(index)} // On click, edit this collaborator
                      >
                        <SquarePen className="w-4 h-4" />
                      </Button>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            onClick={() => handleDeleteCollab()}
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
                            <PopoverClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </PopoverClose>
                            <Button
                              className="bg-[#FF503D]/20 hover:bg-[#FF503D]/30 text-[#FF503D]"
                              onClick={() =>
                                handleDeleteCollab(
                                  collaborator.cohortId,
                                  collaborator.collaboratorId,
                                  collaborator.roleId,
                                  index
                                )
                              }
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
                              disabled={collaborator.isInvited}
                              type="email"
                              placeholder="email@example.com"
                              value={field.value || ""}
                              onChange={(e) => handleCheckEmail(e, index)}
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
                                    <PopoverClose asChild>
                                      <Button variant="outline">Cancel</Button>
                                    </PopoverClose>
                                    <Button
                                      className="bg-[#FF503D]/20 hover:bg-[#FF503D]/30 text-[#FF503D]"
                                      onClick={() =>
                                        handleDeleteCollab(
                                          collaborator.cohortId,
                                          collaborator.collaboratorId,
                                          collaborator.roleId,
                                          index
                                        )
                                      }
                                      disabled={deleteLoading}
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
                        {
                          form.formState.errors?.collaborators?.[index]?.email
                            ?.message
                        }
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
                            onValueChange={(value) =>
                              handleRoleChange(value, index)
                            } // Only update the role value
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
                                    role.value === "fee_collector" &&
                                    fields.some(
                                      (f) =>
                                        f.role === role.value &&
                                        f.id !== collaborator.id
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
                        {
                          form.formState.errors?.collaborators?.[index]?.role
                            ?.message
                        }
                      </FormMessage>
                    </div>
                  </div>
                )}
                {editingCollaborator === index && (
                  <div className="mt-3">
                    <Button
                      type="button"
                      disabled={saveLoading}
                      onClick={() =>
                        handleSaveEdit(
                          collaborator.roleId,
                          collaborator.collaboratorId,
                          form.getValues(`collaborators.${index}.role`)
                        )
                      }
                    >
                      Save
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Invite and add collaborator buttons */}
        <div className="flex gap-2">
          {anyNotInvited && (
            <Button
              disabled={fields.every(
                (field, i) =>
                  !field.email ||
                  !field.role ||
                  !!form.formState.errors?.collaborators?.[i]
              )}
              variant="outline"
              type="button"
              className="w-full bg-[#6808FE] hover:bg-[#6808FE]/80"
              onClick={() => handleInvite(form.getValues())}
            >
              <Send className="mr-2 h-4 w-4" />
              {inviteLoading ? "Sending Invite..." : "Invite Collaborator"}
            </Button>
          )}
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
        <Button type="submit" className="w-full" disabled={loading}>
          Update Cohort
        </Button>
      </form>
    </Form>
  );
}
