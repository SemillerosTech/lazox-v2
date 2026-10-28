"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { useWhatsApp } from "@/lib/whatsapp-context";
import { WHATSAPP_DEFAULT_MESSAGE } from "@/lib/whatsapp";

/**
 * Vuelve al mensaje general al cambiar de pantalla. Las páginas con un
 * mensaje propio montan su PageWhatsApp después y lo sobrescriben.
 */
export function DefaultWhatsApp() {
  const pathname = usePathname();
  const { setMessage } = useWhatsApp();

  useEffect(() => {
    setMessage(WHATSAPP_DEFAULT_MESSAGE);
  }, [pathname, setMessage]);

  return null;
}
