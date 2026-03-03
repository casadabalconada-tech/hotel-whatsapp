import { z } from "zod";
import { LanguageSchema, ContactStatusSchema } from "./enums";

export const ContactSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  language: LanguageSchema,
  roomNumber: z.string().nullable().optional(),
  checkinUrl: z.string().nullable().optional(),
  status: ContactStatusSchema,
});

export const ContactsSchema = z.array(ContactSchema);
export type Contact = z.infer<typeof ContactSchema>;