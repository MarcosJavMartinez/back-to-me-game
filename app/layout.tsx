import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Back to Me App",
  description: "A gentle habit game for returning to yourself, one small step at a time."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#BFE8F7"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="font-rounded text-ink antialiased">{children}</body>
    </html>
  );
}
