import { z } from "zod";
import { LanguageSchema } from "./enums";

export const TranslateInputSchema = z.object({
  text: z.string().min(1),
  targetLanguage: LanguageSchema,
});