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
    { media: "(prefers-color-scheme: light)", color: "#faf7f2" },
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
        className="min-h-screen"
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