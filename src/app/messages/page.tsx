"use client";

import { useEffect, useRef, useState } from "react";
import { useHeader } from "@/components/HeaderContext";

type Category = {
  id: string;
  name: string;
};

type Message = {
  id: string;
  baseKey: string;
  content: string;
  language: string;
  categoryId: string;
};

/* =======================
   WhatsApp Preview
======================= */
const renderWhatsAppPreview = (text: string) =>
  text.split("\n").map((line, i) => (
    <div key={i}>
      {line.split("*").map((part, j) =>
        j % 2 === 1 ? <strong key={j}>{part}</strong> : <span key={j}>{part}</span>
      )}
    </div>
  ));

export default function MessagesPage() {
  const { setHeader } = useHeader();

  const [categories, setCategories] = useState<Category[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const [categoryName, setCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] =
    useState<string | null>(null);

  const [messageContent, setMessageContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editingMessageId, setEditingMessageId] =
    useState<string | null>(null);

  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  const [categoryOpen, setCategoryOpen] = useState(false);

  // 🔥 efecto visual reforzado
  const [categoryFlash, setCategoryFlash] = useState(false);
  const [messageFlash, setMessageFlash] = useState(false);

  const messageFormRef = useRef<HTMLDivElement>(null);
  const categoryFormRef = useRef<HTMLDivElement>(null);

  /* =======================
     HEADER
  ======================= */
  useEffect(() => {
    setHeader({
      title: "Plantillas",
      subtitle: "Mensajes reutilizables",
      backHref: "/",
    });

    return () => setHeader({});
  }, [setHeader]);

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

  useEffect(() => {
    loadCategories();
    loadMessages();
  }, []);

  /* =======================
     CATEGORY
  ======================= */
  const saveCategory = async () => {
    if (!categoryName) return;

    await fetch("/api/categories", {
      method: editingCategoryId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        editingCategoryId
          ? { id: editingCategoryId, name: categoryName }
          : { name: categoryName }
      ),
    });

    setCategoryName("");
    setEditingCategoryId(null);
    setCategoryOpen(false);
    loadCategories();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("¿Eliminar esta categoría vacía?")) return;

    await fetch("/api/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    loadCategories();
    loadMessages();
  };

  const editCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setCategoryName(category.name);
    setCategoryOpen(true);

    setCategoryFlash(true);
    setTimeout(() => setCategoryFlash(false), 1200);

    setTimeout(() => {
      categoryFormRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  /* =======================
     MESSAGE
  ======================= */
  const saveMessage = async () => {
    if (!messageContent || !selectedCategory) return;

    await fetch("/api/messages", {
      method: editingMessageId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        editingMessageId
          ? {
              id: editingMessageId,
              content: messageContent,
              categoryId: selectedCategory,
            }
          : {
              content: messageContent,
              categoryId: selectedCategory,
            }
      ),
    });

    setMessageContent("");
    setEditingMessageId(null);
    loadMessages();
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("¿Eliminar este mensaje?")) return;

    await fetch("/api/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    loadMessages();
  };

  const editMessage = (m: Message) => {
    setEditingMessageId(m.id);
    setMessageContent(m.content);
    setSelectedCategory(m.categoryId);

    setExpandedCategories((prev) => ({
      ...prev,
      [m.categoryId]: true,
    }));

    setMessageFlash(true);
    setTimeout(() => setMessageFlash(false), 1200);

    setTimeout(() => {
      messageFormRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const moveMessage = async (
    baseKey: string,
    direction: "UP" | "DOWN",
    categoryId: string
  ) => {
    await fetch("/api/messages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ baseKey, direction, categoryId }),
    });

    loadMessages();
  };

  /* =======================
     GROUP
  ======================= */
  const groupedByCategory = categories.map((category) => ({
    category,
    messages: messages.filter(
      (m) => m.categoryId === category.id && m.language === "ES"
    ),
  }));

  return (
    <div className="space-y-10 max-w-3xl mx-auto">

      {/* ================= CATEGORÍAS ================= */}
      <section
        ref={categoryFormRef}
        className={`rounded-2xl border overflow-hidden transition-all duration-700 ${
          categoryFlash
            ? "bg-blue-100 border-blue-500 ring-4 ring-blue-300 animate-pulse"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <button
          onClick={() => setCategoryOpen((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium"
        >
          <span>
            {editingCategoryId ? "Editar categoría" : "Gestionar categorías"}
          </span>
          <span className="text-gray-400">
            {categoryOpen ? "▾" : "▸"}
          </span>
        </button>

        {categoryOpen && (
          <div className="px-5 pb-5 space-y-4 border-t bg-white">
            <p className="text-xs text-gray-500">
              Agrupa los mensajes por tipo
            </p>

            <input
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
              placeholder="Nombre de la categoría"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />

            <div className="flex gap-2">
              <button
                onClick={saveCategory}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition active:scale-95"
              >
                Guardar
              </button>

              <button
                onClick={() => {
                  setEditingCategoryId(null);
                  setCategoryName("");
                  setCategoryOpen(false);
                }}
                className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ================= MENSAJE ================= */}
      <section
        ref={messageFormRef}
        className={`rounded-2xl shadow-sm p-5 space-y-4 transition-all duration-700 ${
          messageFlash
            ? "bg-blue-100 ring-4 ring-blue-300 animate-pulse"
            : "bg-white"
        }`}
      >
        <div>
          <h2 className="text-base font-semibold">
            {editingMessageId ? "Editar mensaje" : "Nuevo mensaje (ES)"}
          </h2>
          <p className="text-xs text-gray-500">
            Plantilla reutilizable de WhatsApp
          </p>
        </div>

        <select
          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Selecciona categoría</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <textarea
          className="w-full min-h-[140px] rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
          placeholder="Escribe el mensaje (usa *negrita* como WhatsApp)"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
        />

        {messageContent && (
          <div className="bg-[#ece5dd] rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-2">
              Vista previa
            </p>
            <div className="ml-auto max-w-[85%] bg-[#dcf8c6] p-3 rounded-2xl rounded-br-sm shadow text-sm">
              {renderWhatsAppPreview(messageContent)}
            </div>
          </div>
        )}

        <button
          onClick={saveMessage}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition active:scale-95"
        >
          Guardar mensaje
        </button>
      </section>

      {/* ================= LISTADO ================= */}
      <section className="space-y-6">
        {groupedByCategory.map(({ category, messages }) => {
          const expanded = expandedCategories[category.id];
          const isEmpty = messages.length === 0;

          return (
            <div
              key={category.id}
              className="bg-white rounded-2xl shadow-sm p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() =>
                    setExpandedCategories((prev) => ({
                      ...prev,
                      [category.id]: !prev[category.id],
                    }))
                  }
                  className="font-semibold text-sm flex items-center gap-2"
                >
                  {expanded ? "▾" : "▸"} {category.name}
                  <span className="text-gray-400 text-xs">
                    ({messages.length})
                  </span>
                </button>

                <div className="flex gap-3 text-sm">
                  <button
                    onClick={() => editCategory(category)}
                    className="text-gray-600"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => deleteCategory(category.id)}
                    disabled={!isEmpty}
                    className="text-red-500 disabled:opacity-30"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              {expanded &&
                messages.map((m, index) => (
                  <div
                    key={m.id}
                    className="bg-gray-50 rounded-xl p-3 space-y-3 hover:bg-gray-100 transition"
                  >
                    <div className="text-sm whitespace-pre-wrap">
                      {m.content}
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                      <button
                        onClick={() =>
                          moveMessage(m.baseKey, "UP", category.id)
                        }
                        disabled={index === 0}
                        className="disabled:opacity-30"
                      >
                        ⬆ Subir
                      </button>

                      <button
                        onClick={() =>
                          moveMessage(m.baseKey, "DOWN", category.id)
                        }
                        disabled={index === messages.length - 1}
                        className="disabled:opacity-30"
                      >
                        ⬇ Bajar
                      </button>

                      <button onClick={() => editMessage(m)}>
                        Editar
                      </button>

                      <button
                        onClick={() => deleteMessage(m.id)}
                        className="text-red-500"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          );
        })}
      </section>
    </div>
  );
}