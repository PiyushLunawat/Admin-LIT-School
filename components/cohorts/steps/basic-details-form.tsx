"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, addMonths } from "date-fns";
import { cn } from "@/lib/utils/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { getPrograms } from "@/app/api/programs";
import { getCentres } from "@/app/api/centres";
import { getCohorts, updateCohort } from "@/app/api/cohorts";
import { createCohort } from "@/app/api/cohorts";
import { Label } from "@/components/ui/label";

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
  // schedule: z.string().min(1, "Schedule is required"),
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
  // schedule: string;
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

export function BasicDetailsForm({ onNext, onCohortCreated, initialData }: BasicDetailsFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      programDetail: initialData?.programDetail || "",
      centerDetail: initialData?.centerDetail || "",
      cohortId: initialData?.cohortId || "",
      startDate: initialData?.startDate ? new Date(initialData.startDate) : undefined,
      endDate: initialData?.endDate ? new Date(initialData.endDate) : undefined,
      // schedule: initialData?.schedule || "",
      timeSlot: initialData?.timeSlot || "",
      totalSeats: initialData?.totalSeats || "",
      baseFee: initialData?.baseFee || "",
      isGSTIncluded: initialData?.isGSTIncluded !== undefined ? initialData?.isGSTIncluded : false ,
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
  const formattedOtherDigits = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ","); // Add commas in groups of 2
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
        setPrograms(programsData.data.filter((program: any) => program.status === true));
        const centresData = await getCentres();
        setCentres(centresData.data.filter((centre: any) => centre.status === true));
        const cohortsData = await getCohorts();
        setCohorts(cohortsData.data);
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    }
    fetchData();
  }, []);

  const [selectedProgram, setSelectedProgram] = useState<string | null>(initialData?.programDetail ?? null);
  const [programDuration, setProgramDuration] = useState(6);
  const [selectedCentre, setSelectedCentre] = useState<string | null>(initialData?.centerDetail ?? null);
  const [cohortId, setCohortId] = useState(initialData?.cohortId ?? "");

  useEffect(() => {
    form.setValue("programDetail", selectedProgram || "");
  }, [selectedProgram]);

  useEffect(() => {
    form.setValue("centerDetail", selectedCentre || "");
  }, [selectedCentre]);

  useEffect(() => {
    form.setValue("cohortId", cohortId || "");
  }, [setCohortId]);

  const createCohortId = () => {
    const programData = programs.find(program => program._id === selectedProgram);
    const centerData = centres.find(center => center._id === selectedCentre);
  
    if (programData && centerData) {
      const cohortCount = (cohorts.filter(cohort => cohort.programDetail === programData._id).length + 1).toString().padStart(2, "0");
      const generatedCohortId = `${programData.prefix}${cohortCount}${centerData.suffix}`;
      setCohortId(generatedCohortId);
    }
  };

  useEffect(() => {
    if (selectedProgram && selectedCentre) {
      createCohortId();
    }
  }, [selectedProgram, selectedCentre]);

  useEffect(() => {
    if (selectedProgram) {
      const programData = (programs.find(program => program._id === selectedProgram))?.duration;
      setProgramDuration(programData ?? 0);
    }
  }, [selectedProgram]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const dataWithCohortId = { 
      ...values, 
      cohortId: cohortId, 
      programDetail: selectedProgram, 
      centerDetail: selectedCentre,
      status: "Draft",
      isGSTIncluded: values.isGSTIncluded
    };
    setLoading(true);
    try {
      if (initialData?._id) {
        const createdCohort = await updateCohort(initialData._id, dataWithCohortId);
        console.log("Cohort updated successfully");
        onCohortCreated(createdCohort.data);
        onNext();
      } else {
      const createdCohort = await createCohort(dataWithCohortId);  // Call the API to create a cohort
      console.log("Cohort created:", createdCohort);
      onCohortCreated(createdCohort.data); // Pass the created cohort data to the parent
      }
      onNext();
    } catch (error) {
      console.error("Failed to create cohort:", error);
    } finally {
      setLoading(false)
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
            render={({ field }) => (
              <FormItem>
                <Label>Program</Label>
                <Select onValueChange={(value) => {
                  field.onChange(value); // Updates the form state
                  setSelectedProgram(value);
                }}  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {programs.map((program) => (
                      <SelectItem key={program._id} value={program._id}>{program.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="centerDetail"
            render={({ field }) => (
              <FormItem>
                <Label>Centre</Label>
                <Select onValueChange={(value) => {
    field.onChange(value); // Updates the form state
    setSelectedCentre(value); // Updates the local state
  }}  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select center" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {centres.map((center) => (
                      <SelectItem key={center._id} value={center._id}>{center.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
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
            setCohortId(e.target.value);   // Update local state
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
          {/* <FormField
            control={form.control}
            name="schedule"
            render={({ field }) => (
              <FormItem>
                <Label>Schedule</Label>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select schedule" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="M-W-F">M-W-F</SelectItem>
                    <SelectItem value="T-T-S">T-T-S</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <FormField
            control={form.control}
            name="timeSlot"
            render={({ field }) => (
              <FormItem>
                <Label>Time Slot</Label>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        </div>

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
            name="isGSTIncluded"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2">
                <FormControl>
                  <Checkbox
                    disabled
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <Label className="text-sm font-normal !my-2">
                  Include GST in base fee
                </Label>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>Next: Application Form</Button>
      </form>
    </Form>
  );
}