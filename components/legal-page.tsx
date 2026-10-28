import { Breadcrumbs } from "@/components/breadcrumbs";

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  items?: string[];
};

/**
 * Plantilla de las páginas legales.
 *
 * El contenido es un borrador de trabajo: los campos entre corchetes los completa el equipo y
 * los revisa un abogado antes de la apertura de la tienda. Mientras sea borrador, el aviso
 * visible y el `noindex` se mantienen.
 */
export function LegalPage({
  title,
  breadcrumb,
  intro,
  updatedAt,
  sections,
}: {
  title: string;
  breadcrumb?: string;
  intro: string;
  updatedAt: string;
  sections: LegalSection[];
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: breadcrumb ?? title }]} />

      <header className="mt-6">
        <h1 className="text-4xl font-extrabold text-brand-ink md:text-5xl">{title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{intro}</p>
        <p className="mt-3 text-sm font-semibold text-muted-foreground">
          Última actualización: {updatedAt}
        </p>
      </header>

      <aside className="mt-8 rounded-2xl border-2 border-brand-yellow bg-brand-cream p-4 text-sm font-semibold text-brand-ink">
        Borrador de trabajo. Este documento todavía no ha sido revisado por un abogado. Su versión
        definitiva se publicará antes de la apertura de la tienda.
      </aside>

      <div className="mt-10 space-y-8">
        {sections.map((section, index) => (
          <section key={section.heading} aria-labelledby={`legal-${index}`}>
            <h2 id={`legal-${index}`} className="text-2xl font-extrabold text-brand-ink">
              {section.heading}
            </h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-base leading-relaxed text-brand-ink/80">
                {paragraph}
              </p>
            ))}
            {section.items && (
              <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-relaxed text-brand-ink/80">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
