import { z } from "zod";

export const CategoryOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const CategoriesOutputSchema = z.array(CategoryOutputSchema);

export type Category = z.infer<typeof CategoryOutputSchema>;