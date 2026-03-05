"use client";

import { useEffect, useState } from "react";
import { useHeader } from "@/components/HeaderContext";

import {
  ContactsSchema,
  CategoriesOutputSchema,
  MessagesOutputSchema,
  Contact,
  Category,
  Message,
  Language,
} from "@/lib/schemas";

/* =======================
   HELPERS
======================= */

const languageFlag = (lang: Language) => {
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
   Preview WhatsApp
======================= */

const renderWhatsAppPreview = (text: string) =>
  text.split("\n").map((line, i) => (
    <div key={i}>
      {line.split("*").map((part, j) =>
        j % 2 === 1 ? <b key={j}>{part}</b> : <span key={j}>{part}</span>
      )}
    </div>
  ));

/* =======================
   PAGE
======================= */

export default function SendPage() {
  const { setHeader } = useHeader();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const [selectedContact, setSelectedContact] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBaseKeys, setSelectedBaseKeys] = useState<string[]>([]);
  const [finalText, setFinalText] = useState("");

  const [signature, setSignature] = useState("");
  const [addSignature, setAddSignature] = useState(false);

  const [sendGreeting, setSendGreeting] = useState(false);
  const [sendRoom, setSendRoom] = useState(false);
  const [sendCheckin, setSendCheckin] = useState(false);

  /* =======================
     HEADER
  ======================= */

  useEffect(() => {
    setHeader({
      title: "Enviar WhatsApp",
      subtitle: "Mensaje real al huésped",
      backHref: "/",
    });

    return () => setHeader({});
  }, [setHeader]);

  /* =======================
     CARGA INICIAL
  ======================= */

  useEffect(() => {
    fetch("/api/contacts")
      .then(r => r.json())
      .then(d => {
        const parsed = ContactsSchema.safeParse(d);
        setContacts(parsed.success ? parsed.data : []);
      });

    fetch("/api/categories")
      .then(r => r.json())
      .then(d => {
        const parsed = CategoriesOutputSchema.safeParse(d);
        setCategories(parsed.success ? parsed.data : []);
      });

    fetch("/api/messages")
      .then(r => r.json())
      .then(d => {
        const parsed = MessagesOutputSchema.safeParse(d);
        setMessages(parsed.success ? parsed.data : []);
      });

    fetch("/api/signature")
      .then(r => r.json())
      .then(d => d?.content && setSignature(d.content));
  }, []);

  /* =======================
     RESET CONTACTO
  ======================= */

  useEffect(() => {
    setFinalText("");
    setSelectedBaseKeys([]);
  }, [selectedContact]);

  /* =======================
     FILTRO MENSAJES
  ======================= */

  const spanishMessages = messages.filter(
    m => m.language === "ES" && m.category.id === selectedCategory
  );

  /* =======================
     TRANSLATE
  ======================= */

  const translate = async (text: string, lang: Language) => {
    if (lang === "ES") return text;

    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLanguage: lang }),
    });

    const data = await res.json();
    return data.text || text;
  };

  /* =======================
     CONSTRUIR MENSAJE
  ======================= */

  useEffect(() => {
    const build = async () => {
      if (!selectedContact) return setFinalText("");

      const contact = contacts.find(c => c.id === selectedContact);
      if (!contact) return;

      const blocks: string[] = [];

      if (sendGreeting) {
        const hola = await translate("Hola", contact.language);
        blocks.push(`${hola} *${contact.name}*`);
      }

      if (sendRoom && contact.roomNumber) {
        blocks.push(
          await translate(
            `Su habitación es la ${contact.roomNumber}`,
            contact.language
          )
        );
      }

      if (sendCheckin && contact.checkinUrl) {
        const txt = await translate(
          "Puede realizar el Check-in online en el siguiente enlace",
          contact.language
        );
        blocks.push(`${txt}\n${contact.checkinUrl}`);
      }

      for (const key of selectedBaseKeys) {
        const exact = messages.find(
          m => m.baseKey === key && m.language === contact.language
        );

        if (exact) {
          blocks.push(exact.content);
        } else {
          const fallback = messages.find(
            m => m.baseKey === key && m.language === "ES"
          );
          if (fallback) {
            blocks.push(
              await translate(fallback.content, contact.language)
            );
          }
        }
      }

      let text = blocks.join("\n\n");

      if (addSignature && signature) {
        text += `\n\n—\n${signature}`;
      }

      setFinalText(text);
    };

    build();
  }, [
    selectedContact,
    selectedBaseKeys,
    sendGreeting,
    sendRoom,
    sendCheckin,
    addSignature,
    signature,
    contacts,
    messages,
  ]);

  /* =======================
     WHATSAPP
  ======================= */

  const openWhatsApp = () => {
    const c = contacts.find(c => c.id === selectedContact);
    if (!c || !finalText) return;

    window.open(
      `https://wa.me/${c.phone.replace(/\D/g, "")}?text=${encodeURIComponent(finalText)}`,
      "_blank"
    );
  };

  /* =======================
     UI
  ======================= */

  const activeContacts = contacts.filter(c => c.status === "ACTUAL");

  return (
    <div className="space-y-8 max-w-xl mx-auto pb-40">
      {/* CONTACTO */}
      <section className="bg-white rounded-2xl shadow-sm p-5 space-y-2">
        <label className="text-sm font-medium text-gray-700">Contacto</label>
        <select
          className="w-full rounded-xl border px-3 py-3 text-base"
          value={selectedContact}
          onChange={e => setSelectedContact(e.target.value)}
        >
          <option value="">Selecciona contacto</option>
          {activeContacts.map(c => (
            <option key={c.id} value={c.id}>
              {languageFlag(c.language)} {c.name}
            </option>
          ))}
        </select>
      </section>

      {/* OPCIONES */}
      <section className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
        <p className="text-sm font-medium text-gray-700">
          Opciones automáticas
        </p>

        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={sendGreeting} onChange={e => setSendGreeting(e.target.checked)} />
          Saludo personalizado
        </label>

        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={sendRoom} onChange={e => setSendRoom(e.target.checked)} />
          Número de habitación
        </label>

        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={sendCheckin} onChange={e => setSendCheckin(e.target.checked)} />
          Check-in online
        </label>
      </section>

      {/* MENSAJES */}
      <section className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
        <label className="text-sm font-medium text-gray-700">Mensajes</label>

        <select
          className="w-full rounded-xl border px-3 py-3 text-base"
          value={selectedCategory}
          onChange={e => {
            setSelectedCategory(e.target.value);
            setSelectedBaseKeys([]);
          }}
        >
          <option value="">Selecciona categoría</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {spanishMessages.map(m => (
          <label key={m.id} className="flex gap-3 text-sm leading-snug">
            <input
              type="checkbox"
              checked={selectedBaseKeys.includes(m.baseKey)}
              onChange={e =>
                e.target.checked
                  ? setSelectedBaseKeys(p => [...p, m.baseKey])
                  : setSelectedBaseKeys(p => p.filter(k => k !== m.baseKey))
              }
            />
            <span>{m.content}</span>
          </label>
        ))}
      </section>

      {/* FIRMA */}
      <section className="bg-white rounded-2xl shadow-sm p-5">
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={addSignature} onChange={e => setAddSignature(e.target.checked)} />
          Añadir firma
        </label>
      </section>

      {/* PREVIEW */}
      {finalText && (
        <section className="space-y-2">
          <p className="text-sm text-gray-500">Vista previa</p>
          <div className="bg-[#ece5dd] rounded-2xl p-4">
            <div className="ml-auto max-w-[85%] bg-[#dcf8c6] p-3 rounded-2xl rounded-br-sm shadow text-sm">
              {renderWhatsAppPreview(finalText)}
            </div>
          </div>
        </section>
      )}

      {/* BOTÓN */}
      <button
        onClick={openWhatsApp}
        disabled={!finalText}
        className="w-full py-4 rounded-2xl bg-[#25D366] text-white text-lg font-semibold disabled:bg-gray-400 active:scale-95 transition"
      >
        📱 Enviar por WhatsApp
      </button>
    </div>
  );
}