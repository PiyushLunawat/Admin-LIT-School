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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Trash2 } from "lucide-react";

interface CollaboratorsFormProps {
  onComplete: () => void;
  initialData?: any;
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

export function CollaboratorsForm({ onComplete }: CollaboratorsFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      collaborators: [{  email: "", role: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "collaborators",
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form data:", data);
    onComplete();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-h-[80vh] overflow-y-auto space-y-6 py-4">
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}</div>
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
                                disabled={fields.some(f => f.role === role.value && f.id !== collaborator.id)}
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

        <Button
          onClick={() => append({ email: "", role: "" })}
          variant="outline"
          className="w-full"
          disabled={fields.length >= roles.length}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Collaborator
        </Button>

        <Button type="submit" className="w-full">
          Create Cohort
        </Button>
      </form>
    </Form>
  );
}
