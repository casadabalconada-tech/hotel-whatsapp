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
    <div className="space-y-8">
      {/* HERO */}
      <section className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="text-base font-semibold mb-1">👋 Bienvenido</h2>
        <p className="text-sm text-gray-600">
          Accesos rápidos para el trabajo diario
        </p>
      </section>

      {/* ACCIONES PRINCIPALES */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PrimaryAction
          href="/send"
          emoji="💬"
          title="Enviar mensaje"
          subtitle="WhatsApp manual"
          color="bg-green-500"
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
        </div>
      </section>

      {/* CONFIGURACIÓN */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">
          Configuración
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <DashboardCard
            href="/admin/signature"
            emoji="✍️"
            title="Firma automática"
            subtitle="Texto por defecto"
          />
        </div>
      </section>
    </div>
  );
}

/* COMPONENTES LOCALES */

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
      className={`${color} text-white rounded-2xl p-5 shadow-sm active:scale-95 transition-transform`}
    >
      <div className="flex items-center gap-4">
        <div className="text-3xl">{emoji}</div>
        <div>
          <h3 className="font-semibold text-base">{title}</h3>
          <p className="text-sm opacity-90">{subtitle}</p>
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
}: {
  href: string;
  emoji: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl shadow-sm p-4 h-full flex flex-col justify-between hover:shadow-md active:scale-95 transition"
    >
      <div className="text-2xl">{emoji}</div>

      <div className="mt-4">
        <p className="font-semibold text-sm leading-tight">
          {title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {subtitle}
        </p>
      </div>
    </Link>
  );
}