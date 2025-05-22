import { z } from "zod";

import { formSchema } from "@/schemas/auth/login.schema";

export type LoginFormValues = z.infer<typeof formSchema>;
