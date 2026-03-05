"use client";

import { useEffect, useState } from "react";
import { useHeader } from "@/components/HeaderContext";

type TaxiCompany = {
  id: string;
  name: string;
  phone: string;
};

const emptyCompany: Omit<TaxiCompany, "id"> = {
  name: "",
  phone: "",
};

export default function TaxiCompaniesPage() {
  const { setHeader } = useHeader();

  const [companies, setCompanies] = useState<TaxiCompany[]>([]);
  const [form, setForm] = useState(emptyCompany);
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState(false);

  /* =======================
     HEADER
  ======================= */

  useEffect(() => {
    setHeader({
      title: "Empresas de Taxi",
      subtitle: "Gestión de compañías",
      backHref: "/",
    });

    return () => setHeader({});
  }, [setHeader]);

  /* =======================
     DATA
  ======================= */

  const loadCompanies = async () => {
    try {
      const res = await fetch("/api/taxi-companies");
      const data = await res.json();
      setCompanies(Array.isArray(data) ? data : []);
    } catch {
      setCompanies([]);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  /* =======================
     ACTIONS
  ======================= */

  const createCompany = async () => {
    if (!form.name.trim() || !form.phone.trim()) return;

    setLoading(true);

    await fetch("/api/taxi-companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm(emptyCompany);
    setLoading(false);
    loadCompanies();

    setFlash(true);
    setTimeout(() => setFlash(false), 800);
  };

  const deleteCompany = async (id: string) => {
    if (!confirm("¿Eliminar esta empresa de taxi?")) return;

    await fetch(`/api/taxi-companies/${id}`, {
      method: "DELETE",
    });

    loadCompanies();
  };

  const openWhatsApp = (phone: string) => {
    const clean = phone.replace(/\D/g, "");
    if (!clean) return;
    window.open(`https://wa.me/${clean}`, "_blank");
  };

  /* =======================
     RENDER
  ======================= */

  return (
    <div className="space-y-8 max-w-3xl mx-auto">

      {/* FORM */}
      <section
        className={`rounded-2xl shadow-sm p-4 space-y-3 transition-colors duration-700 ${
          flash ? "bg-yellow-100" : "bg-white"
        }`}
      >
        <h2 className="text-sm font-semibold">
          Nueva empresa de taxi
        </h2>

        <input
          className="w-full rounded-xl border px-3 py-2 text-sm"
          placeholder="Nombre de la empresa"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="w-full rounded-xl border px-3 py-2 text-sm"
          placeholder="Teléfono"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <button
          onClick={createCompany}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold transition active:scale-95 disabled:opacity-50"
        >
          {loading ? "Guardando…" : "Crear empresa"}
        </button>
      </section>

      {/* LIST */}
      <section className="space-y-3">
        {companies.length === 0 && (
          <p className="text-sm text-gray-500 text-center">
            No hay empresas de taxi registradas
          </p>
        )}

        {companies.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl shadow-sm p-4 space-y-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🚕</span>
              <span className="font-semibold text-sm">
                {c.name}
              </span>
            </div>

            <p className="text-xs text-gray-500">
              {c.phone}
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => openWhatsApp(c.phone)}
                className="px-3 py-2 bg-green-500 text-white rounded-lg text-xs transition active:scale-95"
              >
                WhatsApp
              </button>

              <button
                onClick={() => deleteCompany(c.id)}
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