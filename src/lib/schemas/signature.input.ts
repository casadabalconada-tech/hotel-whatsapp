import { z } from "zod";

export const SignatureInputSchema = z.object({
  content: z.string(),
});