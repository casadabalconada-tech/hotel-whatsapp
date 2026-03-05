import { z } from "zod";

export const RoomTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
});

export const RoomTypesSchema = z.array(RoomTypeSchema);

export type RoomType = z.infer<typeof RoomTypeSchema>;