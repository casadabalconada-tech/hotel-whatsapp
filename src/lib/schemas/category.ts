import { z } from "zod";

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const CategoriesSchema = z.array(CategorySchema);

export type Category = z.infer<typeof CategorySchema>;