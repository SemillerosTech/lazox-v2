export interface NavItem {
  label: string;
  href: string;
}

/** Navegación principal compartida entre header y footer. */
export const SITE_NAV: NavItem[] = [
  { label: "Por edades", href: "/estantes" },
  { label: "Por experiencias", href: "/estantes" },
  { label: "Talleres y cursos", href: "#" },
  { label: "Recursos", href: "#" },
  { label: "Tienda", href: "/estantes" },
  { label: "Nosotros", href: "#" },
];

export const FOOTER_NAV: NavItem[] = [...SITE_NAV, { label: "Carrito", href: "/carrito" }];
