"use client";

import { useState, useMemo } from "react";
import { Contact } from "@/lib/schemas";

/* =======================
   FLAGS
======================= */

const languageFlag = (lang: Contact["language"]) => {
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
   STATUS ICON
======================= */

const statusIcon = (status: Contact["status"]) => {
  switch (status) {
    case "ACTUAL": return "🟢";
    case "FUTURO": return "🟡";
    case "HISTORICO": return "⚪";
    default: return "";
  }
};

/* =======================
   ORDER
======================= */

const statusOrder: Record<Contact["status"], number> = {
  ACTUAL: 1,
  FUTURO: 2,
  HISTORICO: 3,
};

function orderContacts(list: Contact[]) {
  return [...list].sort((a, b) => {
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;

    if (a.status === "ACTUAL") {
      const roomA = a.roomNumber ? Number(a.roomNumber) : Infinity;
      const roomB = b.roomNumber ? Number(b.roomNumber) : Infinity;
      return roomA - roomB;
    }

    return a.name.localeCompare(b.name);
  });
}

/* =======================
   PROPS
======================= */

type Props = {
  contacts: Contact[];
  value: string;
  onChange: (id: string) => void;
};

/* =======================
   COMPONENT
======================= */

export default function ContactSelector({
  contacts,
  value,
  onChange,
}: Props) {

  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const ordered = orderContacts(contacts);

    if (!search) return ordered;

    return ordered.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.roomNumber?.includes(search)
    );
  }, [contacts, search]);

  return (
    <section className="bg-white rounded-xl shadow-sm p-3 space-y-2">

      <label className="text-xs font-medium text-gray-600">
        Contacto
      </label>

      {/* BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar huésped o habitación…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full border rounded-lg px-2 py-1.5 text-xs"
      />

      {/* LISTA */}
      <div className="max-h-44 overflow-y-auto space-y-1">

        {filtered.map(c => {

          const active = value === c.id;

          return (
            <button
              key={c.id}
              onClick={() => onChange(c.id)}
              className={`
                w-full text-left px-2 py-1.5 rounded-lg text-xs
                flex items-center gap-2
                transition
                ${active
                  ? "bg-green-100"
                  : "hover:bg-gray-100"}
              `}
            >
              <span>{statusIcon(c.status)}</span>
              <span>{languageFlag(c.language)}</span>

              <span className="flex-1 truncate">
                {c.name}
              </span>

              {c.roomNumber && (
                <span className="text-gray-500 text-[11px]">
                  Hab {c.roomNumber}
                </span>
              )}

            </button>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-xs text-gray-400 py-2 text-center">
            No se encontraron huéspedes
          </p>
        )}

      </div>

    </section>
  );
}