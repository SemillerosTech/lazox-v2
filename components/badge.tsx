import type { ReactNode } from "react";

type BadgeTone = "neutral" | "provisional" | "demo" | "private" | "success";

const tones: Record<BadgeTone, string> = {
  neutral: "border-border bg-background text-muted-foreground",
  provisional: "border-brand-yellow bg-brand-yellow/25 text-brand-ink",
  demo: "border-brand-blue/30 bg-brand-blue/10 text-brand-blue",
  private: "border-brand-ink/15 bg-brand-ink text-background",
  success: "border-brand-green/30 bg-brand-green/15 text-brand-green",
};

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: BadgeTone }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
