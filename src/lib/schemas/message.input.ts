import { z } from "zod";

export const MessageCreateInputSchema = z.object({
  categoryId: z.string().min(1),
  content: z.string().min(1),
});

export const MessageUpdateInputSchema = z.object({
  id: z.string().min(1),
  categoryId: z.string().min(1),
  content: z.string().min(1),
});

export const MessageDeleteInputSchema = z.object({
  id: z.string().min(1),
});