"use client";

import { useEffect, useRef, useState } from "react";
import { useHeader } from "@/components/HeaderContext";

/* =======================
   TYPES
======================= */

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

type ContactForm = Omit<Contact, "id">;

/* =======================
   CONSTANTS
======================= */

const emptyContact: ContactForm = {
  name: "",
  roomNumber: "",
  phone: "",
  language: "ES",
  checkinUrl: "",
  status: "ACTUAL",
};

const languageFlag: Record<Language, string> = {
  ES: "🇪🇸",
  EN: "🇬🇧",
  DE: "🇩🇪",
  FR: "🇫🇷",
  IT: "🇮🇹",
  PT: "🇵🇹",
};

const statusLabel: Record<ContactStatus, string> = {
  ACTUAL: "Actual",
  FUTURO: "Futuro",
  HISTORICO: "Histórico",
};

/* =======================
   PAGE
======================= */

export default function ContactsPage() {
  const { setHeader } = useHeader();
  const formRef = useRef<HTMLDivElement | null>(null);

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [form, setForm] = useState<ContactForm>(emptyContact);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ContactStatus>("ACTUAL");
  const [search, setSearch] = useState("");
  const [flash, setFlash] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formOpen, setFormOpen] = useState(false);

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
     LOAD
  ======================= */

  const loadContacts = async () => {
    const res = await fetch("/api/contacts");
    const data = await res.json();
    setContacts(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  /* =======================
     HELPERS
  ======================= */

  const normalizedForm = (): ContactForm => ({
    name: form.name.trim(),
    phone: form.phone.trim(),
    roomNumber: form.roomNumber?.trim() || null,
    language: form.language,
    checkinUrl: form.checkinUrl?.trim() || null,
    status: form.status,
  });

  const canSave = form.name.trim() && form.phone.trim();

  /* =======================
     ACTIONS
  ======================= */
const recoverFromHistorico = async (c: Contact) => {
  if (!confirm(`¿Recuperar a ${c.name} como contacto actual?`)) return;

  await fetch("/api/contacts", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: c.id,
      name: c.name,
      phone: c.phone,
      roomNumber: c.roomNumber,
      language: c.language,
      checkinUrl: c.checkinUrl,
      status: "ACTUAL",
    }),
  });

  setActiveTab("ACTUAL");
  loadContacts();
};
  const moveToHistorico = async (c: Contact) => {
  if (!confirm(`¿Pasar a histórico a ${c.name}?`)) return;

  await fetch("/api/contacts", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: c.id,
      name: c.name,
      phone: c.phone,
      roomNumber: c.roomNumber,
      language: c.language,
      checkinUrl: c.checkinUrl,
      status: "HISTORICO",
    }),
  });

  loadContacts();
};

  const saveContact = async () => {
    if (!canSave || saving) return;

    setSaving(true);

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
    setSaving(false);
    setFormOpen(false);
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

    setFormOpen(true);

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);

    setFlash(true);
    setTimeout(() => setFlash(false), 800);
  };

  /* =======================
     FILTER
  ======================= */

