import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

/* =======================
   SCHEMA
======================= */
const CreateTaxiRequestInput = z.object({
  taxiCompanyId: z.string().uuid(),
  contactId: z.string().uuid(),

  date: z
    .string()
    .min(1, "La fecha es obligatoria")
    .refine((d) => !isNaN(Date.parse(d)), "Fecha inválida"),

  origin: z.string().min(1, "Origen obligatorio"),
  destination: z.string().min(1, "Destino obligatorio"),

  passengers: z.coerce.number().int().min(1),

  message: z.string().min(1, "Mensaje obligatorio"),
});

/* =======================
   GET → listar solicitudes
======================= */
export async function GET() {
  const requests = await prisma.taxiRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      taxiCompany: true,
      contact: true,
    },
  });

  return NextResponse.json(requests);
}

/* =======================
   POST → crear solicitud
======================= */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = CreateTaxiRequestInput.parse(body);

    const request = await prisma.taxiRequest.create({
      data: {
        taxiCompanyId: data.taxiCompanyId,
        contactId: data.contactId,
        date: new Date(data.date),
        origin: data.origin,
        destination: data.destination,
        passengers: data.passengers,
        message: data.message,
      },
    });

    return NextResponse.json(request, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          details: error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    console.error("Taxi request error:", error);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}