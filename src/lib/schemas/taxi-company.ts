import { z } from "zod";

export const TaxiCompanySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  phone: z.string(),
  createdAt: z.date(),
});

export type TaxiCompany = z.infer<typeof TaxiCompanySchema>;