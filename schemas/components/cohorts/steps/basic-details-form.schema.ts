import { z } from "zod";

export const formSchema = z.object({
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
