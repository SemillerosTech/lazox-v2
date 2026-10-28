"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { CheckCircle2, Download, Mail, MessageCircle, Receipt } from "lucide-react";

import { ButtonLink } from "@/components/button-link";
import { DemoBadge, DemoNotice } from "@/components/demo-notice";
import { EmptyState } from "@/components/empty-state";
import { OrderSummary } from "@/components/order-summary";
import { WhatsAppInquiry } from "@/components/whatsapp-inquiry";
import {
  getDemoOrderServerSnapshot,
  getDemoOrderSnapshot,
  saveDemoOrder,
  subscribeToDemoOrder,
} from "@/lib/cart/demo-order";
import { formatDate } from "@/lib/format";
import type { DemoOrder } from "@/lib/types";
import { WHATSAPP_CONFIRMATION_MESSAGE } from "@/lib/whatsapp";
import { PageWhatsApp } from "@/lib/whatsapp-context";

const REFERRAL_OPTIONS = [
  "Me lo recomendó otra familia",
  "En una feria en la escuela",
  "Buscando en internet",
  "En redes sociales",
  "Otra",
];

const BOX_ITEMS = [
  "El libro.",
  "La guía impresa: el mismo contenido de la descarga, en buen papel.",
  "La tarjeta del buen vecino: el libro que va al lado, y por qué.",
  "La tarjeta «Lo que dijo»: un lugar para anotar, con fecha, lo que dijo su hijo después de leer.",
];

