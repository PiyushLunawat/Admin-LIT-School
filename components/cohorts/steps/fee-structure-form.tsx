"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { updateCohort } from "@/app/api/cohorts";
import { Button } from "@/components/ui/button";
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
  setCurrentStep,
  updateFeeStructure,
} from "@/lib/features/cohort/cohortSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { formSchema } from "@/schemas/components/cohorts/steps/fee-structure-form.schema";
import { FeeStructureFormProps } from "@/types/components/cohorts/steps/fee-structure-form";

export function FeeStructureForm({
  onNext,
  onCohortCreated,
  initialData,
}: FeeStructureFormProps) {
  const dispatch = useAppDispatch();
  const feeStructureState = useAppSelector(
    (state) => state.cohort.feeStructure
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicationFee:
        feeStructureState.applicationFee ||
        initialData?.cohortFeesDetail?.applicationFee ||
        "",
      tokenFee:
        feeStructureState.tokenFee ||
        initialData?.cohortFeesDetail?.tokenFee ||
        "",
      semesters:
        feeStructureState.semesters ||
        initialData?.cohortFeesDetail?.semesters ||
        "",
      installmentsPerSemester:
        feeStructureState.installmentsPerSemester ||
        initialData?.cohortFeesDetail?.installmentsPerSemester ||
        "",
      oneShotDiscount:
        feeStructureState.oneShotDiscount ||
        initialData?.cohortFeesDetail?.oneShotDiscount ||
        "",
    },
  });
  const [loading, setLoading] = useState(false);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    // Save form data to Redux
    dispatch(updateFeeStructure(data));

    if (!initialData?._id) {
      console.error("Cohort ID is missing. Unable to update.");
      return;
    }
    setLoading(true);
    try {
      // Update cohort fee details
      const createdCohort = await updateCohort(initialData._id, {
        cohortFeesDetail: data,
      });
      console.log("Cohort fees updated successfully:", createdCohort.data);
      onCohortCreated(createdCohort.data);

      // Update current step in Redux
      dispatch(setCurrentStep(3));
      onNext(); // Proceed to the next step
    } catch (error) {
      console.error("Failed to update cohort fees:", error);
    } finally {
      setLoading(false);
    }
  }

  function formatIndianCurrency(value: string | number): string {
    if (!value) return "";
    const numStr = value.toString();
    const lastThreeDigits = numStr.slice(-3); // Last 3 digits
    const otherDigits = numStr.slice(0, -3); // Digits before last 3
    const formattedOtherDigits = otherDigits.replace(
      /\B(?=(\d{2})+(?!\d))/g,
      ","
    ); // Add commas in groups of 2
    return otherDigits
      ? `${formattedOtherDigits},${lastThreeDigits}`
      : lastThreeDigits; // Combine both parts
  }

  // Remove formatting to get raw value
  function removeFormatting(value: string): string {
    return value.replace(/,/g, ""); // Remove commas
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
                    type="text"
                    placeholder="₹500"
                    value={formatIndianCurrency(field.value)} // Format the value on render
                    onChange={(e) => {
                      const rawValue = removeFormatting(e.target.value); // Remove formatting for raw input
                      field.onChange(rawValue); // Update the field with unformatted value
                    }}
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
                    type="text"
                    placeholder="₹50,000"
                    value={formatIndianCurrency(field.value)} // Format the value on render
                    onChange={(e) => {
                      const rawValue = removeFormatting(e.target.value); // Remove formatting for raw input
                      field.onChange(rawValue); // Update the field with unformatted value
                    }}
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
                  <Input type="number" min="1" placeholder="3" {...field} />
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
                  <Input type="number" min="1" placeholder="3" {...field} />
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
                <Input type="number" min="1" placeholder="10%" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          Next: Fee Preview
        </Button>
      </form>
    </Form>
  );
}
