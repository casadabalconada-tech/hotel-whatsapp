import React from "react";
import { Language } from "@/lib/schemas";

/* =======================
   FLAGS
======================= */

export const languageFlag = (lang: Language) => {
  switch (lang) {
    case "ES": return "🇪🇸";
    case "EN": return "🇬🇧";
    case "DE": return "🇩🇪";
    case "FR": return "🇫🇷";
    case "IT": return "🇮🇹";
    case "PT": return "🇵🇹";
    default: return "🏳️";
  }
};

/* =======================
   TRANSLATE
======================= */

export const translateText = async (
  text: string,
  targetLanguage: Language
): Promise<string> => {
  if (!text.trim()) return "";
  if (targetLanguage === "ES") return text;

  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, targetLanguage }),
  });

  const data = await res.json();
  return data?.text || text;
};

/* =======================
   WHATSAPP PREVIEW
======================= */

export const renderWhatsAppPreview = (text: string) => (
  <>
    {text.split("\n").map((line: string, i: number) => (
      <div key={i}>
        {line.split("*").map((part: string, j: number) =>
          j % 2 === 1 ? (
            <b key={j}>{part}</b>
          ) : (
            <span key={j}>{part}</span>
          )
        )}
      </div>
    ))}
  </>
);

/* =======================
   OPEN WHATSAPP
======================= */

export const openWhatsApp = (phone: string, text: string) => {
  if (!phone || !text) return;

  const clean = phone.replace(/\D/g, "");
  window.open(
    `https://wa.me/${clean}?text=${encodeURIComponent(text)}`,
    "_blank"
  );
};