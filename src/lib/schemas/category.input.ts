import { z } from "zod";

export const CategoryCreateInputSchema = z.object({
  name: z.string().min(1),
});

export const CategoryUpdateInputSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export const CategoryDeleteInputSchema = z.object({
  id: z.string().min(1),
});