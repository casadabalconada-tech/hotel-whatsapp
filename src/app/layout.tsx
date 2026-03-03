import "./globals.css";
import { HeaderProvider } from "@/components/HeaderContext";
import AppLayout from "@/components/AppLayout";
import type { Viewport } from "next";

export const metadata = {
  title: "Hotel WhatsApp",
  description: "Comunicación rápida con huéspedes",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Hotel WhatsApp",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className="bg-gray-100 min-h-screen"
        suppressHydrationWarning
      >
        <HeaderProvider>
          <AppLayout>
            {children}
          </AppLayout>
        </HeaderProvider>
      </body>
    </html>
  );
}