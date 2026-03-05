import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

/* =======================
   ZOD SCHEMAS (🛡)
======================= */

const RoomTypeCreateSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  description: z.string().optional(),
  icon: z.string().optional(),
});

const RoomTypeUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Nombre requerido"),
  description: z.string().optional(),
  icon: z.string().optional(),
});

const RoomTypeDeleteSchema = z.object({
  id: z.string().uuid(),
});

/* =======================
   LISTAR TIPOS DE HABITACIÓN
======================= */

export async function GET() {
  const roomTypes = await prisma.roomType.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(roomTypes);
}

/* =======================
   CREAR TIPO DE HABITACIÓN
======================= */

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = RoomTypeCreateSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { name, description, icon } = parsed.data;

  try {
    const roomType = await prisma.roomType.create({
      data: {
        name,
        description,
        icon,
      },
    });

    return NextResponse.json(roomType, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear el tipo de habitación" },
      { status: 400 }
    );
  }
}

/* =======================
   EDITAR TIPO DE HABITACIÓN
======================= */

export async function PUT(req: Request) {
  const json = await req.json();
  const parsed = RoomTypeUpdateSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { id, name, description, icon } = parsed.data;

  try {
    const roomType = await prisma.roomType.update({
      where: { id },
      data: {
        name,
        description,
        icon,
      },
    });

    return NextResponse.json(roomType);
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar el tipo de habitación" },
      { status: 400 }
    );
  }
}

/* =======================
   ELIMINAR TIPO DE HABITACIÓN
======================= */

export async function DELETE(req: Request) {
  const json = await req.json();
  const parsed = RoomTypeDeleteSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "ID inválido" },
      { status: 400 }
    );
  }

  const { id } = parsed.data;

  await prisma.roomType.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}