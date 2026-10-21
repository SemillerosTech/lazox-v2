"use client";

import { useId, useState } from "react";
import { MessageCircle, X } from "lucide-react";

import { DemoBadge } from "@/components/demo-notice";
import { buttonClasses } from "@/lib/styles";
import { buildWhatsAppUrl, WHATSAPP_BOOK_MESSAGE, WHATSAPP_SAMPLE_REPLY } from "@/lib/whatsapp";

export function WhatsAppInquiry() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const url = buildWhatsAppUrl();

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses("whatsapp", "w-full")}
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" /> Preguntar por WhatsApp
      </a>
    );
  }

  return (
    <div>
      <button
        type="button"
        className={buttonClasses("whatsapp", "w-full")}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" /> Preguntar por WhatsApp
      </button>

      {open && (
        <div
          id={panelId}
          className="mt-3 rounded-2xl border border-border bg-background p-4 text-left shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <DemoBadge />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-brand-soft-pink"
              aria-label="Cerrar ejemplo de conversación"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <p className="mt-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Mensaje que se enviaría
          </p>
          <p className="mt-1 rounded-xl bg-brand-mint px-3 py-2 text-sm font-semibold text-brand-ink">
            {WHATSAPP_BOOK_MESSAGE}
          </p>
          <p className="mt-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Ejemplo de respuesta humana
          </p>
          <p className="mt-1 text-sm text-brand-ink">{WHATSAPP_SAMPLE_REPLY}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            El número oficial todavía no está disponible. No se enviará ningún mensaje.
          </p>
        </div>
      )}
    </div>
  );
}
