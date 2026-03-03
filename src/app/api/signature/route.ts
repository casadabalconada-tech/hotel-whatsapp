import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

/* =======================
   ZOD SCHEMA (🛡)
======================= */

const SignatureSchema = z.object({
  content: z.string(),
});

/* =======================
   GET → obtener firma
======================= */

export async function GET() {
  const signature = await prisma.signature.findFirst();

  return NextResponse.json(
    signature ?? { content: "" }
  );
}

/* =======================
   PUT → guardar firma (singleton)
======================= */

export async function PUT(req: Request) {
  try {
    const json = await req.json();
    const parsed = SignatureSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Contenido inválido", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { content } = parsed.data;

    const signature = await prisma.signature.upsert({
      where: {
        id: "GLOBAL_SIGNATURE",
      },
      update: {
        content,
      },
      create: {
        id: "GLOBAL_SIGNATURE",
        content,
      },
    });

    return NextResponse.json(signature);
  } catch (err) {
    console.error("SIGNATURE ERROR:", err);

    return NextResponse.json(
      { error: "Error al guardar firma" },
      { status: 500 }
    );
  }
}