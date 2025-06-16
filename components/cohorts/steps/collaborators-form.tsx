"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
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

const ROLES = [
  { value: "application_interviewer", label: "Application Interviewer" },
  { value: "litmus_interviewer", label: "LITMUS Test Evaluator" },
];

const collaboratorFormSchema = z.object({
  collaborators: z.array(
    z.object({
      email: z
        .string()
        .email("Invalid email address")
        .refine((email) => email.endsWith("@litschool.in"), {
          message: "Email must be from @litschool.in domain",
        }),
      role: z.string().nonempty("Role is required"),
      isInvited: z.boolean().optional(),
      isAccepted: z.boolean().optional(),
      cohortId: z.string().optional(),
      collaboratorId: z.string().optional(),
      roleId: z.string().optional(),
    })
  ),
});

// Add custom validation for duplicate email-role combinations
const enhancedFormSchema = collaboratorFormSchema.superRefine(
  (data, context) => {
    const seenCombinations = new Set();

    for (const [index, collaborator] of data.collaborators.entries()) {
      const combinationKey = `${collaborator.email.toLowerCase()}-${
        collaborator.role
      }`;

      if (seenCombinations.has(combinationKey)) {
        const parts = combinationKey.split("-");
        const role = parts.pop();
        const email = parts.join("-");

        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `This role has already been assigned to ${email}`,
          path: [`collaborators.${index}.role`],
        });
      } else {
        seenCombinations.add(combinationKey);
      }
    }
  }
);

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
  const formatCollaboratorsData = (collaborators: any[] = []) => {
    return collaborators.flatMap((collaborator) =>
      (collaborator.roles || []).map((roleData: any) => ({
        email: collaborator.email || "",
        role: roleData.role || "Unknown Role",
        isInvited: roleData.isInvited || false,
        isAccepted: roleData.isAccepted || false,
        cohortId: roleData.cohortId || "",
        collaboratorId: collaborator._id || "",
        roleId: roleData._id || "",
      }))
    );
  };

  const form = useForm<z.infer<typeof collaboratorFormSchema>>({
    resolver: zodResolver(enhancedFormSchema),
    defaultValues: {
      collaborators: formatCollaboratorsData(
        initialData?.collaborators || []
      ) || [
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editingCollaboratorIndex, setEditingCollaboratorIndex] = useState<
    number | null
  >(null);
  const [emailErrors, setEmailErrors] = useState<{ [index: number]: string }>(
    {}
  );
  const debounceTimers = useRef<{ [key: number]: NodeJS.Timeout }>({});

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

  const getRoleLabel = (roleValue: string) => {
    switch (roleValue) {
      case "application_reviewer":
        return "Application Reviewer";
      case "application_interviewer":
        return "Application Interviewer";
      case "fee_collector":
        return "Fee Collector";
      case "litmus_interviewer":
        return "LITMUS Test Evaluator";
      default:
        return "--";
    }
  };

  // Unified function to validate Cal.LIT account
  const validateCalAccount = async (email: string, fieldIndex: number) => {
    if (!email) return;

    // Clear previous error

    // Skip validation if not required for role
    const currentRole = form.getValues(`collaborators.${fieldIndex}.role`);
    const requiresCalAccount = [
      "application_interviewer",
      "litmus_interviewer",
    ].includes(currentRole);

    if (!requiresCalAccount) return;

    debounceTimers.current[fieldIndex] = setTimeout(async () => {
      const currentRole = form.getValues(`collaborators.${fieldIndex}.role`);

      try {
        const emailCheckResult = await checkEmailExists(email);
        if (!emailCheckResult.success) {
          setEmailErrors((prev) => ({
            ...prev,
            [fieldIndex]: "This email doesn't have an account on Cal.LIT",
          }));
        } else {
          setEmailErrors((prev) => ({ ...prev, [fieldIndex]: "" }));
        }
      } catch (error) {
        setEmailErrors((prev) => ({
          ...prev,
          [fieldIndex]: "Error checking email account",
        }));
      }
    }, 500);
  };

  const handleRoleSelection = async (
    selectedRole: string,
    fieldIndex: number
  ) => {
    form.setValue(`collaborators.${fieldIndex}.role`, selectedRole);
    form.clearErrors(`collaborators.${fieldIndex}.email`);

    const emailValue = form
      .getValues(`collaborators.${fieldIndex}.email`)
      .trim();
    await validateCalAccount(emailValue, fieldIndex);
  };

  const validateEmailWithDebounce = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldIndex: number
  ) => {
    const emailValue = e.target.value.trim();
    form.setValue(`collaborators.${fieldIndex}.email`, emailValue);
    form.clearErrors(`collaborators.${fieldIndex}.email`);

    clearTimeout(debounceTimers.current[fieldIndex]);

    debounceTimers.current[fieldIndex] = setTimeout(() => {
      validateCalAccount(emailValue, fieldIndex);
    }, 500);
  };

  const handleEditCollaborator = (fieldIndex: number) => {
    setEditingCollaboratorIndex(fieldIndex);
  };

  const hasInvalidUninvited = fields.some((field, i) => {
    if (field.isInvited) return false;

    return (
      !field.email ||
      !field.role ||
      !!form.formState.errors?.collaborators?.[i] ||
      !!emailErrors[i]
    );
  });

  const handleFormSubmit = async (
    data: z.infer<typeof collaboratorFormSchema>
  ) => {
    const hasEmailErrors = Object.values(emailErrors).some(
      (error) => error !== ""
    );
    const isValid = await form.trigger();

    if (!isValid || hasEmailErrors) {
      toast({
        title: "Failed to add collabarotes",
        description: "Please chaeck all emails before saving",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (initialData?._id) {
        const collaboratorsPayload = data.collaborators.map((collaborator) => ({
          email: collaborator.email,
          role: collaborator.role,
        }));

        const updatedCohortResponse = await updateCohort(initialData._id, {
          collaborators: collaboratorsPayload,
        });

        form.reset({
          collaborators: formatCollaboratorsData(updatedCohortResponse.data),
        });

        const updatedCohortData = {
          ...initialData,
          collaborators: updatedCohortResponse.data,
        };

        onCohortCreated(updatedCohortData);
        onComplete();
      }
    } catch (error) {
      console.error("Failed to update cohort:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInviteCollaborators = async (
    data: z.infer<typeof collaboratorFormSchema>
  ) => {
    const hasEmailErrors = Object.values(emailErrors).some(
      (error) => error !== ""
    );
    const isValid = await form.trigger();

    if (!isValid || hasEmailErrors) {
      toast({
        title: "Failed to invite collabarotes",
        description: "Please check all email before inviting",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsInviting(true);
      if (initialData?._id) {
        const collaboratorsPayload = data.collaborators.map((collaborator) => ({
          email: collaborator.email,
          role: collaborator.role,
        }));

        const updateResponse = await updateCohort(initialData._id, {
          collaborators: collaboratorsPayload,
        });

        const inviteResponse = await inviteCollaborators(initialData._id);

        form.reset({
          collaborators: formatCollaboratorsData(inviteResponse.data.details),
        });

        const invitedCohortData = {
          ...initialData,
          collaborators: inviteResponse.data.details,
        };

        onCohortCreated(invitedCohortData);

        toast({
          title: "Collaborators invited successfully!",
          variant: "success",
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
      setIsInviting(false);
    }
  };

  const handleCollaboratorRemoval = async (
    cohortId?: string,
    collaboratorId?: string,
    roleId?: string,
    fieldIndex?: number
  ) => {
    try {
      setIsDeleting(true);

      if (
        cohortId &&
        collaboratorId &&
        roleId &&
        typeof fieldIndex === "number"
      ) {
        const deletePayload = { cohortId, collaboratorId, roleId };

        const deleteResponse = await deleteCollaborator(deletePayload);

        remove(fieldIndex);
        form.reset({
          collaborators: formatCollaboratorsData(deleteResponse.data),
        });

        const updatedCohortData = {
          ...initialData,
          collaborators: deleteResponse.data,
        };

        onCohortCreated(updatedCohortData);
        dispatch(deleteCollaboratorFromStore(collaboratorId));

        toast({
          title: "Collaborator deleted successfully!",
          variant: "success",
        });
      } else if (typeof fieldIndex === "number") {
        remove(fieldIndex);
        toast({
          title: "Unsaved collaborator removed.",
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: `Failed to delete collaborator: ${errorMessage}`,
        variant: "warning",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveCollaboratorEdit = async (
    index: number,
    roleId?: string,
    collaboratorId?: string,
    newRole?: string
  ) => {
    if (emailErrors[index]) {
      toast({
        title: "Failed to add collabarotes",
        description: "This email doesn't have a Cal.LIT account",
        variant: "destructive",
      });
      return;
    }

    const collaborators = form.getValues().collaborators;
    const currentCollaborator = collaborators[index];

    const duplicate = collaborators.some(
      (collab, i) =>
        i !== index &&
        collab.email.toLowerCase() ===
          currentCollaborator.email.toLowerCase() &&
        collab.role === newRole
    );

    if (duplicate) {
      form.setError(`collaborators.${index}.role`, {
        type: "custom",
        message: `This role has already been assigned to ${currentCollaborator.email}`,
      });
      return;
    }
    try {
      setIsSavingEdit(true);

      const editPayload = {
        roleId: roleId,
        collaboratorId: collaboratorId,
        role: newRole,
      };

      if (roleId && collaboratorId && newRole) {
        const editResponse = await editCollaborator(editPayload);

        form.reset({
          collaborators: formatCollaboratorsData(editResponse.data),
        });

        const updatedCohortData = {
          ...initialData,
          collaborators: editResponse.data,
        };

        onCohortCreated(updatedCohortData);

        toast({
          title: "Collaborator edited successfully!",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: `Failed to edit collaborator:`,
        description: `${error}!`,
        variant: "warning",
      });
    } finally {
      setIsSavingEdit(false);
      setEditingCollaboratorIndex(null);
    }
  };

  const hasUninvitedCollaborators = fields.some(
    (collaborator) => !collaborator.isInvited
  );

  // Function to add new collaborator only if unique
  const addNewCollaborator = () => {
    const currentCollaborators = form.getValues().collaborators;
    const isExisting = currentCollaborators.some(
      (collab) => !collab.email && !collab.role
    );

    if (!isExisting) {
      append({ email: "", role: "", isInvited: false });
    } else {
      toast({
        title: "Please fill existing collaborator fields first",
        variant: "warning",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="max-h-[80vh] space-y-6 py-4"
      >
        <div className="space-y-4">
          {fields.map((collaborator, index) => (
            <Card key={collaborator.id}>
              <CardContent className="pt-6">
                {editingCollaboratorIndex !== index &&
                collaborator.isInvited ? (
                  <div className="w-full flex grid-cols-3 justify-between items-center">
                    <div className="w-3/5 flex-1">{collaborator.email}</div>
                    <div className="w-1/5 mx-auto">
                      {collaborator.isAccepted ? (
                        <div className="flex gap-1 items-center text-[#2EB88A]">
                          Invitation accepted
                          <CheckCircle className="w-4 h-4 text-[#2EB88A]" />
                        </div>
                      ) : collaborator.isInvited ? (
                        <div className="flex gap-1 items-center">
                          Invited
                          <CheckCircle className="w-4 h-4 text-[#2EB88A]" />
                        </div>
                      ) : (
                        <div className="flex gap-1 items-center text-muted-foreground">
                          Not yet invited
                          <Plus className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1 flex-1 justify-end items-center">
                      <div className="px-3 py-2 capitalize bg-[#262626] rounded">
                        {getRoleLabel(collaborator.role)}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={() => handleEditCollaborator(index)}
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
                                handleCollaboratorRemoval(
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
                    <div className="grid flex-1">
                      <Label className="mb-2">Email Address</Label>
                      <Controller
                        control={form.control}
                        name={`collaborators.${index}.email`}
                        render={({ field }) => (
                          <div className="flex justify-between items-center">
                            <Input
                              disabled={collaborator.isInvited}
                              type="email"
                              placeholder="email@litschool.in"
                              value={field.value || ""}
                              onChange={(e) =>
                                validateEmailWithDebounce(e, index)
                              }
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
                                        handleCollaboratorRemoval(
                                          collaborator.cohortId,
                                          collaborator.collaboratorId,
                                          collaborator.roleId,
                                          index
                                        )
                                      }
                                      disabled={isDeleting}
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
                      <FormMessage className="pl-3">
                        {form.formState.errors?.collaborators?.[index]?.email
                          ?.message || emailErrors[index]}
                      </FormMessage>
                    </div>

                    <div className="grid">
                      <Label className="mb-2">Role</Label>
                      <Controller
                        control={form.control}
                        name={`collaborators.${index}.role`}
                        render={({ field }) => (
                          <Select
                            onValueChange={(value) =>
                              handleRoleSelection(value, index)
                            }
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              {ROLES.map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                  {role.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <FormMessage className="pl-3">
                        {
                          form.formState.errors?.collaborators?.[index]?.role
                            ?.message
                        }
                      </FormMessage>
                    </div>
                  </div>
                )}
                {editingCollaboratorIndex === index && (
                  <div className="mt-3">
                    <Button
                      type="button"
                      disabled={isSavingEdit}
                      onClick={() =>
                        handleSaveCollaboratorEdit(
                          index,
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

        <div className="flex gap-2">
          {hasUninvitedCollaborators && (
            <Button
              variant="outline"
              type="button"
              className="w-full bg-[#6808FE] hover:bg-[#6808FE]/80"
              onClick={() => handleInviteCollaborators(form.getValues())}
            >
              <Send className="mr-2 h-4 w-4" />
              {isInviting ? "Sending Invite..." : "Invite Collaborator"}
            </Button>
          )}
          <Button
            onClick={addNewCollaborator}
            variant="outline"
            type="button"
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Collaborator
          </Button>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          Update Cohort
        </Button>
      </form>
    </Form>
  );
}
