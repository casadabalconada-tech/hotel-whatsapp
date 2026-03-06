"use client";

import { ReactNode } from "react";
import { useHeader } from "@/components/HeaderContext";
import BottomNav from "@/components/BottomNav";

export default function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { title, backHref, appTitle } = useHeader();
  const pageTitle = title || appTitle;

  return (
    <div className="min-h-screen w-full bg-gray-50 flex">

      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex md:w-20 border-r bg-white">
        <BottomNav />
      </aside>

      {/* CONTENIDO */}
      <div className="flex flex-col flex-1 min-h-screen">

        {/* HEADER */}
        <header className="sticky top-0 z-30 bg-white border-b">
          <div className="mx-auto max-w-screen-md px-4 h-14 flex items-center justify-between">

            {/* IZQUIERDA */}
            <div className="flex items-center gap-3">

              {backHref ? (
                <a
                  href={backHref}
                  className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-gray-100 transition"
                >
                  ←
                </a>
              ) : (
                <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center text-white shadow-sm">
                  💬
                </div>
              )}

              <span className="text-sm font-semibold text-gray-900">
                {pageTitle}
              </span>

            </div>

            {/* DERECHA */}
            <a
              href="/send"
              className="text-xs font-medium bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition"
            >
              Nuevo mensaje
            </a>

          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 w-full mx-auto max-w-screen-md px-4 py-6 pb-24 md:pb-6">
          {children}
        </main>

      </div>

      {/* BOTTOM NAV SOLO EN MOBILE */}
      <div className="md:hidden">
        <BottomNav />
      </div>

    </div>
  );
}