const sortByRoom = (a: Contact, b: Contact) => {
  // Los que no tienen habitación van al final
  if (!a.roomNumber && !b.roomNumber) return 0;
  if (!a.roomNumber) return 1;
  if (!b.roomNumber) return -1;

  // Orden numérico si es posible (Hab 2 antes que Hab 10)
  const numA = parseInt(a.roomNumber, 10);
  const numB = parseInt(b.roomNumber, 10);

  if (!isNaN(numA) && !isNaN(numB)) {
    return numA - numB;
  }

  // Si no son números, ordenar como texto
  return a.roomNumber.localeCompare(b.roomNumber, "es", {
    numeric: true,
    sensitivity: "base",
  });
};



  const filteredContacts = contacts
  .filter((c) => {
    const q = search.toLowerCase();
    const matches =
      c.name.toLowerCase().includes(q) ||
      (c.roomNumber ?? "").toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q);

    if (search.trim()) return matches;
    return c.status === activeTab;
  })
  .sort(sortByRoom);

  /* =======================
     UI
  ======================= */

  return (
    <div className="space-y-10 max-w-3xl mx-auto pb-32">

      {/* FORM COLLAPSED */}
      <section
        ref={formRef}
        className={`rounded-2xl shadow-sm p-5 transition-all ${
          flash ? "bg-yellow-50" : "bg-white"
        }`}
      >
        <button
          type="button"
          onClick={() => setFormOpen((v) => !v)}
          className="w-full flex items-center justify-between"
        >
          <div>
            <h2 className="text-base font-semibold">
              {editingId ? "Editar contacto" : "Nuevo contacto"}
            </h2>
            <p className="text-xs text-gray-500">
              Información del huésped
            </p>
          </div>

          <span className="text-xl">
            {formOpen ? "➖" : "➕"}
          </span>
        </button>

        {formOpen && (
          <div className="mt-4 space-y-4">
            {[
              { label: "Nombre", key: "name" },
              { label: "Habitación", key: "roomNumber" },
              { label: "Teléfono", key: "phone" },
              { label: "URL check-in", key: "checkinUrl" },
            ].map(({ label, key }) => (
              <input
                key={key}
                aria-label={label}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder={label}
                value={form[key as keyof ContactForm] ?? ""}
                onChange={(e) =>
                  setForm({ ...form, [key]: e.target.value })
                }
              />
            ))}

            <div className="grid grid-cols-2 gap-2">
              <select
                className="rounded-xl border border-gray-200 px-2 py-2 text-sm"
                value={form.language}
                onChange={(e) =>
                  setForm({ ...form, language: e.target.value as Language })
                }
              >
                {(Object.keys(languageFlag) as Language[]).map((l) => (
                  <option key={l} value={l}>
                    {languageFlag[l]} {l}
                  </option>
                ))}
              </select>

              <select
                className="rounded-xl border border-gray-200 px-2 py-2 text-sm"
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as ContactStatus })
                }
              >
                {(Object.keys(statusLabel) as ContactStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {statusLabel[s]}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              disabled={!canSave || saving}
              onClick={saveContact}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold transition active:scale-95"
            >
              {editingId ? "Guardar cambios" : "Crear contacto"}
            </button>
          </div>
        )}
      </section>

      {/* SEARCH */}
      <section className="bg-white rounded-2xl p-3 shadow-sm">
        <input
          aria-label="Buscar contacto"
          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
          placeholder="Buscar contacto…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      {/* TABS */}
      <div className="flex gap-2">
        {(Object.keys(statusLabel) as ContactStatus[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition active:scale-95 ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {statusLabel[tab]}
          </button>
        ))}
      </div>

      {/* LIST */}
      <section className="space-y-3">
        {filteredContacts.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl shadow-sm p-4 space-y-2"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg">{languageFlag[c.language]}</span>
              <span className="font-semibold text-sm">{c.name}</span>

              {c.roomNumber && (
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs">
                  Hab {c.roomNumber}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500">{c.phone}</p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  window.open(
                    `https://wa.me/${c.phone.replace(/\D/g, "")}`,
                    "_blank"
                  )
                }
                className="px-3 py-2 bg-green-500 text-white rounded-lg text-xs"
              >
                WhatsApp
              </button>

              <button
                type="button"
                onClick={() => editContact(c)}
                className="px-3 py-2 bg-gray-800 text-white rounded-lg text-xs"
              >
                Editar
              </button>
                              {c.status !== "HISTORICO" && (
              <button
                              type="button"
                onClick={() => moveToHistorico(c)}
                className="px-3 py-2 bg-yellow-500 text-white rounded-lg text-xs"
              >
                Histórico
              </button>
              )}
              <button
                type="button"
                onClick={() => deleteContact(c.id)}
                className="px-3 py-2 bg-red-500 text-white rounded-lg text-xs"
              >
                Eliminar
              </button>
{c.status === "HISTORICO" && (
  <button
    type="button"
    onClick={() => recoverFromHistorico(c)}
    className="px-3 py-2 bg-blue-500 text-white rounded-lg text-xs"
  >
    Recuperar
  </button>
)}

            </div>
          </div>
        ))}
      </section>
    </div>
  );
}