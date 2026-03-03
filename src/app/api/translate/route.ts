import { NextResponse } from "next/server";
import * as deepl from "deepl-node";
import type { TargetLanguageCode } from "deepl-node";
import { z } from "zod";

/* =======================
   DEEPL
======================= */

const translator = new deepl.Translator(
  process.env.DEEPL_API_KEY!
);

/* =======================
   LANGUAGE MAP
======================= */

const MAP: Record<string, TargetLanguageCode> = {
  EN: "en-GB",
  DE: "de",
  FR: "fr",
  IT: "it",
  PT: "pt-PT",
  ES: "es",
};

/* =======================
   ZOD SCHEMA (🛡)
======================= */

const TranslateSchema = z.object({
  text: z.string().min(1),
  targetLanguage: z.enum(["ES", "EN", "DE", "FR", "IT", "PT"]),
});

/* =======================
   TRANSLATE
======================= */

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = TranslateSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { text, targetLanguage } = parsed.data;

    if (targetLanguage === "ES") {
      return NextResponse.json({ text });
    }

    const result = await translator.translateText(
      text,
      "es",
      MAP[targetLanguage]
    );

    return NextResponse.json({
      text: Array.isArray(result)
        ? result[0].text
        : result.text,
    });
  } catch (err) {
    console.error("DEEPL ERROR:", err);

    return NextResponse.json(
      { error: "Error al traducir texto" },
      { status: 500 }
    );
  }
}