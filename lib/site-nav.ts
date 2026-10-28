export interface NavItem {
  label: string;
  href: string;
  kind?: "whatsapp";
}

export interface FooterColumn {
  title: string;
  items: NavItem[];
}

/** Navegación principal compartida entre header y footer. */
export const SITE_NAV: NavItem[] = [
  { label: "Libros", href: "/estantes" },
  { label: "Guías", href: "/guias" },
  { label: "Trazaurus", href: "/trazaurus" },
  { label: "Para escuelas", href: "/para-escuelas" },
  { label: "Nosotros", href: "/nosotros" },
];

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Libros",
    items: [
      { label: "Los diez estantes", href: "/estantes" },
      { label: "Trazaurus", href: "/trazaurus" },
      { label: "Guías", href: "/guias" },
    ],
  },
  {
    title: "Para escuelas",
    items: [
      { label: "Ferias", href: "/para-escuelas#ferias" },
      { label: "Acervos", href: "/para-escuelas#acervos" },
      { label: "Renta", href: "/para-escuelas#renta" },
      { label: "Equipamiento", href: "/para-escuelas#equipamiento" },
    ],
  },
  {
    title: "Ayuda",
    items: [
      { label: "Envíos", href: "/envios" },
      { label: "Devoluciones", href: "/devoluciones" },
      { label: "Factura", href: "/factura" },
      { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
      { label: "WhatsApp", href: "/para-escuelas", kind: "whatsapp" },
      { label: "Lo que esta casa promete", href: "/lo-que-esta-casa-promete" },
    ],
  },
  {
    title: "Lazox",
    items: [
      { label: "Nosotros", href: "/nosotros" },
      { label: "Qué es SILEE", href: "/que-es-silee" },
      {
        label: "El préstamo de libros para escuelas",
        href: "https://www.semillerosdesentido.org/",
      },
    ],
  },
];

export const LEGAL_NAV: NavItem[] = [
  { label: "Aviso de privacidad", href: "/privacidad" },
  { label: "Términos", href: "/terminos" },
];
