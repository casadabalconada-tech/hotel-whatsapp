import { z } from "zod";

export const LanguageSchema = z.enum([
  "ES",
  "EN",
  "DE",
  "FR",
  "IT",
  "PT",
]);

export type Language = z.infer<typeof LanguageSchema>;