import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";

import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-baloo",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

/**
 * Dominio del sitio. Se toma de NEXT_PUBLIC_SITE_URL; si falta o no es una URL válida,
 * se usa localhost para que el build no falle.
 */
function resolveMetadataBase(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  try {
    return new URL(raw || "http://localhost:3000");
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: {
    default: "Lazox · Un libro para lo que le está pasando",
    template: "%s | Lazox",
  },
  description: "Cada uno viene con preguntas para conversarlo en casa.",
  openGraph: {
    title: "Lazox · Un libro para lo que le está pasando",
    description: "Cada uno viene con preguntas para conversarlo en casa.",
    type: "website",
    locale: "es_MX",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lazox · Un libro para lo que le está pasando",
    description: "Cada uno viene con preguntas para conversarlo en casa.",
  },
  // Borrador: se retira el día que la tienda abra en lazox.com.
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${baloo.variable} ${nunito.variable}`}>
      <body>{children}</body>
    </html>
  );
}
