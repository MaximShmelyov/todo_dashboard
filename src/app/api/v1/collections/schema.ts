import { z } from "zod";

export const CreateCollectionBodySchema = z.object({
  title: z.string().min(1),
  type: z.enum(["TODO", "NOTE", "SHOPPING"]),
  familyId: z.union([z.string().min(1), z.null()]).optional(),
  isPublic: z.boolean().optional().default(false),
});

export type CreateCollectionBody = z.infer<typeof CreateCollectionBodySchema>;

export const UpdateCollectionBodySchema = z
  .object({
    title: z.string().min(1).optional(),
    type: z.enum(["TODO", "NOTE", "SHOPPING"]).optional(),
    familyId: z.union([z.string().min(1), z.null()]).optional(),
    isPublic: z.boolean().optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "No fields to update",
  });

export type UpdateCollectionBody = z.infer<typeof UpdateCollectionBodySchema>;

export const PaginationQuerySchema = z.object({
  page: z
    .preprocess((v) => (typeof v === "string" ? Number(v) : v), z.number().int().min(1))
    .default(1),
  pageSize: z
    .preprocess((v) => (typeof v === "string" ? Number(v) : v), z.number().int().min(1).max(100))
    .default(20),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;