"use client";

import { createContext, useContext, useState, ReactNode } from "react";

/* =======================
   TIPOS
======================= */

type HeaderData = {
  title?: string;
  subtitle?: string;
  backHref?: string;
};

type HeaderContextType = HeaderData & {
  appTitle: string;
  setHeader: (data: HeaderData) => void;
};

/* =======================
   CONSTANTES
======================= */

const APP_TITLE = "Hotel WhatsApp";

/* =======================
   CONTEXT
======================= */

const HeaderContext = createContext<HeaderContextType | null>(null);

/* =======================
   PROVIDER
======================= */

export function HeaderProvider({ children }: { children: ReactNode }) {
  // 🔒 Estado inicial vacío → SSR y cliente siempre coinciden
  const [header, setHeaderState] = useState<HeaderData>({});

  const setHeader = (data: HeaderData) => {
    setHeaderState({
      title: data.title,
      subtitle: data.subtitle,
      backHref: data.backHref,
    });
  };

  return (
    <HeaderContext.Provider
      value={{
        appTitle: APP_TITLE,
        ...header,
        setHeader,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
}

/* =======================
   HOOK
======================= */

export function useHeader() {
  const ctx = useContext(HeaderContext);
  if (!ctx) {
    throw new Error("useHeader must be used inside HeaderProvider");
  }
  return ctx;
}