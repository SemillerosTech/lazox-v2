"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { CheckCircle2, Mail, MessageCircle } from "lucide-react";

import { Badge } from "@/components/badge";
import { ButtonLink } from "@/components/button-link";
import { DemoBadge, DemoNotice } from "@/components/demo-notice";
import { EmptyState } from "@/components/empty-state";
import { OrderSummary } from "@/components/order-summary";
import {
  getDemoOrderServerSnapshot,
  getDemoOrderSnapshot,
  subscribeToDemoOrder,
} from "@/lib/cart/demo-order";
import { formatDate } from "@/lib/format";
import type { DemoOrder } from "@/lib/types";

export function OrderConfirmation() {
  const order: DemoOrder | null | undefined = useSyncExternalStore(
    subscribeToDemoOrder,
    getDemoOrderSnapshot,
    getDemoOrderServerSnapshot,
  );

  if (order === undefined) {
    return (
      <div className="mx-auto max-w-5xl animate-pulse px-4 py-10 md:py-14">
        <div className="h-10 w-72 rounded bg-border" />
        <div className="mt-8 h-72 rounded-3xl bg-border/70" />
      </div>
    );
  }

  if (order === null) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 md:py-16">
        <h1 className="text-4xl font-extrabold text-brand-ink md:text-5xl">
          Confirmación de demostración
        </h1>
        <div className="mt-8">
          <EmptyState
            title="No encontramos una orden en esta sesión"
            description="La confirmación de demostración solo está disponible después de completar la compra simulada."
          >
            <ButtonLink href="/libros/inseparables">Conocer Inseparables</ButtonLink>
            <ButtonLink href="/carrito" variant="outline">
              Ver carrito
            </ButtonLink>
          </EmptyState>
        </div>
      </div>
    );
  }

  const guideSlug = "inseparables";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <DemoNotice>
        Demostración: no se realizará ningún cargo ni se generará un pedido real. Tampoco se envió
        ninguna comunicación.
      </DemoNotice>

      <header className="mt-8 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-green/15">
          <CheckCircle2 className="h-9 w-9 text-brand-green" aria-hidden="true" />
        </div>
        <h1 className="mt-4 text-4xl font-extrabold text-brand-ink md:text-5xl">
          Su pedido está confirmado
        </h1>
        <p className="mt-2 text-sm font-bold text-muted-foreground">
          Pedido de demostración {order.id} · {formatDate(order.createdAt)}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Este es el recorrido que verá al integrar Shopify. Por ahora, todo es una simulación.
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="space-y-6">
          <OrderSummary lines={order.items} subtotal={order.subtotal} title="Lo que pidió" />

          <section
            aria-labelledby="guide-link-title"
            className="rounded-3xl border border-border bg-background p-6"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="private">Acceso privado</Badge>
              <DemoBadge />
            </div>
            <h2
              id="guide-link-title"
              className="mt-3 font-display text-2xl font-extrabold text-brand-ink"
            >
              Su guía para conversar
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              La guía de Inseparables está disponible solo en el entorno privado mientras se
              confirma la licencia.
            </p>
            <div className="mt-4">
              <ButtonLink href={`/guias/${guideSlug}`} variant="outline">
                Abrir la guía privada
              </ButtonLink>
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
              <p className="font-bold">Asunto: Su pedido de demostración está confirmado</p>
              <p className="mt-2">
                Hola {order.customer.name.split(" ")[0] || "familia"}: este es un ejemplo del correo
                que recibirá. Incluiría el resumen de Inseparables, su guía y los datos de entrega.
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
                Su pedido de demostración {order.id} está confirmado. En la versión final recibirá
                aquí el resumen y el enlace a su guía.
              </p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Ejemplo visual. El número oficial todavía no está disponible y no se envió ningún
              mensaje.
            </p>
          </section>

          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/pedido/caja-demo">Ver la caja de Inseparables</ButtonLink>
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
              <li>· El libro Inseparables</li>
              <li>· La tarjeta impresa del libro</li>
              <li>· La tarjeta del buen vecino (pendiente de definición)</li>
              <li>· La tarjeta «lo que dijo»</li>
            </ul>
            <p className="mt-4 text-xs text-brand-ink/70">
              Representación conceptual de la caja. Las imágenes oficiales aún no están disponibles.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
