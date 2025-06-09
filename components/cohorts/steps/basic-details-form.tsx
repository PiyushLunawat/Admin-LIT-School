"use client";

import { getCentres } from "@/app/api/centres";
import { createCohort, getCohorts, updateCohort } from "@/app/api/cohorts";
import { getPrograms } from "@/app/api/programs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
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
  setCurrentStep,
  updateBasicDetails,
} from "@/lib/features/cohort/cohortSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { cn } from "@/lib/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { addMonths, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  programDetail: z.string().min(1, "Program is required"),
  centerDetail: z.string().min(1, "Centre is required"),
  cohortId: z.string().optional(),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  timeSlot: z.string().min(1, "Time slot is required"),
  totalSeats: z.coerce.number().min(1, "Minimum 1 seat is required"),
  baseFee: z.coerce.number().min(1, "Minimum base fee is required"),
  isGSTIncluded: z.boolean().default(false),
});

interface Program {
  _id: string;
  name: string;
  description: string;
  duration: number;
  prefix: string;
  status: boolean;
}

interface Centre {
  _id: string;
  name: string;
  location: string;
  suffix: string;
  status: boolean;
}

interface Cohort {
  id: string;
  programDetail: string;
  centerDetail: string;
  startDate: string;
  endDate: string;
  seats: number;
  filled: number;
  status: "Draft" | "Open" | "Full" | "Closed" | "Archived";
  baseFee: string;
  isComplete: boolean;
}

interface BasicDetailsFormProps {
  onNext: () => void;
  onCohortCreated: (cohort: any) => void;
  initialData?: any;
}

