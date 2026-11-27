import Link from "next/link";

import { Logo } from "@/components/logo";
import { NotFoundContent } from "@/components/not-found-content";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-cream">
      <header className="mx-auto w-full max-w-7xl px-4 py-4">
        <Link href="/" aria-label="Lazox — Inicio" className="inline-block">
          <Logo priority />
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center">
        <NotFoundContent />
      </main>
    </div>
  );
}
