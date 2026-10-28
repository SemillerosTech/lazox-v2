"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { WHATSAPP_DEFAULT_MESSAGE } from "@/lib/whatsapp";

interface WhatsAppContextValue {
  message: string;
  setMessage: (message: string) => void;
}

const WhatsAppContext = createContext<WhatsAppContextValue | null>(null);

export function WhatsAppProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState(WHATSAPP_DEFAULT_MESSAGE);

  const value = useMemo(() => ({ message, setMessage }), [message]);

  return <WhatsAppContext.Provider value={value}>{children}</WhatsAppContext.Provider>;
}

export function useWhatsApp(): WhatsAppContextValue {
  const context = useContext(WhatsAppContext);
  if (!context) {
    throw new Error("useWhatsApp debe usarse dentro de WhatsAppProvider.");
  }
  return context;
}

export function PageWhatsApp({ message }: { message: string }) {
  const { setMessage } = useWhatsApp();

  useEffect(() => {
    setMessage(message);
  }, [message, setMessage]);

  return null;
}
