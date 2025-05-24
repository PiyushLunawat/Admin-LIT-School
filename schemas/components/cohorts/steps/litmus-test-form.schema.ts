import { z } from "zod";

export const formSchema = z.object({
  litmusTasks: z.array(
    z.object({
      id: z.string(),
      title: z.string().nonempty("Task title is required"),
      description: z.string().optional(),
      submissionTypes: z.array(
        z.object({
          id: z.string(),
          type: z.string().nonempty("Submission type is required"),
          characterLimit: z.coerce.number().min(1).default(1000),
          maxFiles: z.coerce.string().min(1).default("1"),
          maxFileSize: z.coerce.string().min(1).default("500"),
          allowedTypes: z.array(z.string()).default(["All"]),
        })
      ),
      judgmentCriteria: z.array(
        z.object({
          id: z.string(),
          name: z.string().nonempty("Criteria name is required"),
          points: z.coerce.string().min(1, "Points must be at least 1"),
          description: z.string().optional(),
        })
      ),
      resources: z.object({
        resourceFiles: z.array(z.string().optional()),
        resourceLinks: z.array(
          z.string().url("Please enter a valid Link URL").optional()
        ),
      }),
    })
  ),
  scholarshipSlabs: z.array(
    z.object({
      id: z.string(),
      name: z.string().nonempty("Slab name is required"),
      percentage: z.coerce.string().nonempty("Percentage is required"),
      clearance: z.coerce.string().nonempty("Clearance is required"),
      description: z.string().optional(),
      cohortId: z.string().optional(),
    })
  ),
  litmusTestDuration: z.string().nonempty("Duration is required"),
});

export type FormData = z.infer<typeof formSchema>;
