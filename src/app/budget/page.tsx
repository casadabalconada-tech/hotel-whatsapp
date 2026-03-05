"use client";

import { useEffect, useState } from "react";
import { useHeader } from "@/components/HeaderContext";

/* =======================
   TYPES
======================= */

type RoomType = {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
};

type Language = "ES" | "EN" | "FR" | "DE" | "IT" | "PT";

/* =======================
   HELPERS
======================= */

const formatDate = (value: string) => {
  if (!value) return "-";
  const d = new Date(value);
  return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("es-ES");
};

const diffNights = (from: string, to: string) => {
  if (!from || !to) return 0;
  const a = new Date(from).getTime();
  const b = new Date(to).getTime();
  if (isNaN(a) || isNaN(b) || b <= a) return 0;
  return Math.ceil((b - a) / (1000 * 60 * 60 * 24));
};

const languageFlag: Record<Language, string> = {
  ES: "🇪🇸",
  EN: "🇬🇧",
  FR: "🇫🇷",
  DE: "🇩🇪",
  IT: "🇮🇹",
  PT: "🇵🇹",
};

/* =======================
   MESSAGE TEMPLATES
======================= */

const templates: Record<Language, (d: any) => string> = {
  ES: (d) => `
Hola ${d.name},

Te enviamos el presupuesto de tu estancia:

🛏️ Tipo de habitación: ${d.room}
📅 Entrada: ${d.checkin}
📅 Salida: ${d.checkout}
🌙 Noches: ${d.nights}
🏨 Habitaciones: ${d.rooms}
💶 Precio por noche: ${d.price} €
💰 Total: ${d.total} €

Quedamos atentos a cualquier duda 😊
`.trim(),

  EN: (d) => `
Hello ${d.name},

Here is your accommodation quote:

🛏️ Room type: ${d.room}
📅 Check-in: ${d.checkin}
📅 Check-out: ${d.checkout}
🌙 Nights: ${d.nights}
🏨 Rooms: ${d.rooms}
💶 Price per night: €${d.price}
💰 Total: €${d.total}

Let us know if you need anything 🙂
`.trim(),

  FR: (d) => `
Bonjour ${d.name},

Voici votre devis de séjour :

🛏️ Type de chambre: ${d.room}
📅 Arrivée: ${d.checkin}
📅 Départ: ${d.checkout}
🌙 Nuits: ${d.nights}
🏨 Chambres: ${d.rooms}
💶 Prix par nuit: ${d.price} €
💰 Total: ${d.total} €

Nous restons à votre disposition 😊
`.trim(),

  DE: (d) => `
Hallo ${d.name},

Hier ist Ihr Angebot:

🛏️ Zimmertyp: ${d.room}
📅 Anreise: ${d.checkin}
📅 Abreise: ${d.checkout}
🌙 Nächte: ${d.nights}
🏨 Zimmer: ${d.rooms}
💶 Preis pro Nacht: ${d.price} €
💰 Gesamt: ${d.total} €

Gerne helfen wir weiter 🙂
`.trim(),

  IT: (d) => `
Ciao ${d.name},

Ecco il preventivo del soggiorno:

🛏️ Tipo di camera: ${d.room}
📅 Arrivo: ${d.checkin}
📅 Partenza: ${d.checkout}
🌙 Notti: ${d.nights}
🏨 Camere: ${d.rooms}
💶 Prezzo per notte: ${d.price} €
💰 Totale: ${d.total} €

Restiamo a disposizione 😊
`.trim(),

  PT: (d) => `
Olá ${d.name},

Segue o orçamento da sua estadia:

🛏️ Tipo de quarto: ${d.room}
📅 Entrada: ${d.checkin}
📅 Saída: ${d.checkout}
🌙 Noites: ${d.nights}
🏨 Quartos: ${d.rooms}
💶 Preço por noite: ${d.price} €
💰 Total: ${d.total} €

Qualquer dúvida estamos à disposição 🙂
`.trim(),
};

