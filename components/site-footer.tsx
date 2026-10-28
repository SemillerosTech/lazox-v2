import Link from "next/link";

import { Logo } from "@/components/logo";
import { WhatsAppInquiry } from "@/components/whatsapp-inquiry";
import { FOOTER_COLUMNS, LEGAL_NAV } from "@/lib/site-nav";

function FooterLink({ label, href }: { label: string; href: string }) {
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-brand-pink">
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className="hover:text-brand-pink">
      {label}
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="border-b border-border pb-8">
          <p className="max-w-xl text-sm font-semibold text-brand-ink">
            Lazox apoya el proyecto SILEE® de Semilleros de Sentido A.C.
          </p>
          <Logo className="mt-4 h-12 w-auto" />
        </div>

        <div className="grid gap-8 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {FOOTER_COLUMNS.map((column) => (
            <section key={column.title} aria-labelledby={`footer-${column.title}`}>
              <h2
                id={`footer-${column.title}`}
                className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-ink"
              >
                {column.title}
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {column.items.map((item) => (
                  <li key={item.label}>
                    {item.kind === "whatsapp" ? (
                      <WhatsAppInquiry
                        label={item.label}
                        showSampleReply={false}
                        containerClassName="inline-block"
                        className="text-left transition hover:text-brand-pink"
                        panelClassName="absolute bottom-full left-0 z-50 mb-2 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-border bg-background p-4 text-left shadow-2xl"
                      />
                    ) : (
                      <FooterLink label={item.label} href={item.href} />
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-6 text-xs font-semibold text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Lazox</p>
          <div className="flex flex-wrap gap-4">
            {LEGAL_NAV.map((item) => (
              <Link key={item.label} href={item.href} className="hover:text-brand-pink">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
