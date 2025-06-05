"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { setCohortData } from "@/lib/features/cohort/cohortSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { CheckCircle, Plus, Send, SquarePen, Trash2 } from "lucide-react";

// Roles array
const roles = [
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
  const dispatch = useAppDispatch();
  const cohortState = useAppSelector((state) => state.cohort);
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [editingCollaborator, setEditingCollaborator] = useState<number | null>(
    null
  );

  // Use ref to track if we're in the middle of an operation
  const isOperationInProgress = useRef(false);
  const lastDataHash = useRef<string>("");

  // Format collaborators helper function with deduplication
  const formatCollaborators = useCallback((collaborators: any[] = []) => {
    console.log("Formatting collaborators:", collaborators);

    const formatted = collaborators.flatMap((collab) =>
      (collab.roles || []).map((roleObj: any) => ({
        email: collab.email || "",
        role: roleObj.role || "",
        isInvited: roleObj.isInvited || false,
        isAccepted: roleObj.isAccepted || false,
        cohortId: roleObj.cohortId || "",
        collaboratorId: collab._id || "",
        roleId: roleObj._id || "",
      }))
    );

    // Remove duplicates based on email + role combination
    const uniqueCollaborators = formatted.filter(
      (collab, index, self) =>
        index ===
        self.findIndex(
          (c) => c.email === collab.email && c.role === collab.role
        )
    );

    console.log("Formatted unique collaborators:", uniqueCollaborators);
    return uniqueCollaborators;
  }, []);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      collaborators: [],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "collaborators",
  });

  // Create a hash of the data to detect changes
  const createDataHash = useCallback((data: any) => {
    return JSON.stringify(data?.collaborators || []);
  }, []);

  // Reset form when data changes - with better deduplication and timing
  useEffect(() => {
    if (isOperationInProgress.current) {
      console.log("Operation in progress, skipping form reset");
      return;
    }

    let collaboratorsToUse = [];

    // Priority: Redux state > initialData
    if (cohortState.collaborators.collaborators.length > 0) {
      collaboratorsToUse = cohortState.collaborators.collaborators;
    } else if (initialData?.collaborators) {
      collaboratorsToUse = initialData.collaborators;
    }

    const currentDataHash = createDataHash({
      collaborators: collaboratorsToUse,
    });

    // Only update if data actually changed
    if (currentDataHash === lastDataHash.current) {
      console.log("Data hasn't changed, skipping form reset");
      return;
    }

    lastDataHash.current = currentDataHash;

    const formattedCollabs = formatCollaborators(collaboratorsToUse);
    console.log("Resetting form with collaborators:", formattedCollabs);

    // Always ensure we have at least one empty field for new entries
    const collaboratorsForForm = [...formattedCollabs];

    // Only add empty field if all existing fields are filled (have both email and role)
    const allFieldsFilled = formattedCollabs.every(
      (collab) => collab.email && collab.role
    );
    if (formattedCollabs.length === 0 || allFieldsFilled) {
      collaboratorsForForm.push({
        email: "",
        role: "",
        isInvited: false,
        isAccepted: false,
        cohortId: "",
        collaboratorId: "",
        roleId: "",
      });
    }

    // Use replace instead of reset to avoid triggering other effects
    replace(collaboratorsForForm);
  }, [
    initialData,
    cohortState.collaborators.collaborators,
    formatCollaborators,
    replace,
    createDataHash,
  ]);

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
        return role || "--";
    }
  };

  const handleRoleChange = async (value: string, index: number) => {
    form.setValue(`collaborators.${index}.role`, value);
    form.clearErrors(`collaborators.${index}.email`);

    if (["interviewer", "Litmus_test_reviewer"].includes(value)) {
      const emailVal = form.getValues(`collaborators.${index}.email`).trim();

      if (emailVal) {
        const result = await checkEmailExists(emailVal);
        if (!result.success) {
          if (emailVal.includes("@") && emailVal.includes(".")) {
            form.setError(`collaborators.${index}.email`, {
              type: "manual",
              message: "This email doesn't have an account on Cal.LIT",
            });
          }
        } else {
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
    isOperationInProgress.current = true;

    try {
      if (initialData?._id) {
        // Filter out empty collaborators and remove duplicates
        const validCollaborators = data.collaborators
          .filter((collab) => collab.email.trim() && collab.role)
          .filter(
            (collab, index, self) =>
              index ===
              self.findIndex(
                (c) => c.email === collab.email && c.role === collab.role
              )
          );

        const collaboratorsToUpdate = validCollaborators.map((collab) => ({
          email: collab.email,
          role: collab.role,
        }));

        console.log("Submitting collaborators:", collaboratorsToUpdate);

        const createdCohort = await updateCohort(initialData._id, {
          collaborators: collaboratorsToUpdate,
        });

        if (createdCohort.data) {
          const updatedCohort = {
            ...initialData,
            ...createdCohort.data,
          };

          // Update Redux state
          dispatch(setCohortData(updatedCohort));

          // Update parent component
          onCohortCreated(updatedCohort);

          // Update the data hash
          lastDataHash.current = createDataHash(updatedCohort);

          toast({
            title: "Cohort updated successfully!",
            variant: "success",
          });

          onComplete();
        }
      } else {
        console.error("Cohort ID is missing. Unable to update.");
        toast({
          title: "Cohort ID is missing. Unable to update.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to update cohort:", error);
      toast({
        title: "Failed to update cohort",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      isOperationInProgress.current = false;
    }
  };

  const handleInvite = async (data: z.infer<typeof formSchema>) => {
    setInviteLoading(true);
    isOperationInProgress.current = true;

    try {
      if (initialData?._id) {
        // Filter and deduplicate collaborators
        const validCollaborators = data.collaborators
          .filter((collab) => collab.email.trim() && collab.role)
          .filter(
            (collab, index, self) =>
              index ===
              self.findIndex(
                (c) => c.email === collab.email && c.role === collab.role
              )
          );

        const collaboratorsToUpdate = validCollaborators.map((collab) => ({
          email: collab.email,
          role: collab.role,
        }));

        // First update the cohort with new collaborators
        const updatedCohort = await updateCohort(initialData._id, {
          collaborators: collaboratorsToUpdate,
        });

        if (updatedCohort.data) {
          // Now send invites
          const invited = await inviteCollaborators(initialData._id);

          if (invited.data) {
            const finalCohort = {
              ...initialData,
              ...invited.data,
              collaborators:
                invited.data.collaborators || updatedCohort.data.collaborators,
            };

            // Update Redux state
            dispatch(setCohortData(finalCohort));

            // Update parent component
            onCohortCreated(finalCohort);

            // Update the data hash
            lastDataHash.current = createDataHash(finalCohort);

            toast({
              title: "Collaborators invited successfully!",
              variant: "success",
            });
          }
        }
      } else {
        toast({
          title: "Cohort ID is missing. Unable to invite collaborators!",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to invite collaborators:", error);
      toast({
        title: "Failed to invite collaborators",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setInviteLoading(false);
      isOperationInProgress.current = false;
    }
  };

  const handleDeleteCollab = async (
    cId?: string,
    collabId?: string,
    roleId?: string,
    index?: number
  ) => {
    setDeleteLoading(true);
    isOperationInProgress.current = true;

    try {
      if (cId && collabId && roleId && typeof index === "number") {
        const deletePayload = {
          cohortId: cId,
          collaboratorId: collabId,
          roleId: roleId,
        };

        console.log("Deleting collaborator:", deletePayload);

        const deleteRes = await deleteCollaborator(deletePayload);

        if (deleteRes.data) {
          const updatedCohort = {
            ...initialData,
            ...deleteRes.data,
            collaborators: deleteRes.data.collaborators || [],
          };

          console.log("Delete response cohort:", updatedCohort);

          // Update Redux state
          dispatch(setCohortData(updatedCohort));

          // Update parent component
          onCohortCreated(updatedCohort);

          // Update the data hash
          lastDataHash.current = createDataHash(updatedCohort);

          toast({
            title: "Collaborator deleted successfully!",
            variant: "success",
          });
        }
      } else if (typeof index === "number") {
        // Just remove the field for new collaborators
        remove(index);

        // If we removed the last field and there are no existing collaborators, add an empty one
        if (fields.length === 1 && !fields[0].collaboratorId) {
          setTimeout(() => {
            append({
              email: "",
              role: "",
              isInvited: false,
              isAccepted: false,
              cohortId: "",
              collaboratorId: "",
              roleId: "",
            });
          }, 100);
        }
      }
    } catch (error) {
      console.error("Failed to delete collaborator:", error);
      toast({
        title: "Failed to delete collaborator",
        description: String(error),
        variant: "warning",
      });
    } finally {
      setDeleteLoading(false);
      isOperationInProgress.current = false;
    }
  };

  const handleSaveEdit = async (
    roleId?: string,
    collabId?: string,
    role?: string,
    index?: number
  ) => {
    setSaveLoading(true);
    isOperationInProgress.current = true;

    try {
      if (!roleId || !collabId || !role) {
        toast({
          title: "Missing required data. Unable to edit collaborator!",
          variant: "warning",
        });
        return;
      }

      const editPayload = {
        roleId: roleId,
        collaboratorId: collabId,
        role: role,
      };

      console.log("Editing collaborator:", editPayload);

      const editResp = await editCollaborator(editPayload);

      if (editResp.data) {
        const updatedCohort = {
          ...initialData,
          ...editResp.data,
          collaborators:
            editResp.data.collaborators || initialData?.collaborators || [],
        };

        console.log("Edit response cohort:", updatedCohort);

        // Update Redux state
        dispatch(setCohortData(updatedCohort));

        // Update parent component
        onCohortCreated(updatedCohort);

        // Update the data hash
        lastDataHash.current = createDataHash(updatedCohort);

        toast({
          title: "Collaborator edited successfully!",
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Failed to edit collaborator:", error);
      toast({
        title: "Failed to edit collaborator",
        description: String(error),
        variant: "warning",
      });
    } finally {
      setSaveLoading(false);
      setEditingCollaborator(null);
      isOperationInProgress.current = false;
    }
  };

  const handleAddCollaborator = () => {
    append({
      email: "",
      role: "",
      isInvited: false,
      isAccepted: false,
      cohortId: "",
      collaboratorId: "",
      roleId: "",
    });
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
                {collaborator.isInvited && editingCollaborator !== index ? (
                  // Invited collaborator view (read-only)
                  <div className="w-full flex grid-cols-3 justify-between items-center">
                    <div className="w-3/5 flex-1">{collaborator.email}</div>
                    <div className="w-1/5 flex gap-1 mx-auto items-center">
                      Invited
                      <CheckCircle className="w-4 h-4 text-[#2EB88A]" />
                    </div>
                    <div className="flex gap-1 flex-1 justify-end items-center">
                      <div className="px-3 py-2 capitalize text-white bg-[#262626] rounded">
                        {getRole(collaborator.role)}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={() => handleEdit(index)}
                      >
                        <SquarePen className="w-4 h-4" />
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
                            {`Are you sure you would like to delete ${collaborator.email}?`}
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
                    </div>
                  </div>
                ) : (
                  // Editable form view (for new collaborators or editing existing ones)
                  <div className="grid gap-4">
                    <div className="grid gap-3 flex-1">
                      <Label>Email Address</Label>
                      <Controller
                        control={form.control}
                        name={`collaborators.${index}.email`}
                        render={({ field }) => (
                          <div className="flex justify-between items-center">
                            <Input
                              disabled={
                                collaborator.isInvited &&
                                editingCollaborator !== index
                              }
                              type="email"
                              placeholder="email@example.com"
                              value={field.value || ""}
                              onChange={(e) => handleCheckEmail(e, index)}
                            />
                            {(fields.length > 1 ||
                              collaborator.email ||
                              collaborator.role) && (
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
                                    {`Are you sure you would like to delete ${
                                      collaborator.email || "this collaborator"
                                    }?`}
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
                            }
                            value={field.value || ""}
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

                    {editingCollaborator === index && (
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          disabled={saveLoading}
                          onClick={() =>
                            handleSaveEdit(
                              collaborator.roleId,
                              collaborator.collaboratorId,
                              form.getValues(`collaborators.${index}.role`),
                              index
                            )
                          }
                        >
                          {saveLoading ? "Saving..." : "Save"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setEditingCollaborator(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
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
              disabled={
                inviteLoading ||
                fields.every(
                  (field, i) =>
                    !field.email ||
                    !field.role ||
                    !!form.formState.errors?.collaborators?.[i]
                )
              }
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
            onClick={handleAddCollaborator}
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
          {loading ? "Updating..." : "Update Cohort"}
        </Button>
      </form>
    </Form>
  );
}
