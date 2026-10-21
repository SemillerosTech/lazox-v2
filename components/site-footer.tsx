import Link from "next/link";
import { Music2 } from "lucide-react";

import { Logo } from "@/components/logo";
import { NewsletterForm } from "@/components/newsletter-form";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/social-icons";
import { FOOTER_NAV } from "@/lib/site-nav";

export function SiteFooter() {
  return (
    <footer className="bg-background">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3 md:items-center">
        <div>
          <Logo className="h-16 w-auto" />
          <p className="mt-1 text-sm">Jugar · Crear · Aprender · Crecer juntos</p>
        </div>
        <div>
          <p className="text-sm font-bold">Suscríbase a nuestra comunidad</p>
          <NewsletterForm />
        </div>
        <div className="md:text-right">
          <p className="text-sm font-bold">Síganos</p>
          <div className="mt-2 flex gap-4 md:justify-end">
            <a href="#" aria-label="Instagram" className="transition hover:text-brand-pink">
              <InstagramIcon className="h-6 w-6" />
            </a>
            <a href="#" aria-label="Facebook" className="transition hover:text-brand-pink">
              <FacebookIcon className="h-6 w-6" />
            </a>
            <a href="#" aria-label="YouTube" className="transition hover:text-brand-pink">
              <YoutubeIcon className="h-6 w-6" />
            </a>
            <a href="#" aria-label="TikTok" className="transition hover:text-brand-pink">
              <Music2 className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 text-xs font-semibold md:flex-row md:justify-between">
          <div className="flex flex-wrap gap-4">
            {FOOTER_NAV.map((item) =>
              item.href.startsWith("/") ? (
                <Link key={item.label} href={item.href} className="hover:text-brand-pink">
                  {item.label}
                </Link>
              ) : (
                <a key={item.label} href={item.href} className="hover:text-brand-pink">
                  {item.label}
                </a>
              ),
            )}
          </div>
          <div className="flex gap-4">
            <a href="#">Términos</a>
            <a href="#">Privacidad</a>
            <a href="#">Contacto</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