export function OrderConfirmation() {
  const order: DemoOrder | null | undefined = useSyncExternalStore(
    subscribeToDemoOrder,
    getDemoOrderSnapshot,
    getDemoOrderServerSnapshot,
  );
  const [referral, setReferral] = useState<string | null>(null);

  if (order === undefined) {
    return (
      <div className="mx-auto max-w-5xl animate-pulse px-4 py-10 md:py-14">
        <PageWhatsApp message={WHATSAPP_CONFIRMATION_MESSAGE} />
        <div className="h-10 w-72 rounded bg-border" />
        <div className="mt-8 h-72 rounded-3xl bg-border/70" />
      </div>
    );
  }

  if (order === null) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 md:py-16">
        <PageWhatsApp message={WHATSAPP_CONFIRMATION_MESSAGE} />
        <h1 className="text-4xl font-extrabold text-brand-ink md:text-5xl">
          Confirmación de demostración
        </h1>
        <div className="mt-8">
          <EmptyState
            title="No encontramos una orden en esta sesión"
            description="La confirmación de demostración solo está disponible después de completar la compra simulada."
          >
            <ButtonLink href="/estantes">Ver los libros</ButtonLink>
            <ButtonLink href="/carrito" variant="outline">
              Ver carrito
            </ButtonLink>
          </EmptyState>
        </div>
      </div>
    );
  }

  const currentOrder = order;
  const guideSlug = currentOrder.items[0]?.bookSlug ?? "inseparables";
  const invoiceUrl = process.env.NEXT_PUBLIC_SHOPIFY_INVOICE_URL || "/factura";

  function chooseReferral(option: string) {
    setReferral(option);
    saveDemoOrder({ ...currentOrder, referralSource: option });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <PageWhatsApp message={WHATSAPP_CONFIRMATION_MESSAGE} />
      <DemoNotice>
        Demostración: no se realizará ningún cargo ni se generará un pedido real. Tampoco se envió
        ninguna comunicación.
      </DemoNotice>

      <header className="mt-8 text-center" data-tour="order-confirmation">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-green/15">
          <CheckCircle2 className="h-9 w-9 text-brand-green" aria-hidden="true" />
        </div>
        <h1 className="mt-4 text-4xl font-extrabold text-brand-ink md:text-5xl">
          Gracias. Su libro va en camino.
        </h1>
        <p className="mt-2 text-sm font-bold text-muted-foreground">
          Pedido de demostración {order.id} · {formatDate(order.createdAt)}
        </p>
      </header>

      <section
        aria-labelledby="gift-first-title"
        className="mt-8 rounded-3xl bg-brand-yellow p-6 md:p-8"
      >
        <h2 id="gift-first-title" className="sr-only">
          Su guía y su factura
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <ButtonLink href={`/guias/${guideSlug}`}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Abrir la guía
          </ButtonLink>
          <Link
            href={invoiceUrl}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 border-brand-ink/20 px-5 text-sm font-bold text-brand-ink transition hover:border-brand-ink"
          >
            <Receipt className="h-4 w-4" aria-hidden="true" />
            Solicitar factura
          </Link>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="space-y-6">
          <OrderSummary lines={order.items} subtotal={order.subtotal} title="Lo que pidió" />

          <section
            aria-labelledby="referral-title"
            className="rounded-3xl border border-border bg-background p-6"
          >
            <h2 id="referral-title" className="font-display text-2xl font-extrabold text-brand-ink">
              ¿Cómo nos conoció?
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">Se puede dejar sin contestar.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {REFERRAL_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => chooseReferral(option)}
                  aria-pressed={referral === option}
                  className={`min-h-11 rounded-full border-2 px-4 py-2 text-sm font-bold transition ${
                    referral === option
                      ? "border-brand-pink bg-brand-soft-pink text-brand-ink"
                      : "border-border bg-background text-brand-ink hover:border-brand-pink"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="email-demo-title"
            className="rounded-3xl border border-border bg-background p-6"
          >
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-brand-blue" aria-hidden="true" />
              <h2
                id="email-demo-title"
                className="font-display text-2xl font-extrabold text-brand-ink"
              >
                Correo de confirmación
              </h2>
              <DemoBadge />
            </div>
            <div className="mt-4 rounded-2xl bg-brand-cream p-4 text-sm text-brand-ink">
              <p className="font-bold">Asunto: Gracias. Su libro va en camino.</p>
              <p className="mt-2">
                Hola {order.customer.name.split(" ")[0] || "familia"}: su pedido {order.id} está
                confirmado.
              </p>
              <p className="mt-2 font-bold">Abrir la guía · Solicitar factura</p>
              <p className="mt-2">
                Después encontrará el resumen del pedido, lo que recibirá y la pregunta «¿Cómo nos
                conoció?».
              </p>
              <p className="mt-2">
                Al final, la invitación a escuelas: ¿Conoce una escuela donde le gustaría que se
                leyera así? Si quiere, cuéntenos por WhatsApp y le escribimos para platicar. Es
                opcional y no cambia nada de su pedido.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Ejemplo visual. No se envió ningún correo a {order.customer.email}.
              </p>
            </div>
          </section>

          <section
            aria-labelledby="whatsapp-demo-title"
            className="rounded-3xl border border-border bg-background p-6"
          >
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-brand-green" aria-hidden="true" />
              <h2
                id="whatsapp-demo-title"
                className="font-display text-2xl font-extrabold text-brand-ink"
              >
                Confirmación por WhatsApp
              </h2>
              <DemoBadge />
            </div>
            <div className="mt-4 rounded-2xl bg-brand-mint p-4 text-sm text-brand-ink">
              <p className="font-bold">Mensaje de ejemplo</p>
              <p className="mt-2">
                Su pedido de demostración {order.id} está confirmado. Aquí recibirá el resumen y el
                enlace a su guía.
              </p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Ejemplo visual. El número oficial todavía no está disponible y no se envió ningún
              mensaje.
            </p>
          </section>

          <section
            aria-labelledby="school-invite-title"
            className="rounded-3xl border-2 border-border bg-background p-6"
          >
            <h2
              id="school-invite-title"
              className="text-lg font-semibold leading-relaxed text-brand-ink"
            >
              ¿Conoce una escuela donde le gustaría que se leyera así? Si quiere, cuéntenos por
              WhatsApp y le escribimos para platicar. Es opcional y no cambia nada de su pedido.
            </h2>
            <div className="mt-4">
              <WhatsAppInquiry
                message={WHATSAPP_CONFIRMATION_MESSAGE}
                label="Contarles por WhatsApp"
                showSampleReply={false}
              />
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/pedido/caja-demo">Ver la caja</ButtonLink>
            <Link
              href="/estantes"
              className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-bold text-brand-pink hover:underline"
            >
              Seguir explorando
            </Link>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="rounded-3xl bg-brand-yellow p-6">
            <h2 className="font-display text-2xl font-extrabold text-brand-ink">Lo que recibirá</h2>
            <ul className="mt-3 space-y-2 text-sm font-semibold text-brand-ink">
              {BOX_ITEMS.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
