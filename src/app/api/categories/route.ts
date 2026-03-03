// src/app/api/categories/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

/* =======================
   ZOD SCHEMAS (🛡)
======================= */

const CategoryCreateSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
});

const CategoryUpdateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Nombre requerido"),
});

const CategoryDeleteSchema = z.object({
  id: z.string().min(1),
});

/* =======================
   LISTAR CATEGORÍAS
======================= */

export async function GET() {
  const categories = await prisma.messageCategory.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(categories);
}

/* =======================
   CREAR CATEGORÍA
======================= */

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = CategoryCreateSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { name } = parsed.data;

  try {
    const category = await prisma.messageCategory.create({
      data: { name },
    });

    return NextResponse.json(category);
  } catch {
    return NextResponse.json(
      { error: "La categoría ya existe" },
      { status: 400 }
    );
  }
}

/* =======================
   EDITAR CATEGORÍA
======================= */

export async function PUT(req: Request) {
  const json = await req.json();
  const parsed = CategoryUpdateSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { id, name } = parsed.data;

  try {
    const category = await prisma.messageCategory.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(category);
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar categoría" },
      { status: 400 }
    );
  }
}

/* =======================
   ELIMINAR CATEGORÍA
======================= */

export async function DELETE(req: Request) {
  const json = await req.json();
  const parsed = CategoryDeleteSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "ID inválido" },
      { status: 400 }
    );
  }

  const { id } = parsed.data;

  await prisma.messageCategory.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}