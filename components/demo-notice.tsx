import type { ReactNode } from "react";
import { FlaskConical } from "lucide-react";

export function DemoNotice({ children }: { children: ReactNode }) {
  return (
    <div
      role="note"
      className="flex items-start gap-3 rounded-2xl border border-brand-blue/25 bg-brand-blue/10 px-4 py-3 text-sm font-semibold text-brand-ink"
    >
      <FlaskConical className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}

export function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-primary-foreground">
      <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
      Demostración
    </span>
  );
}
