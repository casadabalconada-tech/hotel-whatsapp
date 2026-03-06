import { z } from "zod";
import { LanguageSchema } from "./language";
import { CategorySchema } from "./category";

export const MessageSchema = z.object({
  id: z.string(),
  title: z.string(), 
  baseKey: z.string(),
  content: z.string(),
  language: LanguageSchema,
  category: CategorySchema, // 🔒 obligatoria
});

export const MessagesSchema = z.array(MessageSchema);

export type Message = z.infer<typeof MessageSchema>;