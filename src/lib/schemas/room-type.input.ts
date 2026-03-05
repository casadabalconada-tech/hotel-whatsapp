import { z } from "zod";

export const RoomTypeCreateSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  description: z.string().optional(),
  icon: z.string().optional(),
});

export const RoomTypeUpdateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Nombre requerido"),
  description: z.string().optional(),
  icon: z.string().optional(),
});

export const RoomTypeDeleteSchema = z.object({
  id: z.string().min(1),
});