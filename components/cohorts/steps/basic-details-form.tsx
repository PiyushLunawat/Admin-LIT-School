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
  FormLabel,
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
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { getPrograms } from "@/app/api/programs";
import { getCentres } from "@/app/api/centres";
import { getCohorts } from "@/app/api/cohorts";
import { createCohort } from "@/app/api/cohorts";

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
  schedule: z.string().min(1, "Schedule is required"),
  timeSlot: z.string().min(1, "Time slot is required"),
  totalSeats: z.string().min(1, "Number of seats is required"),
  baseFee: z.string().min(1, "Base fee is required"),
  includeGst: z.boolean().default(false),
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
  schedule: string;
  seats: number;
  filled: number;
  status: "Draft" | "Open" | "Full" | "Closed" | "Archived";
  baseFee: string;
  isComplete: boolean;
}

interface BasicDetailsFormProps {
  onNext: () => void;
  initialData?: any;
}

export function BasicDetailsForm({ onNext, initialData }: BasicDetailsFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      programDetail: initialData?.programDetail || "",
      centerDetail: initialData?.centerDetail || "",
      cohortId: initialData?.cohortId || "",
      startDate: initialData?.startDate ? new Date(initialData.startDate) : undefined,
      endDate: initialData?.endDate ? new Date(initialData.endDate) : undefined,
      schedule: initialData?.schedule || "",
      timeSlot: initialData?.timeSlot || "",
      totalSeats: initialData?.totalSeats || "",
      baseFee: initialData?.baseFee || "",
      includeGst: initialData?.includeGst || false,
    },
  });

  const [programs, setPrograms] = useState<Program[]>([]);  
  const [centres, setCentres] = useState<Centre[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);

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

  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [selectedCentre, setSelectedCentre] = useState<string | null>(null);
  const [cohortId, setCohortId] = useState("");

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

  async function onSubmit(values: z.infer<typeof formSchema>) {

    const dataWithCohortId = { 
      ...values, 
      cohortId, 
      programDetail: selectedProgram, 
      centerDetail: selectedCentre,
      status: "Draft"
    };
    try {
      await createCohort(dataWithCohortId);  // Call the API to create a cohort
      console.log("Cohort created:", dataWithCohortId);
      onNext();  // Proceed to the next step
    } catch (error) {
      console.error("Failed to create cohort:", error);
    }
    console.log("Form data:", dataWithCohortId);    // Log the form data
  onNext();
  }

  const watchStartDate = form.watch("startDate");

  // Update end date when start date changes
  const updateEndDate = (startDate: Date) => {
    const endDate = addMonths(startDate, 6); // 6 months duration
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
                <FormLabel>Program</FormLabel>
                <Select onValueChange={(value) => {
    field.onChange(value); // Updates the form state
    setSelectedProgram(value); // Updates the local state
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
                <FormLabel>Centre</FormLabel>
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
              <FormLabel>Cohort ID</FormLabel>
              <FormControl>
              <Input value={cohortId}  />
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
                <FormLabel>Start Date</FormLabel>
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
                <FormLabel>End Date</FormLabel>
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
            name="schedule"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Schedule</FormLabel>
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
          />

          <FormField
            control={form.control}
            name="timeSlot"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time Slot</FormLabel>
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
              <FormLabel>Total Seats</FormLabel>
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
                <FormLabel>Base Fee</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="995000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="includeGst"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal !my-2">
                  Include GST in base fee
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">Next: Application Form</Button>
      </form>
    </Form>
  );
}