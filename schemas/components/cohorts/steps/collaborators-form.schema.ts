import { z } from "zod";

export const formSchema = z.object({
  collaborators: z.array(
    z.object({
      email: z.string().email("Invalid email address"),
      role: z.string().nonempty("Role is required"),
      isInvited: z.boolean().optional(),
      isAccepted: z.boolean().optional(),
      cohortId: z.string().optional(),
      collaboratorId: z.string().optional(),
      roleId: z.string().optional(),
    })
  ),
});
