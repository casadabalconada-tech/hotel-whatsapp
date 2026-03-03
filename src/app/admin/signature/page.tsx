"use client";

import { useEffect, useState } from "react";
import { useHeader } from "@/components/HeaderContext";

export default function AdminSignaturePage() {
  const { setHeader } = useHeader();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  /* =======================
     HEADER (ESTABLE)
  ======================= */
  useEffect(() => {
    setHeader({
      title: "Firma automática",
      subtitle: "Configuración",
      backHref: "/",
    });

    return () => {
      setHeader({});
    };
  }, [setHeader]);

  /* =======================
     CARGAR FIRMA
  ======================= */
  useEffect(() => {
    fetch("/api/signature")
      .then((res) => res.json())
      .then((data) => {
        setContent(data?.content ?? "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* =======================
     GUARDAR FIRMA
  ======================= */
  const saveSignature = async () => {
    setSaving(true);
    setMessage("");

    const res = await fetch("/api/signature", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    setMessage(
      res.ok
        ? "✅ Firma guardada correctamente"
        : "❌ Error al guardar la firma"
    );

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        Cargando firma…
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">

      <section className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
        <p className="text-sm text-gray-600">
          Esta firma se añadirá automáticamente cuando la opción esté activada.
        </p>

        <textarea
          className="w-full min-h-[140px] rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Escribe aquí la firma…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* PREVIEW */}
        {content && (
          <div className="bg-gray-100 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">
              Vista previa (WhatsApp)
            </p>
            <div className="bg-white rounded-xl p-3 shadow text-sm whitespace-pre-wrap">
              —
              <br />
              {content}
            </div>
          </div>
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
          <div className="text-sm text-center">
            {message}
          </div>
        )}
      </section>

    </div>
  );
}