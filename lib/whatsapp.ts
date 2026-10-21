export const WHATSAPP_BOOK_MESSAGE = "Hola, quiero preguntar por el libro Inseparables.";

export const WHATSAPP_SAMPLE_REPLY =
  "Con gusto. Es una historia sobre lo que se pierde y lo que todavía puede llegar después. Si quiere, le mando su guía para que la vea antes de decidir.";

export function getWhatsAppNumber(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim();
  if (!raw) return undefined;

  const digits = raw.replace(/\D/g, "");
  return digits.length > 0 ? digits : undefined;
}

export function buildWhatsAppUrl(message = WHATSAPP_BOOK_MESSAGE): string | undefined {
  const number = getWhatsAppNumber();
  if (!number) return undefined;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
