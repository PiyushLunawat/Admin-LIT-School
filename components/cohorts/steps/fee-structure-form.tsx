"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { updateCohort } from "@/app/api/cohorts";
import { Label } from "@/components/ui/label";

interface FeeStructureFormProps {
  onNext: () => void;
  onCohortCreated: (cohort: any) => void;
  initialData?: any;
}

// Define the Zod schema
const formSchema = z.object({
  applicationFee: z.coerce.string().min(1, "Application fee is required"),
  tokenFee: z.coerce.string().min(1, "Admission fee is required"),
  semesters: z.coerce.string().min(1, "Number of semesters is required"),
  installmentsPerSemester: z.coerce.string().min(1, "Installments per semester are required"),
  oneShotDiscount: z.coerce.string().min(0, "Discount cannot be negative").max(100, "Discount cannot exceed 100"),
});

export function FeeStructureForm({ onNext, onCohortCreated, initialData }: FeeStructureFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicationFee: initialData?.cohortFeesDetail?.applicationFee || "" ,
      tokenFee: initialData?.cohortFeesDetail?.tokenFee || "",
      semesters: initialData?.cohortFeesDetail?.semesters || "",
      installmentsPerSemester: initialData?.cohortFeesDetail?.installmentsPerSemester || "",
      oneShotDiscount: initialData?.cohortFeesDetail?.oneShotDiscount || "",
    }
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!initialData?._id) {
      console.error("Cohort ID is missing. Unable to update.");
      return;
    }

    try {
      // Update cohort fee details
      const createdCohort = await updateCohort(initialData._id, { cohortFeesDetail: data });
      console.log("Cohort fees updated successfully:", createdCohort.data);
      onCohortCreated(createdCohort.data); 
      onNext(); // Proceed to the next step
    } catch (error) {
      console.error("Failed to update cohort fees:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="applicationFee"
            render={({ field }) => (
              <FormItem>
                <Label>Application Fee (₹)</Label>
                <FormControl>
                  <Input
                    type="number" min="1"
                    placeholder="₹500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tokenFee"
            render={({ field }) => (
              <FormItem>
                <Label>Admission Fee (₹)</Label>
                <FormControl>
                  <Input
                    type="number" min="1"
                    placeholder="₹50,000"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="semesters"
            render={({ field }) => (
              <FormItem>
                <Label>Number of Semesters</Label>
                <FormControl>
                  <Input
                    type="number" min="1"
                    placeholder="3"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="installmentsPerSemester"
            render={({ field }) => (
              <FormItem>
                <Label>Installments per Semester</Label>
                <FormControl>
                  <Input
                    type="number" min="1"
                    placeholder="3"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="oneShotDiscount"
          render={({ field }) => (
            <FormItem>
              <Label>One-Shot Payment Discount (%)</Label>
              <FormControl>
                <Input
                  type="number" min="1"
                  placeholder="10%"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Next: Fee Preview
        </Button>
      </form>
    </Form>
  );
}
