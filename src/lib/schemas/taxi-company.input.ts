import { z } from "zod";

export const CreateTaxiCompanyInput = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  phone: z.string().min(5, "El teléfono es obligatorio"),
});

export type CreateTaxiCompanyInput = z.infer<
  typeof CreateTaxiCompanyInput
>;