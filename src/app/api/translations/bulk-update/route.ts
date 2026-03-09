import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const messages = await req.json();

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Formato inválido" },
        { status: 400 }
      );
    }

    await prisma.$transaction(
      messages.map((m) =>
        prisma.message.update({
          where: { id: m.id },
          data: {
            content: m.content,
          },
        })
      )
    );

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error actualizando traducciones" },
      { status: 500 }
    );
  }
}