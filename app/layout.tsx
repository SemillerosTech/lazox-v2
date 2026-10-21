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

export const metadata: Metadata = {
  title: {
    default: "LAZOX — Experiencias con sentido para crecer juntos",
    template: "%s | LAZOX",
  },
  description:
    "Talleres, cursos, libros y materiales para familias, escuelas, empresas y comunidades.",
  openGraph: {
    title: "LAZOX — Experiencias para crecer juntos",
    description: "Libros, talleres y recursos para jugar, crear, aprender y crecer juntos.",
    type: "website",
    locale: "es_MX",
  },
  twitter: {
    card: "summary_large_image",
    title: "LAZOX — Experiencias para crecer juntos",
    description: "Libros, talleres y recursos para jugar, crear, aprender y crecer juntos.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${baloo.variable} ${nunito.variable}`}>
      <body>{children}</body>
    </html>
  );
}
