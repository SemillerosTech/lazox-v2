"use client";

import { LockKeyhole, RotateCcw, X } from "lucide-react";

import type { DemoTourNoticeState } from "./demo-tour.types";

export function DemoTourNotice({
  notice,
  stepNumber,
  totalSteps,
  onExit,
  onRetry,
  onSkipGuide,
}: {
  notice: DemoTourNoticeState;
  stepNumber: number;
  totalSteps: number;
  onExit: () => void;
  onRetry: () => void;
  onSkipGuide: () => void;
}) {
  const isAccess = notice.kind === "access";

  return (
    <section
      role={isAccess ? "status" : "alert"}
      aria-live={isAccess ? "polite" : "assertive"}
      data-demo-tour-notice={notice.kind}
      data-demo-tour-step={stepNumber}
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-3xl border-2 border-brand-ink/10 bg-background p-5 shadow-2xl sm:bottom-6 sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-mint">
            {isAccess ? (
              <LockKeyhole className="h-4 w-4 text-brand-ink" aria-hidden="true" />
            ) : (
              <RotateCcw className="h-4 w-4 text-brand-ink" aria-hidden="true" />
            )}
          </span>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground">
            Recorrido de muestra · {stepNumber} de {totalSteps}
          </p>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-brand-soft-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
          aria-label="Salir del recorrido"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <h2 className="mt-3 font-display text-2xl font-extrabold leading-tight text-brand-ink">
        {notice.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-brand-ink">{notice.description}</p>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row-reverse sm:justify-start">
        {notice.canRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-pink px-4 py-2 text-sm font-extrabold text-primary-foreground transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
          >
            Reintentar paso
          </button>
        )}
        {notice.canSkipGuide && (
          <button
            type="button"
            onClick={onSkipGuide}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-pink px-4 py-2 text-sm font-extrabold text-primary-foreground transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
          >
            Continuar sin la guía
          </button>
        )}
        <button
          type="button"
          onClick={onExit}
          className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-border px-4 py-2 text-sm font-extrabold text-brand-ink transition hover:border-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
        >
          Salir del recorrido
        </button>
      </div>
    </section>
  );
}
