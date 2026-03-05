"use client";

import Link from "next/link";

/*
  Home = pantalla raíz
  ❌ No setea header
  ❌ No limpia header
  ✅ Usa el branding por defecto
*/

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          👋 Bienvenido
        </h2>
        <p className="text-sm text-gray-600">
          Accesos rápidos para el trabajo diario del hotel
        </p>
      </section>

      {/* ACCIONES PRINCIPALES */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PrimaryAction
          href="/send"
          emoji="💬"
          title="Enviar mensaje"
          subtitle="WhatsApp manual"
          color="bg-green-600"
        />

        <PrimaryAction
          href="/translate"
          emoji="🌍"
          title="Traducciones"
          subtitle="Idiomas automáticos"
          color="bg-orange-500"
        />
      </section>

      {/* OPERATIVA */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">
          Operativa
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <DashboardCard
            href="/taxi"
            emoji="🚕"
            title="Solicitud de taxi"
            subtitle="Traslados de clientes"
          />

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
            subtitle="Mensajes guardados"
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
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">
          Configuración
        </h3>

        <div className="grid grid-cols-2 gap-4">
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
   COMPONENTES LOCALES
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
        "text-white rounded-2xl p-5 shadow-sm",
        "active:scale-95 transition-transform",
      ].join(" ")}
    >
      <div className="flex items-center gap-4">
        <div className="text-3xl leading-none">{emoji}</div>
        <div>
          <h3 className="font-semibold text-base leading-tight">
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
        "rounded-2xl p-4 h-full flex flex-col justify-between transition",
        "active:scale-95",
        admin
          ? "bg-blue-50 border border-blue-200 shadow-sm"
          : "bg-white shadow-sm",
      ].join(" ")}
    >
      <div className="flex items-start justify-between">
        <div className="text-2xl leading-none">{emoji}</div>

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