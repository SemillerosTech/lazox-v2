export function formatPrice(amountInCents: number, currency = "MXN"): string {
  const formatted = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amountInCents / 100);

  return `${formatted} ${currency}`;
}

export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(isoDate));
}