/* =======================
   PAGE
======================= */

export default function BudgetPage() {
  const { setHeader } = useHeader();

  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [selectedRoomType, setSelectedRoomType] =
    useState<RoomType | null>(null);

  const [language, setLanguage] = useState<Language>("ES");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [rooms, setRooms] = useState(1);
  const [price, setPrice] = useState(0);

  /* =======================
     HEADER
  ======================= */

  useEffect(() => {
    setHeader({
      title: "Presupuesto",
      subtitle: "Enviar por WhatsApp",
      backHref: "/",
    });

    return () => setHeader({});
  }, [setHeader]);

  /* =======================
     DATA
  ======================= */

  useEffect(() => {
    fetch("/api/room-types")
      .then((r) => r.json())
      .then(setRoomTypes);
  }, []);

  /* =======================
     MESSAGE
  ======================= */

  const nights = diffNights(checkin, checkout);
  const total = Math.max(0, nights * rooms * price);

  const message = templates[language]({
    name: name || "-",
    room: selectedRoomType?.name ?? "-",
    checkin: formatDate(checkin),
    checkout: formatDate(checkout),
    nights,
    rooms,
    price,
    total,
  });

  const whatsappUrl =
    phone && name
      ? `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(
          message
        )}`
      : "#";

  const canSend = Boolean(phone && name);

  /* =======================
     RENDER
  ======================= */

  return (
    <div className="space-y-8 max-w-3xl mx-auto">

      {/* LANGUAGE */}
      <div className="flex gap-2">
        {(Object.keys(languageFlag) as Language[]).map((l) => (
          <button
            key={l}
            onClick={() => setLanguage(l)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
              language === l
                ? "bg-black text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {languageFlag[l]} {l}
          </button>
        ))}
      </div>

      {/* FORM */}
      <section className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
        <h2 className="text-sm font-semibold">Datos del cliente</h2>

        <input
          className="w-full rounded-xl border px-3 py-2 text-sm"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full rounded-xl border px-3 py-2 text-sm"
          placeholder="Teléfono (WhatsApp)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            className="rounded-xl border px-3 py-2 text-sm"
            value={checkin}
            onChange={(e) => setCheckin(e.target.value)}
          />

          <input
            type="date"
            className="rounded-xl border px-3 py-2 text-sm"
            value={checkout}
            onChange={(e) => setCheckout(e.target.value)}
          />
        </div>
      </section>

      {/* ROOM TYPES */}
      <section className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase px-1">
          Tipo de habitación
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {roomTypes.map((rt) => (
            <button
              key={rt.id}
              onClick={() => setSelectedRoomType(rt)}
              className={`p-3 rounded-xl text-sm font-medium transition active:scale-95 ${
                selectedRoomType?.id === rt.id
                  ? "bg-black text-white"
                  : "bg-white border hover:bg-gray-50"
              }`}
            >
              {rt.icon && <span className="mr-1">{rt.icon}</span>}
              {rt.name}
            </button>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
        <h2 className="text-sm font-semibold">Detalles</h2>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min={1}
            className="rounded-xl border px-3 py-2 text-sm"
            placeholder="Habitaciones"
            value={rooms}
            onChange={(e) => setRooms(Number(e.target.value))}
          />

          <input
            type="number"
            min={0}
            className="rounded-xl border px-3 py-2 text-sm"
            placeholder="Precio / noche €"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>
      </section>

      {/* PREVIEW */}
      <section className="bg-gray-100 rounded-2xl p-4 text-sm whitespace-pre-wrap">
        {message}
      </section>

      {/* ACTION */}
      <a
        href={whatsappUrl}
        target="_blank"
        className={`block text-center py-3 rounded-xl font-semibold transition active:scale-95 ${
          canSend
            ? "bg-green-500 text-white"
            : "bg-gray-300 text-gray-600 pointer-events-none"
        }`}
      >
        Enviar por WhatsApp
      </a>
    </div>
  );
}