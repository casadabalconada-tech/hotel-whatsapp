import { z } from "zod";
import { RoomTypeSchema } from "./room-type";

export const RoomTypeOutputSchema = RoomTypeSchema;
export const RoomTypesOutputSchema = z.array(RoomTypeSchema);