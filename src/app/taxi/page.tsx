"use client";

import { useEffect, useState } from "react";
import { useHeader } from "@/components/HeaderContext";

type TaxiCompany = {
  id: string;
  name: string;
  phone: string;
};

type Contact = {
  id: string;
  name: string;
  phone: string;
  status?: string;
  roomNumber?: string;
  language?: string;
};

/* =======================
   Helpers
======================= */
const renderWhatsAppPreview = (text: string) =>
  text.split("\n").map((line, i) => (
    <div key={i}>
      {line.split("*").map((part, j) =>
        j % 2 === 1 ? <strong key={j}>{part}</strong> : <span key={j}>{part}</span>
      )}
    </div>
  ));

const languageFlag = (lang?: string) => {
  switch (lang) {
    case "ES":
      return "🇪🇸";
    case "EN":
      return "🇬🇧";
    case "FR":
      return "🇫🇷";
    case "PT":
      return "🇵🇹";
    case "DE":
      return "🇩🇪";
    case "IT":
      return "🇮🇹";
    default:
      return "🌍";
  }
};

export default function TaxiPage() {
  const { setHeader } = useHeader();

  // =======================
  // listas
  // =======================
  const [companies, setCompanies] = useState<TaxiCompany[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  // =======================
  // formulario
  // =======================
  const [taxiCompanyId, setTaxiCompanyId] = useState("");
  const [contactId, setContactId] = useState("");

  const [day, setDay] = useState<"today" | "tomorrow" | "">("");
  const [time, setTime] = useState("");

  // 👇 VALORES PRE-CARGADOS
  const [origin, setOrigin] = useState("CASA DA BALCONADA");
  const [destination, setDestination] = useState("AEROPUERTO");

  const [passengers, setPassengers] = useState(1);

  // =======================
  // mensaje generado
  // =======================
  const [message, setMessage] = useState("");

  /* =======================
     HEADER
  ======================= */
  useEffect(() => {
    setHeader({
      title: "Solicitud de Taxi",
      subtitle: "Gestión de traslados",
      backHref: "/",
    });

    return () => setHeader({});
  }, [setHeader]);

  // =======================
  // cargar empresas y contactos
  // =======================
  useEffect(() => {
    fetch("/api/taxi-companies")
      .then((res) => res.json())
      .then(setCompanies);

    fetch("/api/contacts")
      .then((res) => res.json())
      .then(setContacts);
  }, []);

  // =======================
  // generar mensaje
  // =======================
  const generateMessage = () => {
    const company = companies.find((c) => c.id === taxiCompanyId);
    const contact = contacts.find((c) => c.id === contactId);

    if (!company || !contact || !day || !time) {
      alert("Completa todos los campos");
      return;
    }

    const d = new Date();
    if (day === "tomorrow") d.setDate(d.getDate() + 1);

    const [hh, mm] = time.split(":");
    d.setHours(Number(hh), Number(mm));

    const fecha = d.toLocaleDateString("es-ES");
    const hora = d.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const text = `
Hola ${company.name},

*SOLICITUD DE TAXI*

Origen: *${origin}*
Destino: *${destination}*

Fecha: *${fecha}*
Hora *${hora}*

*DATOS DEL CLIENTE*
Nombre: *${contact.name}*
${contact.phone}
    `.trim();

    setMessage(text);
  };

  // =======================
  // abrir WhatsApp empresa
  // =======================
  const openWhatsApp = () => {
    const company = companies.find((c) => c.id === taxiCompanyId);
    if (!company || !message) return;

    const phone = company.phone.replace(/\D/g, "");

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  // =======================
  // guardar solicitud
  // =======================
  const saveTaxiRequest = async () => {
    if (!message) return;

    const d = new Date();
    if (day === "tomorrow") d.setDate(d.getDate() + 1);
    const [hh, mm] = time.split(":");
    d.setHours(Number(hh), Number(mm));

    const res = await fetch("/api/taxi-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taxiCompanyId,
        contactId,
        date: d.toISOString(),
        origin,
        destination,
        passengers,
        message,
      }),
    });

    if (res.ok) {
      alert("✅ Solicitud guardada");
    }
  };

  const activeContacts = contacts.filter(
    (c) => c.status === "ACTUAL"
  );

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-40">

      {/* EMPRESA */}
      <section className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
        <label className="text-sm font-medium">Empresa de taxi</label>

        <div className="grid grid-cols-2 gap-2">
          {companies.map((c) => {
            const selected = taxiCompanyId === c.id;

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setTaxiCompanyId(selected ? "" : c.id)}
                className={`px-3 py-3 rounded-xl border text-sm font-medium transition
                  ${
                    selected
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-800 hover:bg-gray-50"
                  }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* CONTACTO */}
      <section className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
        <label className="text-sm font-medium">Contacto</label>

        <div className="grid grid-cols-3 gap-2">
          {activeContacts.map((c) => {
            const selected = contactId === c.id;

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setContactId(selected ? "" : c.id)}
                className={`p-3 rounded-xl border text-left transition
                  ${
                    selected
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-800 hover:bg-gray-50"
                  }`}
              >
                <div className="font-medium text-sm truncate">
                  {c.name}
                </div>

                <div className="flex items-center gap-1 mt-1 text-xs opacity-80">
                  {c.roomNumber && (
                    <span className="px-1.5 py-0.5 rounded bg-black/10">
                      🏨 {c.roomNumber}
                    </span>
                  )}
                  <span>{languageFlag(c.language)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* FECHA Y HORA */}
      <section className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
        <label className="text-sm font-medium">Fecha</label>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setDay(day === "today" ? "" : "today")}
            className={`py-3 rounded-xl border font-medium
              ${day === "today" ? "bg-primary text-white" : "bg-white"}`}
          >
            Hoy
          </button>

          <button
            type="button"
            onClick={() => setDay(day === "tomorrow" ? "" : "tomorrow")}
            className={`py-3 rounded-xl border font-medium
              ${day === "tomorrow" ? "bg-primary text-white" : "bg-white"}`}
          >
            Mañana
          </button>
        </div>

        <label className="text-sm font-medium">Hora</label>

        {/* HORAS RÁPIDAS */}
        <div className="grid grid-cols-4 gap-2">
          {["04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30"].map((h) => {
            const selected = time === h;

            return (
              <button
                key={h}
                type="button"
                onClick={() => setTime(h)}
                className={`py-2 rounded-xl border text-sm font-medium transition
                  ${
                    selected
                      ? "bg-primary text-white border-primary"
                      : "bg-white hover:bg-gray-50"
                  }`}
              >
                ⏰ {h}
              </button>
            );
          })}
        </div>

        <input
          type="time"
          className="w-full rounded-xl border px-3 py-3 text-base"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </section>

      {/* DETALLES */}
      <section className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
        <input
          placeholder="Origen"
          className="w-full rounded-xl border px-3 py-3 text-base"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />

        {/* DESTINO RÁPIDO */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "✈️ AEROPUERTO", value: "AEROPUERTO" },
            { label: "🚌 ESTACIÓN BUS", value: "ESTACIÓN BUS" },
            { label: "🚆 ESTACIÓN TREN", value: "ESTACIÓN TREN" },
          ].map((d) => {
            const selected = destination === d.value;

            return (
              <button
                key={d.value}
                type="button"
                onClick={() => setDestination(d.value)}
                className={`py-2 rounded-xl border text-sm font-medium transition
                  ${
                    selected
                      ? "bg-primary text-white border-primary"
                      : "bg-white hover:bg-gray-50"
                  }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>

        <input
          placeholder="Destino"
          className="w-full rounded-xl border px-3 py-3 text-base"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />

        <input
          type="number"
          min={1}
          className="w-full rounded-xl border px-3 py-3 text-base"
          value={passengers}
          onChange={(e) => setPassengers(Number(e.target.value))}
        />
      </section>

      {/* ACCIONES */}
      <section className="space-y-3">
        <button
          onClick={generateMessage}
          className="w-full py-4 rounded-2xl bg-primary text-white font-semibold"
        >
          ✍️ Generar mensaje
        </button>

        <button
          onClick={saveTaxiRequest}
          disabled={!message}
          className="w-full py-4 rounded-2xl bg-primary-soft text-primary font-semibold disabled:opacity-50"
        >
          💾 Guardar solicitud
        </button>
      </section>

      {/* PREVIEW */}
      {message && (
        <section className="space-y-2">
          <p className="text-sm text-gray-500">Vista previa (WhatsApp)</p>
          <div className="bg-[#ece5dd] rounded-2xl p-4">
            <div className="ml-auto max-w-[85%] bg-[#dcf8c6] p-3 rounded-2xl rounded-br-sm shadow text-sm">
              {renderWhatsAppPreview(message)}
            </div>
          </div>
        </section>
      )}

      {/* ENVIAR WHATSAPP */}
      <button
        onClick={openWhatsApp}
        disabled={!message || !taxiCompanyId}
        className="w-full py-4 rounded-2xl bg-[#25D366] text-white font-semibold disabled:opacity-50"
      >
        📱 Enviar por WhatsApp
      </button>
    </div>
  );
}