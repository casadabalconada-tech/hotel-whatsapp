// src/app/api/messages/route.ts

import { NextResponse } from "next/server";
import { Language } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import * as deepl from "deepl-node";
import { z } from "zod";

const translator = new deepl.Translator(process.env.DEEPL_API_KEY!);

// =======================
// ZOD SCHEMAS
// =======================

const LanguageSchema = z.nativeEnum(Language);

const MessageCreateSchema = z.object({
  categoryId: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
});

const MessageUpdateSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  categoryId: z.string().min(1),
});

const MessageDeleteSchema = z.object({
  id: z.string().min(1),
});

const MessageQuerySchema = z.object({
  categoryId: z.string().optional(),
  language: LanguageSchema.optional(),
});

// =======================
// LISTAR MENSAJES
// =======================
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const parsed = MessageQuerySchema.safeParse({
    categoryId: searchParams.get("categoryId") ?? undefined,
    language: searchParams.get("language") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Parámetros inválidos", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { categoryId, language } = parsed.data;

  const messages = await prisma.message.findMany({
    where: {
      ...(categoryId ? { categoryId } : {}),
      ...(language ? { language } : {}),
    },
    include: {
      category: true, // 🔒 siempre incluida
    },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json(messages);
}

// =======================
// CREAR MENSAJE (ES + TRADUCCIONES)
// =======================
export async function POST(req: Request) {
  const json = await req.json();
  const parsed = MessageCreateSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { categoryId, title, content } = parsed.data;

  const baseKey = crypto.randomUUID();

  const last = await prisma.message.findFirst({
    where: { categoryId, language: "ES" },
    orderBy: { order: "desc" },
  });

  const nextOrder = last ? last.order + 1 : 0;

  await prisma.message.create({
    data: {
      baseKey,
      title,
      content,
      language: "ES",
      categoryId,
      order: nextOrder,
    },
  });

  await generateTranslations(baseKey, title, content, categoryId, nextOrder);

  return NextResponse.json({ ok: true });
}

// =======================
// EDITAR MENSAJE
// =======================
export async function PUT(req: Request) {
  const json = await req.json();
  const parsed = MessageUpdateSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { id, title, content, categoryId } = parsed.data;

  const message = await prisma.message.findUnique({
    where: { id },
  });

  if (!message) {
    return NextResponse.json(
      { error: "Mensaje no encontrado" },
      { status: 404 }
    );
  }

  await prisma.message.update({
    where: { id },
    data: {
       title,
      content,
      categoryId,
    },
  });

  // 🔥 eliminamos traducciones antiguas
  await prisma.message.deleteMany({
    where: {
      baseKey: message.baseKey,
      language: { not: "ES" },
    },
  });

  await generateTranslations(
    message.baseKey,
    title,
    content,
    categoryId,
    message.order
  );

  return NextResponse.json({ ok: true });
}

// =======================
// ELIMINAR MENSAJE
// =======================
export async function DELETE(req: Request) {
  const json = await req.json();
  const parsed = MessageDeleteSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "ID inválido", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { id } = parsed.data;

  const message = await prisma.message.findUnique({
    where: { id },
  });

  if (!message) {
    return NextResponse.json(
      { error: "Mensaje no encontrado" },
      { status: 404 }
    );
  }

  await prisma.message.deleteMany({
    where: { baseKey: message.baseKey },
  });

  return NextResponse.json({ ok: true });
}

// =======================
// UTIL: GENERAR TRADUCCIONES
// =======================
async function generateTranslations(
  baseKey: string,
  title: string,
  content: string,
  categoryId: string,
  order: number
) {
  const translations = [
    { lang: "EN", deepl: "en-GB" },
    { lang: "DE", deepl: "de" },
    { lang: "FR", deepl: "fr" },
    { lang: "IT", deepl: "it" },
    { lang: "PT", deepl: "pt-PT" },
  ] as const;

  for (const t of translations) {
    const result = await translator.translateText(
      content,
      "es",
      t.deepl
    );

    const text = Array.isArray(result)
      ? result[0].text
      : result.text;

    await prisma.message.create({
      data: {
        baseKey,
        title,
        content: text,
        language: t.lang,
        categoryId,
        order,
      },
    });
  }
}