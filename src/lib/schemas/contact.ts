import { z } from "zod";
import { LanguageSchema } from "./language";

export const ContactStatusSchema = z.enum([
  "ACTUAL",
  "FUTURO",
  "HISTORICO",
]);

export const ContactSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  language: LanguageSchema,
  status: ContactStatusSchema,
  roomNumber: z.string().nullable().optional(),
  checkinUrl: z.string().nullable().optional(),
});

export const ContactsSchema = z.array(ContactSchema);

export type Contact = z.infer<typeof ContactSchema>;
export type ContactStatus = z.infer<typeof ContactStatusSchema>;