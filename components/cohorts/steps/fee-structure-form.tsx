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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { updateCohort } from "@/app/api/cohorts";

interface FeeStructureFormProps {
  onNext: () => void;
  initialData?: {
    _id: string;
    cohortFeesDetail?: {
      applicationFee?: number;
      tokenFee?: number;
      semesters?: number;
      installmentsPerSemester?: number;
      oneShotDiscount?: number;
    };
  };
}

// Define the Zod schema
const formSchema = z.object({
  applicationFee: z.number().min(1, "Application fee is required"),
  tokenFee: z.number().min(1, "Token fee is required"),
  semesters: z.number().min(1, "Number of semesters is required"),
  installmentsPerSemester: z.number().min(1, "Installments per semester are required"),
  oneShotDiscount: z.number().min(0, "Discount cannot be negative").max(100, "Discount cannot exceed 100"),
});

export function FeeStructureForm({ onNext, initialData }: FeeStructureFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicationFee: initialData?.cohortFeesDetail?.applicationFee ,
      tokenFee: initialData?.cohortFeesDetail?.tokenFee ,
      semesters: initialData?.cohortFeesDetail?.semesters ,
      installmentsPerSemester: initialData?.cohortFeesDetail?.installmentsPerSemester ,
      oneShotDiscount: initialData?.cohortFeesDetail?.oneShotDiscount ,
    }
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!initialData?._id) {
      console.error("Cohort ID is missing. Unable to update.");
      return;
    }

    try {
      // Update cohort fee details
      await updateCohort(initialData._id, { cohortFeesDetail: data });
      console.log("Cohort fees updated successfully:", data);
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
                <FormLabel>Application Fee</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="500"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
                <FormLabel>Token Fee</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="50000"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
                <FormLabel>Number of Semesters</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="3"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
                <FormLabel>Installments per Semester</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="3"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
              <FormLabel>One-Shot Payment Discount (%)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="10"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
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
