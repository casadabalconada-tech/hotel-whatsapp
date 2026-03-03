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

    setTimeout(() => {
      categoryFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
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

    setTimeout(() => {
      messageFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
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
        className="bg-gray-50 border-2 border-dashed rounded-2xl p-4 space-y-3"
      >
        <h2 className="text-sm font-semibold flex items-center gap-2">
          📂 {editingCategoryId ? "Editar categoría" : "Nueva categoría"}
        </h2>

        <input
          className="w-full rounded-xl border px-3 py-2 text-sm bg-white"
          placeholder="Nombre de la categoría"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />

        <div className="flex gap-2">
          <button
            onClick={saveCategory}
            className="flex-1 py-2 bg-gray-700 text-white rounded-xl text-sm font-medium active:scale-95 transition"
          >
            Guardar categoría
          </button>

          {editingCategoryId && (
            <button
              onClick={() => {
                setEditingCategoryId(null);
                setCategoryName("");
              }}
              className="flex-1 py-2 bg-gray-200 rounded-xl text-sm"
            >
              Cancelar
            </button>
          )}
        </div>
      </section>

      {/* ================= MENSAJE ================= */}
      <section
        ref={messageFormRef}
        className="bg-white rounded-2xl shadow-sm p-4 space-y-3 border"
      >
        <h2 className="text-sm font-semibold flex items-center gap-2">
          💬 {editingMessageId ? "Editar mensaje" : "Nuevo mensaje (ES)"}
        </h2>

        <select
          className="w-full rounded-xl border px-3 py-2 text-sm"
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
          className="w-full min-h-[140px] rounded-xl border px-3 py-2 text-sm"
          placeholder="Escribe el mensaje (usa *negrita* como WhatsApp)"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
        />

        {messageContent && (
          <div className="bg-[#ece5dd] rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-2">
              Vista previa (WhatsApp)
            </p>
            <div className="ml-auto max-w-[85%] bg-[#dcf8c6] p-3 rounded-2xl rounded-br-sm shadow text-sm">
              {renderWhatsAppPreview(messageContent)}
            </div>
          </div>
        )}

        <button
          onClick={saveMessage}
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold active:scale-95 transition"
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
                  {expanded ? "🔽" : "▶️"} {category.name} ({messages.length})
                </button>

                <div className="flex gap-3 text-sm">
                  <button onClick={() => editCategory(category)}>
                    ✏️ Editar
                  </button>

                  <button
                    onClick={() => deleteCategory(category.id)}
                    disabled={!isEmpty}
                    className="text-red-600 disabled:opacity-30"
                  >
                    🗑 Eliminar
                  </button>
                </div>
              </div>

              {expanded &&
                messages.map((m, index) => (
                  <div
                    key={m.id}
                    className="bg-gray-50 rounded-xl p-3 space-y-3"
                  >
                    <div className="text-sm whitespace-pre-wrap">
                      {m.content}
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm">
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
                        ✏️ Editar
                      </button>

                      <button
                        onClick={() => deleteMessage(m.id)}
                        className="text-red-600"
                      >
                        🗑 Eliminar
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