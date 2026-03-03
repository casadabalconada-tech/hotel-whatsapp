import { z } from "zod";
import { ContactStatus, Language } from "@prisma/client";

const EmptyStringToNullUrl = z
  .union([z.string().url(), z.literal(""), z.null()])
  .transform((v) => (v === "" ? null : v));

export const ContactCreateInput = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  roomNumber: z.string().nullable().optional(),
  language: z.nativeEnum(Language),
  checkinUrl: EmptyStringToNullUrl.optional(),
  status: z.nativeEnum(ContactStatus),
});

export const ContactUpdateInput = z.object({
  id: z.string().min(1),
  name: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  roomNumber: z.string().nullable().optional(),
  language: z.nativeEnum(Language).optional(),
  checkinUrl: EmptyStringToNullUrl.optional(),
  status: z.nativeEnum(ContactStatus).optional(),
});