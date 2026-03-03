import { z } from "zod";
import { LanguageSchema } from "./enums";

/**
 * Categoría embebida dentro de Message
 * (NO es el output de /categories)
 */
const MessageCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const MessageOutputSchema = z.object({
  id: z.string(),
  baseKey: z.string(),
  content: z.string(),
  language: LanguageSchema,
  category: MessageCategorySchema,
});

export const MessagesOutputSchema = z.array(MessageOutputSchema);

export type Message = z.infer<typeof MessageOutputSchema>;