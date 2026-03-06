"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Send,
  Users,
  MessagesSquare,
  Languages,
  Home,
  Plus,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/contacts", label: "Contactos", icon: Users },
  { href: "/messages", label: "Plantillas", icon: MessagesSquare },
  { href: "/translate", label: "Traducir", icon: Languages },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-sm md:static md:border-none md:w-full">

      <div className="flex items-center justify-around md:flex-col md:items-center md:gap-4 md:pt-6">

        {/* LEFT ITEMS */}
        {NAV_ITEMS.slice(0, 2).map(({ href, label, icon: Icon }) => {
          const active = isActive(href);

          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center justify-center gap-1 py-2 px-3 text-xs transition"
            >
              <div
                className={
                  active
                    ? "flex items-center justify-center w-10 h-10 rounded-xl bg-green-100 text-green-600"
                    : "flex items-center justify-center w-10 h-10 rounded-xl text-gray-500 hover:bg-gray-100"
                }
              >
                <Icon size={20} />
              </div>

              <span className={active ? "md:hidden text-green-600 font-semibold" : "md:hidden"}>
                {label}
              </span>
            </Link>
          );
        })}

        {/* FAB SEND BUTTON */}

        <Link
          href="/send"
          className="relative -top-5 md:top-0 flex items-center justify-center"
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 transition active:scale-95">
            <Plus size={26} />
          </div>
        </Link>

        {/* RIGHT ITEMS */}
        {NAV_ITEMS.slice(2).map(({ href, label, icon: Icon }) => {
          const active = isActive(href);

          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center justify-center gap-1 py-2 px-3 text-xs transition"
            >
              <div
                className={
                  active
                    ? "flex items-center justify-center w-10 h-10 rounded-xl bg-green-100 text-green-600"
                    : "flex items-center justify-center w-10 h-10 rounded-xl text-gray-500 hover:bg-gray-100"
                }
              >
                <Icon size={20} />
              </div>

              <span className={active ? "md:hidden text-green-600 font-semibold" : "md:hidden"}>
                {label}
              </span>
            </Link>
          );
        })}

      </div>
    </nav>
  );
}