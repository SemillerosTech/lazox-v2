"use client";

import { useActionState } from "react";
import { LockKeyhole } from "lucide-react";

import { buttonClasses } from "@/lib/styles";

import { unlockGuide } from "./actions";

export function GuideAccessForm({ next, configured }: { next: string; configured: boolean }) {
  const [state, formAction, pending] = useActionState(unlockGuide, {});

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="guide-password" className="text-sm font-bold text-brand-ink">
          Contraseña de acceso
        </label>
        <input
          id="guide-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={!configured}
          className="mt-2 min-h-11 w-full rounded-2xl border-2 border-border bg-background px-4 py-2 text-brand-ink outline-none transition focus:border-brand-pink disabled:opacity-60"
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-xl bg-brand-red/10 px-3 py-2 text-sm font-semibold text-brand-red"
        >
          {state.error}
        </p>
      )}

      {!configured && (
        <p role="alert" className="rounded-xl bg-brand-yellow/30 px-3 py-2 text-sm text-brand-ink">
          Falta configurar <code className="font-bold">GUIDE_ACCESS_PASSWORD</code> en el entorno.
        </p>
      )}

      <button
        type="submit"
        disabled={!configured || pending}
        className={buttonClasses("primary", "w-full")}
      >
        <LockKeyhole className="h-4 w-4" aria-hidden="true" />
        {pending ? "Verificando…" : "Entrar a la guía"}
      </button>
    </form>
  );
}
