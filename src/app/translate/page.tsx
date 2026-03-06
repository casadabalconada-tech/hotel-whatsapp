"use client";

import { useEffect, useState } from "react";
import { useHeader } from "@/components/HeaderContext";
import ContactSelector from "@/components/ContactSelector";
import WhatsAppPreview from "@/components/WhatsAppPreview";

/* =======================
   TYPES
======================= */

type Language = "ES" | "EN" | "DE" | "FR" | "IT" | "PT";

type Contact = {
  id: string;
  name: string;
  phone: string;
  language: Language;
  roomNumber?: string | null;
  checkinUrl?: string | null;
  status: "ACTUAL" | "FUTURO" | "HISTORICO";
};

/* =======================
   PAGE
======================= */

export default function TranslatePage() {
  const { setHeader } = useHeader();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContactId, setSelectedContactId] = useState("");

  const [spanishText, setSpanishText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);

  const [includeSignature, setIncludeSignature] = useState(false);
  const [signature, setSignature] = useState("");

  const [sendGreeting, setSendGreeting] = useState(false);
  const [sendRoom, setSendRoom] = useState(false);
  const [sendCheckin, setSendCheckin] = useState(false);

  /* =======================
     HEADER
  ======================= */

  useEffect(() => {
    setHeader({
      title: "Traducir mensaje",
      subtitle: "Traducción rápida al idioma del huésped",
      backHref: "/",
    });

    return () => setHeader({});
  }, [setHeader]);

  /* =======================
     LOAD
  ======================= */

  useEffect(() => {
    fetch("/api/contacts")
      .then(r => r.json())
      .then(setContacts);

    fetch("/api/signature")
      .then(r => r.json())
      .then(d => d?.content && setSignature(d.content));
  }, []);

  /* =======================
     STATE DERIVED
  ======================= */

  const selectedContact = contacts.find(
    c => c.id === selectedContactId
  );

  const canTranslate =
    !!selectedContact &&
    (spanishText.trim() ||
      sendGreeting ||
      sendRoom ||
      sendCheckin);

  /* =======================
     EFFECTS
  ======================= */

  useEffect(() => {
    setTranslatedText("");
  }, [selectedContactId]);

  /* =======================
     TRANSLATE
  ======================= */

  const translateText = async (text: string, lang: Language) => {
    if (lang === "ES") return text;

    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLanguage: lang }),
    });

    const data = await res.json();
    return data.text || text;
  };

  const translate = async () => {
    if (!selectedContact || loading) return;

    setLoading(true);
    const blocks: string[] = [];

    if (sendGreeting) {
      const hola = await translateText("Hola", selectedContact.language);
      blocks.push(`${hola} *${selectedContact.name}*`);
    }

    if (sendRoom && selectedContact.roomNumber) {
      blocks.push(
        await translateText(
          `Su habitación es la ${selectedContact.roomNumber}`,
          selectedContact.language
        )
      );
    }

    if (sendCheckin && selectedContact.checkinUrl) {
      const txt = await translateText(
        "Puede realizar el Check-in online en el siguiente enlace",
        selectedContact.language
      );

      blocks.push(`${txt}\n${selectedContact.checkinUrl}`);
    }

    if (spanishText.trim()) {
      blocks.push(
        await translateText(spanishText, selectedContact.language)
      );
    }

    let text = blocks.join("\n\n");

    if (includeSignature && signature) {
      text += `\n\n—\n${signature}`;
    }

    setTranslatedText(text);
    setLoading(false);
  };

  /* =======================
     WHATSAPP
  ======================= */

  const openWhatsApp = () => {
    if (!selectedContact || !translatedText) return;

    const phone = selectedContact.phone.replace(/\D/g, "");

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(translatedText)}`,
      "_blank"
    );
  };

  /* =======================
     UI
  ======================= */

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-32">

      {/* CONTACTO */}
      <ContactSelector
        contacts={contacts}
        value={selectedContactId}
        onChange={setSelectedContactId}
      />

      {/* OPCIONES */}
      <section className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
        <p className="text-sm font-medium">Opciones automáticas</p>

        <label className="flex gap-3 text-sm">
          <input
            type="checkbox"
            checked={sendGreeting}
            onChange={e => setSendGreeting(e.target.checked)}
          />
          Saludo personalizado
        </label>

        <label className="flex gap-3 text-sm">
          <input
            type="checkbox"
            checked={sendRoom}
            onChange={e => setSendRoom(e.target.checked)}
          />
          Número de habitación
        </label>

        <label className="flex gap-3 text-sm">
          <input
            type="checkbox"
            checked={sendCheckin}
            onChange={e => setSendCheckin(e.target.checked)}
          />
          Check-in online
        </label>

        {signature && (
          <label className="flex gap-3 text-sm">
            <input
              type="checkbox"
              checked={includeSignature}
              onChange={e => setIncludeSignature(e.target.checked)}
            />
            Añadir firma
          </label>
        )}
      </section>

      {/* MENSAJE */}
      <section className="bg-white rounded-2xl shadow-sm p-4 space-y-2">
        <label className="text-sm font-medium">Mensaje en español</label>

        <textarea
          className="w-full h-28 rounded-xl border px-3 py-3 text-base"
          placeholder="Escribe el mensaje…"
          value={spanishText}
          onChange={e => setSpanishText(e.target.value)}
        />
      </section>

      <button
        type="button"
        onClick={translate}
        disabled={!canTranslate || loading}
        className="w-full py-4 rounded-2xl bg-blue-600 text-white text-lg font-semibold disabled:bg-gray-400 active:scale-95 transition"
      >
        {loading ? "Traduciendo…" : "Traducir"}
      </button>

      {/* PREVIEW */}
{translatedText && (
  <section className="space-y-2">
    <p className="text-sm text-gray-500">Vista previa</p>

    <WhatsAppPreview text={translatedText} />
  </section>
)}

      <button
        type="button"
        onClick={openWhatsApp}
        disabled={!translatedText}
        className="w-full py-4 rounded-2xl bg-[#25D366] text-white text-lg font-semibold disabled:bg-gray-400 active:scale-95 transition"
      >
        📱 Enviar por WhatsApp
      </button>

    </div>
  );
}