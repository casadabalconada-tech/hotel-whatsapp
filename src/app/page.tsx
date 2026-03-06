"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-12">

      {/* HERO */}
      <section className="rounded-2xl p-6 text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-sm">
        <h2 className="text-lg font-semibold mb-1">
          👋 Bienvenido
        </h2>

        <p className="text-sm opacity-90">
          Accesos rápidos para el trabajo diario del hotel
        </p>
      </section>

      {/* ACCIONES PRINCIPALES */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <PrimaryAction
          href="/send"
          emoji="💬"
          title="Enviar mensaje"
          subtitle="Mensaje frecuentes"
          color="bg-green-600"
        />

        <PrimaryAction
          href="/translate"
          emoji="🌍"
          title="Crear Traducciones"
          subtitle="Idiomas automáticos"
          color="bg-orange-500"
        />

      </section>

      {/* OPERATIVA */}
      <section className="space-y-3">

        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">
          Operativa
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

          <DashboardCard
            href="/contacts"
            emoji="👥"
            title="Contactos"
            subtitle="Gestión de huéspedes"
          />

          <DashboardCard
            href="/messages"
            emoji="📝"
            title="Plantillas"
            subtitle="Mensajes frecuentes"
          />

          <DashboardCard
            href="/taxi"
            emoji="🚕"
            title="Solicitud de taxi"
            subtitle="Traslados de clientes"
          />

          <DashboardCard
            href="/budget"
            emoji="💶"
            title="Generar presupuesto"
            subtitle="Enviar por WhatsApp"
          />

        </div>
      </section>

      {/* CONFIGURACIÓN */}
      <section className="space-y-3">

        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">
          Configuración
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

          <DashboardCard
            href="/admin/taxi-companies"
            emoji="🚖"
            title="Empresas de taxi"
            subtitle="Gestión de compañías"
            admin
          />

          <DashboardCard
            href="/admin/room-types"
            emoji="🛏️"
            title="Tipos de habitación"
            subtitle="Clasificación"
            admin
          />

          <DashboardCard
            href="/admin/signature"
            emoji="✍️"
            title="Firma automática"
            subtitle="Texto por defecto"
            admin
          />

        </div>
      </section>

    </div>
  );
}

/* =======================
   ACCIÓN PRINCIPAL
======================= */

function PrimaryAction({
  href,
  emoji,
  title,
  subtitle,
  color,
}: {
  href: string;
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className={[
        color,
        "text-white rounded-2xl p-6 shadow-md",
        "active:scale-95 hover:shadow-lg transition-all",
      ].join(" ")}
    >
      <div className="flex items-center gap-4">

        <div className="text-4xl">
          {emoji}
        </div>

        <div>
          <h3 className="font-semibold text-lg leading-tight">
            {title}
          </h3>

          <p className="text-sm opacity-90">
            {subtitle}
          </p>
        </div>

      </div>
    </Link>
  );
}

/* =======================
   CARD DASHBOARD
======================= */

function DashboardCard({
  href,
  emoji,
  title,
  subtitle,
  admin = false,
}: {
  href: string;
  emoji: string;
  title: string;
  subtitle: string;
  admin?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "rounded-2xl p-4 h-full flex flex-col justify-between",
        "transition-all duration-150",
        "active:scale-95",
        admin
          ? "bg-blue-50 border border-blue-200 shadow-sm hover:shadow-md"
          : "bg-white border border-gray-100 shadow-sm hover:shadow-md",
      ].join(" ")}
    >

      <div className="flex items-start justify-between">

        <div className="text-2xl">
          {emoji}
        </div>

        {admin && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-600 text-white">
            ADMIN
          </span>
        )}

      </div>

      <div className="mt-4">

        <p className="font-semibold text-sm leading-tight text-gray-900">
          {title}
        </p>

        <p className="text-xs text-gray-600 mt-0.5">
          {subtitle}
        </p>

      </div>

    </Link>
  );
}