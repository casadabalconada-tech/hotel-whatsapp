"use client";

import { useEffect, useRef, useState } from "react";
import { useHeader } from "@/components/HeaderContext";

type RoomType = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
};

const emptyRoomType: Omit<RoomType, "id"> = {
  name: "",
  description: "",
  icon: "",
};

export default function RoomTypesPage() {
  const { setHeader } = useHeader();
  const formRef = useRef<HTMLDivElement | null>(null);

  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [form, setForm] = useState<Omit<RoomType, "id">>(emptyRoomType);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState(false);

  /* =======================
     HEADER
  ======================= */
  useEffect(() => {
    setHeader({
      title: "Tipos de habitación",
      subtitle: "Configuración de habitaciones",
      backHref: "/",
    });

    return () => setHeader({});
  }, [setHeader]);

  /* =======================
     DATA
  ======================= */
  const loadRoomTypes = async () => {
    try {
      const res = await fetch("/api/room-types");
      const data = await res.json();
      setRoomTypes(Array.isArray(data) ? data : []);
    } catch {
      setRoomTypes([]);
    }
  };

  useEffect(() => {
    loadRoomTypes();
  }, []);

  /* =======================
     ACTIONS
  ======================= */
  const saveRoomType = async () => {
    if (!form.name.trim() || loading) return;

    setLoading(true);

    try {
      await fetch("/api/room-types", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingId
            ? { id: editingId, ...form }
            : {
                name: form.name,
                description: form.description || undefined,
                icon: form.icon || undefined,
              }
        ),
      });

      setForm(emptyRoomType);
      setEditingId(null);
      loadRoomTypes();
    } finally {
      setLoading(false);
    }
  };

  const editRoomType = (rt: RoomType) => {
    setEditingId(rt.id);
    setForm({
      name: rt.name,
      description: rt.description ?? "",
      icon: rt.icon ?? "",
    });

    setFlash(true);
    setTimeout(() => setFlash(false), 1000);

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyRoomType);
  };

  const deleteRoomType = async (id: string) => {
    if (!confirm("¿Eliminar este tipo de habitación?")) return;

    await fetch("/api/room-types", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    loadRoomTypes();
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">

      {/* FORM */}
      <section
        ref={formRef}
        className={`rounded-2xl shadow-sm p-4 space-y-4 transition-colors duration-700 ${
          flash ? "bg-yellow-100" : "bg-white"
        }`}
      >
        <h2 className="text-sm font-semibold">
          {editingId
            ? "Editar tipo de habitación"
            : "Nuevo tipo de habitación"}
        </h2>

        <input
          className="w-full rounded-xl border px-3 py-2 text-sm"
          placeholder="Nombre (ej: Doble estándar)"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="w-full rounded-xl border px-3 py-2 text-sm"
          placeholder="Descripción (opcional)"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          className="w-full rounded-xl border px-3 py-2 text-sm"
          placeholder="Icono (opcional, ej: 🛏️)"
          value={form.icon}
          onChange={(e) =>
            setForm({ ...form, icon: e.target.value })
          }
        />

        <div className="flex gap-2">
          <button
            onClick={saveRoomType}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold transition active:scale-95 disabled:opacity-50"
          >
            {loading
              ? "Guardando…"
              : editingId
              ? "Guardar cambios"
              : "Crear tipo de habitación"}
          </button>

          {editingId && (
            <button
              onClick={cancelEdit}
              className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 text-sm"
            >
              Cancelar
            </button>
          )}
        </div>
      </section>

      {/* LIST */}
      <section className="space-y-3">
        {roomTypes.map((rt) => (
          <div
            key={rt.id}
            className="bg-white rounded-2xl shadow-sm p-4 space-y-3"
          >
            <div className="flex items-center gap-2 flex-wrap">
              {rt.icon && (
                <span className="text-lg">{rt.icon}</span>
              )}
              <span className="font-semibold text-sm">
                {rt.name}
              </span>
            </div>

            {rt.description && (
              <p className="text-xs text-gray-500">
                {rt.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => editRoomType(rt)}
                className="px-3 py-2 bg-yellow-500 text-white rounded-lg text-xs transition active:scale-95"
              >
                Editar
              </button>

              <button
                onClick={() => deleteRoomType(rt.id)}
                className="px-3 py-2 bg-red-600 text-white rounded-lg text-xs transition active:scale-95"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}

        {roomTypes.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-8">
            No hay tipos de habitación creados todavía
          </div>
        )}
      </section>
    </div>
  );
}