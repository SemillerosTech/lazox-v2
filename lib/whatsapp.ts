export const WHATSAPP_DEFAULT_MESSAGE = "Hola, tengo una pregunta.";

export const WHATSAPP_CONFIRMATION_MESSAGE =
  "Hola, conozco una escuela donde me gustaría que se leyera así.";

export const WHATSAPP_SCHOOL_MESSAGE =
  "Hola, escribo de una escuela. Me interesa una feria de libros.";

export const WHATSAPP_SCHOOL_OPTIONS = [
  { label: "Ferias", message: "Hola, escribo de una escuela. Me interesa una feria." },
  { label: "Acervos", message: "Hola, escribo de una escuela. Me interesa un acervo." },
  { label: "Renta", message: "Hola, escribo de una escuela. Me interesa la renta." },
  { label: "Equipamiento", message: "Hola, escribo de una escuela. Me interesa equipamiento." },
] as const;

export const WHATSAPP_SAMPLE_REPLY =
  "Con gusto. Es una historia sobre lo que se pierde y lo que todavía puede llegar después. Si quiere, le mando su guía para que la vea antes de decidir.";

export function getBookWhatsAppMessage(title: string): string {
  return `Hola, quiero preguntar por el libro ${title}.`;
}

export function getShelfWhatsAppMessage(name: string): string {
  return `Hola, busco un libro para un niño o una niña que ${name}.`;
}

export function getWhatsAppNumber(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim();
  if (!raw) return undefined;

  const digits = raw.replace(/\D/g, "");
  if (digits.length === 0) return undefined;
  if (digits.length === 10) return `52${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `52${digits}`;

  return digits;
}

export function buildWhatsAppUrl(message = WHATSAPP_DEFAULT_MESSAGE): string | undefined {
  const number = getWhatsAppNumber();
  if (!number) return undefined;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
