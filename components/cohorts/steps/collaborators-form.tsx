"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Send, Trash2 } from "lucide-react";
import { updateCohort } from "@/app/api/cohorts";
import { useEffect } from "react";


interface CollaboratorsFormProps {
  onComplete: () => void;
  onCohortCreated: (cohort: any) => void;
  initialData?: any; 
}
interface collaborator{
  email:string,
  role:string
}

const roles = [
  { value: "reviewer", label: "Application Reviewer" },
  { value: "interviewer", label: "Interviewer" },
  { value: "collector", label: "Fee Collector" },
  { value: "evaluator", label: "LITMUS Test Evaluator" },
];

// Define Zod schema
const formSchema = z.object({
  collaborators: z.array(
    z.object({
      email: z.string().email("Invalid email address"),
      role: z.string().nonempty("Role is required"),
    })
  ),
});

export function CollaboratorsForm({ onComplete, onCohortCreated, initialData }: CollaboratorsFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      collaborators: initialData?.collaborators || [{ email: "", role: "" }],
    },
  });

  
  let collaborators:Array<collaborator> =[]
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "collaborators",
  });
  
  useEffect(() => {
    // Ensure at least one collaborator exists
    if (fields.length === 0) {
      append({ email: "", role: "" });
    }
  }, [fields, append]); // Use `fields` instead of `collaborators`
  

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (initialData?._id) {
        console.log("Collaborators data to send:", data.collaborators);

        // Ensure that collaborators data is an array and correctly structured
        if (Array.isArray(data.collaborators) && data.collaborators.length > 0) {
          const createdCohort = await updateCohort(initialData._id, {collaborators : data.collaborators} );
          console.log("Cohort updated successfully:", createdCohort.data);
          onCohortCreated(createdCohort.data); 
          onComplete(); // Proceed to the next step
        } else {
          console.error("Collaborators data is not formatted as an array:", data.collaborators);
        }
      } else {
        console.error("Cohort ID is missing. Unable to update.");
      }
    } catch (error) {
      console.error("Failed to update cohort:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-h-[80vh] space-y-6 py-4">
        <div className="space-y-4">
          {fields.map((collaborator, index) => (
            <Card key={collaborator.id}>
              <CardContent className="pt-6">
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
                            {...field}
                          />
                          {fields.length > 1 && (
                            <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent align="end" side="top" className="max-w-[345px] w-full">
                              <div className="text-base font-medium mb-2">
                                {`Are you sure you would like to delete ${form.getValues(`collaborators.${index}.email`)}?`}
                              </div>
                              <div className="flex gap-2 justify-end">
                                <Button variant="outline" >Cancel</Button>
                                <Button className="bg-[#FF503D]/20 hover:bg-[#FF503D]/30 text-[#FF503D]" onClick={() => remove(index)}>Delete</Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                          )}
                        </div>
                      )}
                    />
                    <FormMessage>{form.formState.errors?.collaborators?.[index]?.email?.message}</FormMessage>
                  </div>
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
                                disabled={role.value !== "evaluator" &&
                                  fields.some(f => f.role === role.value && f.id !== collaborator.id)}
                              >
                                {role.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FormMessage>{form.formState.errors?.collaborators?.[index]?.role?.message}</FormMessage>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-2">
        <Button
          variant="outline"
          type="button"
          className="w-full bg-[#6808FE] hover:bg-[#6808FE]/80"
        >
          <Send className="mr-2 h-4 w-4" />
          Invite Collaborator
        </Button>
        <Button
          onClick={() => append({ email: "", role: "" })}
          variant="outline"
          type="button"
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Collaborator
        </Button>
        </div>


        <Button type="submit" className="w-full">
          Update Cohort
        </Button>
      </form>
    </Form>
  );
}