export function BasicDetailsForm({
  onNext,
  onCohortCreated,
  initialData,
}: BasicDetailsFormProps) {
  const dispatch = useAppDispatch();
  const basicDetailsState = useAppSelector(
    (state) => state.cohort.basicDetails
  );

  console.log("All collaborators:", initialData);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      programDetail:
        basicDetailsState.programDetail || initialData?.programDetail || "",
      centerDetail:
        basicDetailsState.centerDetail || initialData?.centerDetail || "",
      cohortId: basicDetailsState.cohortId || initialData?.cohortId || "",
      startDate: basicDetailsState.startDate
        ? new Date(basicDetailsState.startDate)
        : initialData?.startDate
        ? new Date(initialData.startDate)
        : undefined,
      endDate: basicDetailsState.endDate
        ? new Date(basicDetailsState.endDate)
        : initialData?.endDate
        ? new Date(initialData.endDate)
        : undefined,
      timeSlot: basicDetailsState.timeSlot || initialData?.timeSlot || "",
      totalSeats: basicDetailsState.totalSeats || initialData?.totalSeats || "",
      baseFee: basicDetailsState.baseFee || initialData?.baseFee || "",
      isGSTIncluded:
        basicDetailsState.isGSTIncluded !== undefined
          ? basicDetailsState.isGSTIncluded
          : initialData?.isGSTIncluded !== undefined
          ? initialData?.isGSTIncluded
          : false,
    },
  });

  const [loading, setLoading] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [centres, setCentres] = useState<Centre[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);

  // Format a number into Indian currency format
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

  useEffect(() => {
    async function fetchData() {
      try {
        const programsData = await getPrograms();
        setPrograms(programsData.data);
        const centresData = await getCentres();
        setCentres(centresData.data);
        const cohortsData = await getCohorts();
        setCohorts(cohortsData.data);
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    }
    fetchData();
  }, []);

  const [selectedProgram, setSelectedProgram] = useState<string | null>(
    basicDetailsState.programDetail || initialData?.programDetail || null
  );
  const [programDuration, setProgramDuration] = useState(6);
  const [selectedCentre, setSelectedCentre] = useState<string | null>(
    basicDetailsState.centerDetail || initialData?.centerDetail || null
  );
  const [cohortId, setCohortId] = useState(
    basicDetailsState.cohortId || initialData?.cohortId || ""
  );

  useEffect(() => {
    form.setValue("programDetail", selectedProgram || "");
  }, [form, selectedProgram]);

  useEffect(() => {
    form.setValue("centerDetail", selectedCentre || "");
  }, [form, selectedCentre]);

  useEffect(() => {
    form.setValue("cohortId", cohortId || "");
  }, [cohortId, form, setCohortId]);

  const createCohortId = useCallback(() => {
    const programData = programs.find(
      (program) => program._id === selectedProgram
    );
    const centerData = centres.find((center) => center._id === selectedCentre);

    if (programData && centerData) {
      const cohortCount = (
        cohorts.filter((cohort) => cohort.programDetail === programData._id)
          .length + 1
      )
        .toString()
        .padStart(2, "0");
      const generatedCohortId = `${programData.prefix}${cohortCount}${centerData.suffix}`;
      setCohortId(generatedCohortId);
    }
  }, [programs, centres, cohorts, selectedProgram, selectedCentre]);

  useEffect(() => {
    if (selectedProgram && selectedCentre) {
      createCohortId();
    }
  }, [selectedProgram, selectedCentre, createCohortId]);

  useEffect(() => {
    if (selectedProgram) {
      const programData = programs.find(
        (program) => program._id === selectedProgram
      )?.duration;
      setProgramDuration(programData ?? 0);
    }
  }, [programs, selectedProgram]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Save form data to Redux
    dispatch(
      updateBasicDetails({
        ...values,
        startDate: values.startDate ? values.startDate.toISOString() : null,
        endDate: values.endDate ? values.endDate.toISOString() : null,
      })
    );

    const dataWithCohortId = {
      ...values,
      cohortId: cohortId,
      programDetail: selectedProgram,
      centerDetail: selectedCentre,
      status: initialData?.status || "Draft",
      isGSTIncluded: values.isGSTIncluded,
    };

    setLoading(true);
    try {
      if (initialData?._id) {
        const createdCohort = await updateCohort(
          initialData._id,
          dataWithCohortId
        );
        console.log("Cohort updated successfully");
        onCohortCreated(createdCohort.data);
      } else {
        const createdCohort = await createCohort(dataWithCohortId); // Call the API to create a cohort
        console.log("Cohort created:", createdCohort);
        onCohortCreated(createdCohort.data); // Pass the created cohort data to the parent
      }

      // Update current step in Redux
      dispatch(setCurrentStep(1));
      onNext();
    } catch (error) {
      console.error("Failed to create cohort:", error);
    } finally {
      setLoading(false);
    }
  }

  const watchStartDate = form.watch("startDate");

  // Update end date when start date changes
  const updateEndDate = (startDate: Date) => {
    const endDate = addMonths(startDate, programDuration); // 6 months duration
    form.setValue("endDate", endDate);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="programDetail"
            render={({ field }) => {
              const selectedProgram = programs.find(
                (p) => p._id === initialData?.programDetail
              );
              const activePrograms = programs.filter(
                (p) => p.status === true && p._id !== initialData?.programDetail
              );

              return (
                <FormItem>
                  <Label>Program</Label>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedProgram(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* Show current selected program at top if it exists */}
                      {selectedProgram && (
                        <SelectItem
                          key={selectedProgram._id}
                          value={selectedProgram._id}
                        >
                          {selectedProgram.name}
                        </SelectItem>
                      )}

                      {/* Show all active programs except the selected one */}
                      {activePrograms.map((program) => (
                        <SelectItem key={program._id} value={program._id}>
                          {program.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="centerDetail"
            render={({ field }) => {
              const selectedCentre = centres.find(
                (c) => c._id === initialData?.centerDetail
              );
              const activeCentres = centres.filter(
                (c) => c.status === true && c._id !== initialData?.centerDetail
              );

              return (
                <FormItem>
                  <Label>Centre</Label>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedCentre(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select center" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* Show current selected center if it exists */}
                      {selectedCentre && (
                        <SelectItem
                          key={selectedCentre._id}
                          value={selectedCentre._id}
                        >
                          {selectedCentre.name}
                        </SelectItem>
                      )}

                      {/* Show all active centres except the selected one */}
                      {activeCentres.map((center) => (
                        <SelectItem key={center._id} value={center._id}>
                          {center.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        <FormField
          control={form.control}
          name="cohortId"
          render={({ field }) => (
            <FormItem>
              <Label>Cohort ID</Label>
              <FormControl>
                <Input
                  placeholder="CM00JY"
                  {...field}
                  value={field.value || cohortId} // Fallback to `cohortId` if `field.value` is empty
                  onChange={(e) => {
                    field.onChange(e.target.value); // Update form state
                    setCohortId(e.target.value); // Update local state
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        if (date) {
                          updateEndDate(date);
                        }
                      }}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < (watchStartDate || new Date()) ||
                        date < new Date("1900-01-01")
                      }
                      fromDate={field.value || new Date()} // Default to selected date or today
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="timeSlot"
            render={({ field }) => (
              <FormItem>
                <Label>Time Slot</Label>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="totalSeats"
            render={({ field }) => (
              <FormItem>
                <Label>Total Seats</Label>
                <FormControl>
                  <Input type="number" placeholder="50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="baseFee"
            render={({ field }) => (
              <FormItem>
                <Label>Base Fee</Label>
                <FormControl>
                  <Input
                    type="text" // Change input type to text to handle formatted value
                    placeholder="9,95,000"
                    value={formatIndianCurrency(field.value)} // Format the value on render
                    onChange={(e) => {
                      const rawValue = removeFormatting(e.target.value).replace(
                        /\D/g,
                        ""
                      ); // Remove formatting for raw input
                      field.onChange(rawValue); // Update the field with unformatted value
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          Next: Application Form
        </Button>
      </form>
    </Form>
  );
}
