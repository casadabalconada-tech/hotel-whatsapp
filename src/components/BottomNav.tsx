"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Send,
  Users,
  MessagesSquare,
  Languages,
  Home,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/send", label: "Enviar", icon: Send },
  { href: "/contacts", label: "Contactos", icon: Users },
  { href: "/messages", label: "Mensajes", icon: MessagesSquare },
  { href: "/translate", label: "Idiomas", icon: Languages },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      role="navigation"
      aria-label="Navegación principal"
      className="fixed z-50 bg-white border-t bottom-0 left-0 right-0 md:top-0 md:left-0 md:right-auto md:h-screen md:w-20 md:border-t-0 md:border-r"
    >
      <div className="flex justify-around h-full md:flex-col md:justify-start md:gap-4 md:pt-6">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={[
                "flex flex-col items-center gap-1 py-2 px-3 text-xs transition-transform active:scale-90",
                active
                  ? "text-blue-600 font-semibold"
                  : "text-gray-500",
              ].join(" ")}
            >
              <Icon size={20} />
              <span className="md:hidden">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}