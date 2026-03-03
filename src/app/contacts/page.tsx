"use client";

import { useEffect, useRef, useState } from "react";
import { useHeader } from "@/components/HeaderContext";

type Language = "ES" | "EN" | "DE" | "FR" | "IT" | "PT";
type ContactStatus = "ACTUAL" | "FUTURO" | "HISTORICO";

type Contact = {
  id: string;
  name: string;
  roomNumber?: string | null;
  phone: string;
  language: Language;
  checkinUrl?: string | null;
  status: ContactStatus;
};

const emptyContact: Omit<Contact, "id"> = {
  name: "",
  roomNumber: "",
  phone: "",
  language: "ES",
  checkinUrl: "",
  status: "ACTUAL",
};

// 🌍 BANDERAS POR IDIOMA
const languageFlag: Record<Language, string> = {
  ES: "🇪🇸",
  EN: "🇬🇧",
  DE: "🇩🇪",
  FR: "🇫🇷",
  IT: "🇮🇹",
  PT: "🇵🇹",
};

export default function ContactsPage() {
  const { setHeader } = useHeader();
  const formRef = useRef<HTMLDivElement | null>(null);

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [form, setForm] = useState<Omit<Contact, "id">>(emptyContact);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ContactStatus>("ACTUAL");
  const [search, setSearch] = useState("");
  const [flash, setFlash] = useState(false);

  /* =======================
     HEADER
  ======================= */

  useEffect(() => {
    setHeader({
      title: "Contactos",
      subtitle: "Huéspedes y clientes",
      backHref: "/",
    });

    return () => setHeader({});
  }, [setHeader]);

  /* =======================
     DATA
  ======================= */

  const loadContacts = async () => {
    const res = await fetch("/api/contacts");
    const data = await res.json();
    setContacts(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  // 🔧 NORMALIZADOR (CLAVE)
  const normalizedForm = () => ({
    name: form.name.trim(),
    phone: form.phone.trim(),
    roomNumber: form.roomNumber?.trim() || null,
    language: form.language,
    checkinUrl: form.checkinUrl?.trim() || null,
    status: form.status,
  });

  const saveContact = async () => {
    if (!form.name.trim() || !form.phone.trim()) return;

    await fetch("/api/contacts", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        editingId
          ? { id: editingId, ...normalizedForm() }
          : normalizedForm()
      ),
    });

    setForm(emptyContact);
    setEditingId(null);
    setActiveTab(form.status);
    loadContacts();
  };

  const deleteContact = async (id: string) => {
    if (!confirm("¿Eliminar este contacto?")) return;

    await fetch("/api/contacts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    loadContacts();
  };

  const editContact = (c: Contact) => {
    setEditingId(c.id);
    setForm({
      name: c.name ?? "",
      roomNumber: c.roomNumber ?? "",
      phone: c.phone ?? "",
      language: c.language ?? "ES",
      checkinUrl: c.checkinUrl ?? "",
      status: c.status ?? "ACTUAL",
    });

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);

    setFlash(true);
    setTimeout(() => setFlash(false), 1000);
  };

  const filteredContacts = contacts.filter((c) => {
    const q = search.toLowerCase();

    const matches =
      c.name.toLowerCase().includes(q) ||
      (c.roomNumber ?? "").toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q);

    if (search.trim()) return matches;
    return c.status === activeTab;
  });

  return (
    <div className="space-y-8 max-w-3xl mx-auto">

      {/* FORM */}
      <section
        ref={formRef}
        className={`rounded-2xl shadow-sm p-4 space-y-3 transition-colors duration-700 ${
          flash ? "bg-yellow-100" : "bg-white"
        }`}
      >
        <h2 className="text-sm font-semibold">
          {editingId ? "Editar contacto" : "Nuevo contacto"}
        </h2>

        {[
          ["Nombre", "name"],
          ["Habitación", "roomNumber"],
          ["Teléfono", "phone"],
          ["URL check-in", "checkinUrl"],
        ].map(([ph, key]) => (
          <input
            key={key}
            className="w-full rounded-xl border px-3 py-2 text-sm"
            placeholder={ph}
            value={(form as any)[key]}
            onChange={(e) =>
              setForm({ ...form, [key]: e.target.value })
            }
          />
        ))}

        <div className="grid grid-cols-2 gap-2">
          <select
            className="rounded-xl border px-2 py-2 text-sm"
            value={form.language}
            onChange={(e) =>
              setForm({ ...form, language: e.target.value as Language })
            }
          >
            {(["ES", "EN", "DE", "FR", "IT", "PT"] as Language[]).map((l) => (
              <option key={l} value={l}>
                {languageFlag[l]} {l}
              </option>
            ))}
          </select>

          <select
            className="rounded-xl border px-2 py-2 text-sm"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as ContactStatus })
            }
          >
            <option value="ACTUAL">Actual</option>
            <option value="FUTURO">Futuro</option>
            <option value="HISTORICO">Histórico</option>
          </select>
        </div>

        <button
          onClick={saveContact}
          className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold transition active:scale-95"
        >
          {editingId ? "Guardar cambios" : "Crear contacto"}
        </button>
      </section>

      {/* SEARCH */}
      <input
        className="w-full rounded-xl border px-3 py-2 text-sm"
        placeholder="Buscar contacto…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABS */}
      <div className="flex gap-2">
        {(["ACTUAL", "FUTURO", "HISTORICO"] as ContactStatus[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition active:scale-95 ${
              activeTab === tab ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* LIST */}
      <section className="space-y-3">
        {filteredContacts.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl shadow-sm p-4 space-y-3"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg">
                {languageFlag[c.language]}
              </span>

              <span className="font-semibold text-sm">
                {c.name}
              </span>

              {c.roomNumber && (
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                  Hab {c.roomNumber}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500">
              {c.phone}
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() =>
                  window.open(
                    `https://wa.me/${c.phone.replace(/\D/g, "")}`,
                    "_blank"
                  )
                }
                className="px-3 py-2 bg-green-500 text-white rounded-lg text-xs transition active:scale-95"
              >
                WhatsApp
              </button>

              <button
                onClick={() => editContact(c)}
                className="px-3 py-2 bg-yellow-500 text-white rounded-lg text-xs transition active:scale-95"
              >
                Editar
              </button>

              <button
                onClick={() => deleteContact(c.id)}
                className="px-3 py-2 bg-red-600 text-white rounded-lg text-xs transition active:scale-95"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}