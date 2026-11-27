import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ButtonLink } from "@/components/button-link";
import { YoutubeIcon } from "@/components/social-icons";

export const metadata: Metadata = {
  title: "Trazaurus",
  description:
    "Una serie para aprender a leer y escribir. Consulte el acceso al material complementario de Trazaurus en Semilleros de Sentido.",
  robots: { index: false, follow: false },
};

// Recursos públicos consultados el 27 de noviembre de 2026.
const TRAZAURUS_PORTAL = "https://www.semillerosdesentido.org/trazaurus";
const SEMILLEROS_VIDEOS = "https://www.youtube.com/@semillerosdesentido";

export default function TrazaurusPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Trazaurus" }]} />

      <header className="mt-6 grid items-center gap-8 md:grid-cols-[1fr_320px]">
        <div>
          <h1 className="text-4xl font-extrabold text-brand-ink md:text-5xl">Trazaurus</h1>
          <p className="mt-4 text-xl font-semibold leading-relaxed text-brand-ink">
            Una serie para aprender a leer y escribir.
          </p>
        </div>
        <Image
          src="/images/trazaurus-logo.svg"
          alt="Logotipo de Trazaurus."
          width={1023}
          height={315}
          priority
          className="h-auto w-full max-w-xs"
        />
      </header>

      <section
        aria-labelledby="trazaurus-materials"
        className="mt-10 grid items-center gap-8 rounded-3xl bg-brand-yellow p-6 md:grid-cols-[1fr_240px] md:p-8"
      >
        <div>
          <h2 id="trazaurus-materials" className="text-3xl font-extrabold text-brand-ink">
            ¿Ya tiene un libro Trazaurus?
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-brand-ink">
            En el portal de Semilleros de Sentido encontrará el acceso al material complementario de
            su libro. Para consultarlo, allí le solicitarán su nombre, teléfono y correo
            electrónico.
          </p>
          <div className="mt-6">
            <ButtonLink href={TRAZAURUS_PORTAL} target="_blank" rel="noopener noreferrer">
              Acceder al material complementario
              <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="sr-only">(abre en otra pestaña)</span>
            </ButtonLink>
          </div>
          <p className="mt-3 text-sm text-brand-ink/80">
            El registro y la consulta se realizan en el sitio de Semilleros de Sentido.
          </p>
        </div>
        <Image
          src="/images/trazaurus-rino.png"
          alt="Dinosaurio amarillo de Trazaurus con un moño rosa."
          width={1272}
          height={1224}
          sizes="(min-width: 768px) 240px, 208px"
          className="mx-auto h-auto w-52 max-w-full md:w-full"
        />
      </section>

      <section
        hidden
        aria-labelledby="trazaurus-videos"
        className="mt-6 rounded-3xl border-2 border-border bg-background p-6 md:p-8"
      >
        <h2 id="trazaurus-videos" className="text-2xl font-extrabold text-brand-ink">
          Videos de Semilleros de Sentido
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
          Puede visitar también el canal de videos al que enlaza el portal de Trazaurus.
        </p>
        <div className="mt-5">
          <ButtonLink
            href={SEMILLEROS_VIDEOS}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
          >
            <YoutubeIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
            Visitar el canal
            <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="sr-only">(abre en otra pestaña)</span>
          </ButtonLink>
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/estantes" variant="outline">
          Ver los libros
        </ButtonLink>
        <ButtonLink href="/para-escuelas" variant="outline">
          Para escuelas
        </ButtonLink>
      </div>
    </div>
  );
}
