import { z } from "zod";

export const reviewSchema = z.object({
  merged_to_main: z.union([z.literal(0), z.literal(1), z.null()]),
  assertiveness_score: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.null(),
  ]),
  review_note: z.string().nullable(),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
