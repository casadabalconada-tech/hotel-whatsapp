"use client";

import { useEffect, useState } from "react";
import { useHeader } from "@/components/HeaderContext";
import WhatsAppPreview from "@/components/WhatsAppPreview";

export default function AdminSignaturePage() {
  const { setHeader } = useHeader();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<null | {
    text: string;
    type: "ok" | "error";
  }>(null);

  /* =======================
     HEADER (ESTABLE)
  ======================= */
  useEffect(() => {
    setHeader({
      title: "Firma automática",
      subtitle: "Configuración",
      backHref: "/",
    });

    return () => setHeader({});
  }, [setHeader]);

  /* =======================
     CARGAR FIRMA
  ======================= */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/signature");
        const data = await res.json();
        setContent(data?.content ?? "");
      } catch {
        // silencioso, no bloquea la UI
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* =======================
     GUARDAR FIRMA
  ======================= */
  const saveSignature = async () => {
    if (saving) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/signature", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      setMessage({
        type: res.ok ? "ok" : "error",
        text: res.ok
          ? "Firma guardada correctamente"
          : "Error al guardar la firma",
      });
    } catch {
      setMessage({
        type: "error",
        text: "Error de conexión",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-500">
        Cargando firma…
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">

      <section className="bg-white rounded-2xl shadow-sm p-4 space-y-4">
        <p className="text-sm text-gray-600">
          Esta firma se añadirá automáticamente a los mensajes cuando la opción
          esté activada.
        </p>

        <textarea
          className="w-full min-h-[140px] rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Escribe aquí la firma…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* PREVIEW */}
{content.trim() && (
  <section className="space-y-2">
    <p className="text-xs text-gray-500">
      Vista previa (WhatsApp)
    </p>

    <WhatsAppPreview text={`—\n${content}`} />
  </section>
)}

        <button
          onClick={saveSignature}
          disabled={saving}
          className={`w-full py-3 rounded-xl text-white font-semibold transition active:scale-95 ${
            saving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600"
          }`}
        >
          {saving ? "Guardando…" : "💾 Guardar firma"}
        </button>

        {message && (
          <div
            className={`text-sm text-center ${
              message.type === "ok"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message.type === "ok" ? "✅ " : "❌ "}
            {message.text}
          </div>
        )}
      </section>
    </div>
  );
}