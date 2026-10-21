import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LockKeyhole } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { hasGuideAccess, safeGuideRedirect } from "@/lib/guide-access";

import { GuideAccessForm } from "./guide-access-form";

export const metadata: Metadata = {
  title: "Acceso privado",
  robots: { index: false, follow: false },
};

export default async function GuideAccessPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawNext = Array.isArray(params.next) ? params.next[0] : params.next;
  const next = safeGuideRedirect(rawNext);

  if (await hasGuideAccess()) {
    redirect(next);
  }

  const configured = Boolean(process.env.GUIDE_ACCESS_PASSWORD);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-16">
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Estantes", href: "/estantes" },
          { label: "Acceso privado" },
        ]}
      />

      <div className="mt-8 rounded-[2.5rem] border border-border bg-background p-6 shadow-sm md:p-10">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-mint">
          <LockKeyhole className="h-6 w-6 text-brand-ink" aria-hidden="true" />
        </div>
        <h1 className="mt-4 text-3xl font-extrabold text-brand-ink md:text-4xl">Acceso privado</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Esta guía está disponible únicamente en el entorno privado de demostración mientras se
          confirma la licencia de Semilleros de Sentido A.C.
        </p>

        <GuideAccessForm next={next} configured={configured} />
      </div>
    </div>
  );
}
