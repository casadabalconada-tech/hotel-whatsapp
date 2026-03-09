"use client";

import { useEffect, useState, useMemo } from "react";
import { useHeader } from "@/components/HeaderContext";
import CategorySelector from "@/components/CategorySelector";
import LanguageTextarea from "@/components/LanguageTextarea";
import WhatsAppPreview from "@/components/WhatsAppPreview";

/* =======================
   TYPES
======================= */

type Category = {
  id: string;
  name: string;
};

type Message = {
  id: string;
  baseKey: string;
  title: string;
  content: string;
  language: string;
  categoryId: string;
};

/* =======================
   LANGUAGES
======================= */

const languages = ["ES", "EN", "DE", "FR", "IT", "PT"];

/* =======================
   PAGE
======================= */

export default function TranslationsPage() {

  const { setHeader } = useHeader();

  const [categories, setCategories] = useState<Category[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [previewLanguage, setPreviewLanguage] = useState("ES");

  const [saving, setSaving] = useState(false);

  /* =======================
     HEADER
  ======================= */

  useEffect(() => {

    setHeader({
      title: "Traducciones",
      subtitle: "Editar textos por idioma",
      backHref: "/",
    });

    loadCategories();
    loadMessages();

    return () => setHeader({});

  }, []);

  /* =======================
     LOAD
  ======================= */

  const loadCategories = async () => {
    const res = await fetch("/api/categories");
    setCategories(await res.json());
  };

  const loadMessages = async () => {
    const res = await fetch("/api/messages");
    setMessages(await res.json());
  };

  /* =======================
     GROUP BY baseKey
  ======================= */

  const groupedMessages = useMemo(() => {

    if (!selectedCategory) return [];

    const filtered = messages.filter(
      m => m.categoryId === selectedCategory
    );

    const map: Record<string, Message[]> = {};

    for (const m of filtered) {

      if (!map[m.baseKey]) {
        map[m.baseKey] = [];
      }

      map[m.baseKey].push(m);
    }

    return Object.entries(map).map(([baseKey, msgs]) => {

      const title = msgs.find(m => m.language === "ES")?.title || baseKey;

      const byLang: Record<string, Message | undefined> = {};

      for (const lang of languages) {
        byLang[lang] = msgs.find(m => m.language === lang);
      }

      return {
        baseKey,
        title,
        byLang
      };

    });

  }, [messages, selectedCategory]);

  /* =======================
     UPDATE
  ======================= */

  const updateMessage = (id: string, text: string) => {

    setMessages(prev =>
      prev.map(m =>
        m.id === id ? { ...m, content: text } : m
      )
    );

  };

  /* =======================
     SAVE
  ======================= */

  const save = async () => {

    setSaving(true);

    await fetch("/api/translations/bulk-update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messages),
    });

    setSaving(false);
  };

  /* =======================
     UI
  ======================= */

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-32 px-3 overflow-x-hidden">

      {/* SELECT CATEGORY */}

      <CategorySelector
        categories={categories}
        value={selectedCategory}
        onChange={setSelectedCategory}
      />

      {!selectedCategory && (
        <p className="text-sm text-gray-400 text-center py-10">
          Selecciona una categoría
        </p>
      )}

      {selectedCategory && (
  <div className="flex gap-2 items-center text-xs flex-wrap">

    <span className="text-gray-500">
      Vista previa:
    </span>

    {languages.map(lang => (

      <button
        key={lang}
        onClick={() => setPreviewLanguage(lang)}
        className={`
          px-2 py-1 rounded
          transition
          ${previewLanguage === lang
            ? "bg-green-600 text-white"
            : "bg-gray-100 hover:bg-gray-200"}
        `}
      >
        {lang}
      </button>

    ))}

  </div>
)}

      {/* MESSAGES */}


   {groupedMessages.map((msg) => {

  const previewText =
    msg.byLang[previewLanguage]?.content ||
    msg.byLang["ES"]?.content ||
    "";

  return (
    <div
      key={msg.baseKey}
      className="bg-white rounded-xl shadow-sm p-4 space-y-4"
    >

      <div className="font-semibold text-sm flex items-center gap-2">
        📌 {msg.title}
      </div>

        {languages.map((lang) => {

        const m = msg.byLang[lang];

        return (
          <LanguageTextarea
            key={lang}
            language={lang}
            value={m?.content || ""}
            onChange={(text) => {
              if (m) updateMessage(m.id, text);
            }}
          />
        );

      })}

<WhatsAppPreview text={previewText} />

    </div>
  );

})}

      {groupedMessages.length > 0 && (

        <button
          onClick={save}
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium"
        >
          {saving ? "Guardando..." : "Guardar traducciones"}
        </button>

      )}

    </div>
  );
}