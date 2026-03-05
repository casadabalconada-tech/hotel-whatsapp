import { TaxiCompanySchema } from "./taxi-company";
import { z } from "zod";

export const TaxiCompanyListOutput = z.array(TaxiCompanySchema);