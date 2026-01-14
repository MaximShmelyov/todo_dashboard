import { z } from "zod";

export const RegisterBodySchema = z.object({
  provider: z.literal("google"),
  callbackUrl: z.string().url().optional(),
  // If true, endpoint will respond with 302 redirect to OAuth start URL
  redirect: z.boolean().optional().default(false),
});

export type RegisterBody = z.infer<typeof RegisterBodySchema>;
