import { z } from "zod";

export const formSchema = z.object({
  applicationFee: z.coerce.string().min(1, "Application fee is required"),
  tokenFee: z.coerce.string().min(1, "Admission fee is required"),
  semesters: z.coerce.string().min(1, "Number of semesters is required"),
  installmentsPerSemester: z.coerce
    .string()
    .min(1, "Installments per semester are required"),
  oneShotDiscount: z.coerce
    .string()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100"),
});
