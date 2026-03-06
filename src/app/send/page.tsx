"use client";

import { useEffect, useState } from "react";
import { useHeader } from "@/components/HeaderContext";
import ContactSelector from "@/components/ContactSelector";
import WhatsAppPreview from "@/components/WhatsAppPreview";

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
         blocks.push(`*${exact.title}*\n${exact.content}`);
        } else {
          const fallback = messages.find(
            m => m.baseKey === key && m.language === "ES"
          );
          if (fallback) {

  const translatedContent = await translate(
    fallback.content,
    contact.language
  );

  const translatedTitle = await translate(
    fallback.title,
    contact.language
  );

  blocks.push(`*${translatedTitle}*\n${translatedContent}`);
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

const statusOrder: Record<Contact["status"], number> = {
  ACTUAL: 1,
  FUTURO: 2,
  HISTORICO: 3,
};

  /* =======================
     UI
  ======================= */

 

  return (
    <div className="space-y-8 max-w-xl mx-auto pb-40">
      {/* CONTACTO */}
      <section className="bg-white rounded-2xl shadow-sm p-5 space-y-2">
        <label className="text-sm font-medium text-gray-700">Contacto</label>
        <ContactSelector
  contacts={contacts}
  value={selectedContact}
  onChange={setSelectedContact}
/>
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

        <div className="flex flex-wrap gap-2 pb-1">

  {categories.map(c => {

    const active = selectedCategory === c.id;

    return (
      <button
        key={c.id}
        onClick={() => {
          setSelectedCategory(c.id);
          setSelectedBaseKeys([]);
        }}
        className={`
  px-4 py-2 rounded-full text-sm transition
  ${active
    ? "bg-green-600 text-white"
    : "bg-gray-100 hover:bg-gray-200"}
`}
      >
        {c.name}
      </button>
    );
  })}

</div>

        <div className="space-y-2">

{!selectedCategory && (
  <p className="text-sm text-gray-400 text-center py-4">
    Selecciona una categoría
  </p>
)}

{selectedCategory && spanishMessages.map(m => {

  const selected = selectedBaseKeys.includes(m.baseKey);

  const toggle = () => {
    if (selected) {
      setSelectedBaseKeys(p => p.filter(k => k !== m.baseKey));
    } else {
      setSelectedBaseKeys(p => [...p, m.baseKey]);
    }
  };

  return (
    <button
      key={m.id}
      onClick={toggle}
      className={`
        w-full text-left p-3 rounded-xl border transition
        ${selected
          ? "border-green-500 bg-green-50"
          : "border-gray-200 hover:bg-gray-50"}
      `}
    >

      <div className="flex items-start gap-3">

        <div className={`
          mt-1 w-5 h-5 rounded-md border flex items-center justify-center text-xs
          ${selected
            ? "bg-green-500 border-green-500 text-white"
            : "border-gray-300"}
        `}>
          {selected && "✓"}
        </div>

       <div className="flex-1">

  <p className="text-sm font-semibold text-gray-900">
    {m.title}
  </p>

  <p className="text-xs text-gray-500 leading-snug line-clamp-2">
    {m.content}
  </p>

</div>

      </div>

    </button>
  );
})}

</div>
      </section>

      {/* FIRMA */}
      <section className="bg-white rounded-2xl shadow-sm p-5">
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={addSignature} onChange={e => setAddSignature(e.target.checked)} />
          Añadir firma
        </label>
      </section>

{/* PREVIEW */}
<WhatsAppPreview text={finalText} />

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