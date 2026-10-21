export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "whatsapp";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-pink text-primary-foreground hover:brightness-110 focus-visible:outline-brand-pink",
  secondary:
    "bg-brand-yellow text-brand-ink hover:brightness-105 focus-visible:outline-brand-yellow",
  outline:
    "border-2 border-brand-pink bg-background text-brand-pink hover:bg-brand-soft-pink focus-visible:outline-brand-pink",
  ghost: "text-brand-pink hover:bg-brand-soft-pink focus-visible:outline-brand-pink",
  whatsapp:
    "bg-brand-green text-primary-foreground hover:brightness-110 focus-visible:outline-brand-green",
};

export function buttonClasses(variant: ButtonVariant = "primary", extra = ""): string {
  return `${base} ${variants[variant]} ${extra}`.trim();
}
