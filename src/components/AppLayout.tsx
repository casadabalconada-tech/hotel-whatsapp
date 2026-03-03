"use client";

import { ReactNode } from "react";
import { useHeader } from "@/components/HeaderContext";
import BottomNav from "@/components/BottomNav";

export default function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { title, subtitle, backHref, appTitle } = useHeader();

  const showContextHeader =
    !!backHref ||
    (!!title && title !== appTitle) ||
    !!subtitle;

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white border-b safe-top">
        <div className="mx-auto max-w-screen-md px-4 pt-3 pb-3 space-y-2">
          {/* BRANDING */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center text-white text-sm">
              💬
            </div>

            <span className="text-sm font-semibold tracking-wide text-gray-900">
              {appTitle}
            </span>
          </div>

          {/* CONTEXTO DE PANTALLA */}
          {showContextHeader && (
            <div className="flex items-start gap-3">
              {backHref && (
                <a
                  href={backHref}
                  aria-label="Volver"
                  className="mt-0.5 text-blue-600 text-lg active:scale-90 transition"
                >
                  ←
                </a>
              )}

              {(title || subtitle) && (
                <div className="leading-tight">
                  {title && title !== appTitle && (
                    <h1 className="text-lg font-semibold text-gray-900">
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="text-sm text-gray-500">
                      {subtitle}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="flex-1 w-full mx-auto max-w-screen-md px-4 py-4 pb-24">
        {children}
      </main>

      {/* NAVEGACIÓN */}
      <BottomNav />
    </div>
  );
}