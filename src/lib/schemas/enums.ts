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

export const ContactStatusSchema = z.enum([
  "ACTUAL",
  "FUTURO",
  "HISTORICO",
]);
export type ContactStatus = z.infer<typeof ContactStatusSchema>;