import { NextResponse } from "next/server";
import { ContactStatus, Language } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// =======================
// ZOD HELPERS
// =======================

const UrlOrNull = z
  .string()
  .trim()
  .optional()
  .transform((v) => {
    if (!v) return null;

    // añade https:// si no existe
    const withProtocol = v.startsWith("http://") || v.startsWith("https://")
      ? v
      : `https://${v}`;

    try {
      new URL(withProtocol);
      return withProtocol;
    } catch {
      return null;
    }
  });

// =======================
// ZOD SCHEMAS
// =======================

const ContactCreateSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  roomNumber: z.string().nullable().optional(),
  language: z.nativeEnum(Language),
  checkinUrl: UrlOrNull,
  status: z.nativeEnum(ContactStatus),
});

const ContactUpdateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  roomNumber: z.string().nullable().optional(),
  language: z.nativeEnum(Language).optional(),
  checkinUrl: UrlOrNull,
  status: z.nativeEnum(ContactStatus).optional(),
});

const ContactDeleteSchema = z.object({
  id: z.string().min(1),
});

// =======================
// LISTAR CONTACTOS
// =======================

export async function GET() {
  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(contacts);
}

// =======================
// CREAR CONTACTO
// =======================

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = ContactCreateSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const contact = await prisma.contact.create({
      data: parsed.data,
    });

    return NextResponse.json(contact);
  } catch {
    return NextResponse.json(
      { error: "El teléfono ya existe" },
      { status: 400 }
    );
  }
}

// =======================
// MODIFICAR CONTACTO
// =======================

export async function PUT(req: Request) {
  const json = await req.json();
  const parsed = ContactUpdateSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { id, ...data } = parsed.data;

  try {
    const contact = await prisma.contact.update({
      where: { id },
      data,
    });

    return NextResponse.json(contact);
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar contacto" },
      { status: 400 }
    );
  }
}

// =======================
// ELIMINAR CONTACTO
// =======================

export async function DELETE(req: Request) {
  const json = await req.json();
  const parsed = ContactDeleteSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "ID inválido", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  await prisma.contact.delete({
    where: { id: parsed.data.id },
  });

  return NextResponse.json({ ok: true });
}