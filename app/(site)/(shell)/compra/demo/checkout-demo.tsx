"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, Landmark, Receipt, Store, Wallet } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ButtonLink } from "@/components/button-link";
import { DemoNotice } from "@/components/demo-notice";
import { EmptyState } from "@/components/empty-state";
import { OrderSummary } from "@/components/order-summary";
import { useCart } from "@/lib/cart/cart-context";
import { createDemoOrder, saveDemoOrder } from "@/lib/cart/demo-order";
import type { DemoOrder } from "@/lib/types";

const labelClasses = "text-sm font-bold text-brand-ink";
const fieldClasses =
  "mt-1.5 min-h-11 w-full rounded-2xl border-2 border-border bg-background px-4 py-2 text-brand-ink outline-none transition focus:border-brand-pink";

const PAYMENT_METHODS: Array<{
  value: NonNullable<DemoOrder["paymentMethod"]>;
  label: string;
  description: string;
  icon: typeof CreditCard;
}> = [
  {
    value: "card",
    label: "Tarjeta",
    description: "Débito o crédito.",
    icon: CreditCard,
  },
  {
    value: "wallet",
    label: "Billeteras digitales",
    description: "Apple Pay o Google Pay.",
    icon: Wallet,
  },
  {
    value: "oxxo",
    label: "OXXO",
    description: "Pago en tienda.",
    icon: Store,
  },
  {
    value: "transfer",
    label: "Transferencia",
    description: "Transferencia bancaria.",
    icon: Landmark,
  },
];

export function CheckoutDemo() {
  const { items, subtotal, isHydrated, clear } = useCart();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const invoiceUrl = process.env.NEXT_PUBLIC_SHOPIFY_INVOICE_URL || "/factura";

  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-7xl animate-pulse px-4 py-10 md:py-14">
        <div className="h-10 w-64 rounded bg-border" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="h-96 rounded-3xl bg-border/70" />
          <div className="h-72 rounded-3xl bg-border/70" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 md:py-16">
        <h1 className="text-4xl font-extrabold text-brand-ink md:text-5xl">
          Compra de demostración
        </h1>
        <div className="mt-8">
          <EmptyState
            title="No hay productos para comprar"
            description="Agregue un libro al carrito para recorrer la compra simulada."
          >
            <ButtonLink href="/estantes">Ver los libros</ButtonLink>
          </EmptyState>
        </div>
      </div>
    );
  }

  const summaryLines = items.map((item) => ({
    bookSlug: item.book.slug,
    title: item.book.title,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    priceOption: item.priceOption,
  }));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const customer = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      address: String(formData.get("address") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      state: String(formData.get("state") ?? "").trim(),
      postalCode: String(formData.get("postalCode") ?? "").trim(),
    };

    if (
      !customer.name ||
      !customer.email ||
      !customer.address ||
      !customer.city ||
      !customer.state ||
      !customer.postalCode
    ) {
      setError("Complete los datos de contacto y entrega para continuar.");
      return;
    }

    const paymentMethod = String(
      formData.get("paymentMethod") ?? "demo",
    ) as DemoOrder["paymentMethod"];
    const notifications = {
      whatsapp: formData.get("notifyWhatsapp") === "on",
      email: formData.get("notifyEmail") === "on",
    };

    const order = createDemoOrder({
      items: summaryLines,
      subtotal,
      customer,
      paymentMethod,
      notifications,
    });

    saveDemoOrder(order);
    clear();
    router.push("/pedido/confirmacion-demo");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Carrito", href: "/carrito" },
          { label: "Compra de demostración" },
        ]}
      />

      <header className="mt-6 max-w-3xl">
        <h1 className="text-4xl font-extrabold text-brand-ink md:text-5xl">
          Compra de demostración
        </h1>
        <div className="mt-5">
          <DemoNotice>
            Demostración: no se realizará ningún cargo ni se generará un pedido real.
          </DemoNotice>
        </div>
        <p className="mt-4 text-sm font-bold">
          <Link href={invoiceUrl} className="text-brand-pink underline">
            Solicitar factura
          </Link>
        </p>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
        <form onSubmit={handleSubmit} className="space-y-8">
          <section
            aria-labelledby="contact-title"
            className="rounded-3xl border border-border bg-background p-5 md:p-6"
          >
            <h2 id="contact-title" className="font-display text-2xl font-extrabold text-brand-ink">
              Datos de contacto
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelClasses}>
                  Nombre completo
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  autoComplete="name"
                  className={fieldClasses}
                />
              </div>
              <div>
                <label htmlFor="email" className={labelClasses}>
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={fieldClasses}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="phone" className={labelClasses}>
                  Teléfono (opcional)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className={fieldClasses}
                />
              </div>
            </div>
          </section>

          <section
            aria-labelledby="delivery-title"
            className="rounded-3xl border border-border bg-background p-5 md:p-6"
          >
            <h2 id="delivery-title" className="font-display text-2xl font-extrabold text-brand-ink">
              Datos de entrega
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="address" className={labelClasses}>
                  Dirección
                </label>
                <input
                  id="address"
                  name="address"
                  required
                  autoComplete="street-address"
                  className={fieldClasses}
                />
              </div>
              <div>
                <label htmlFor="city" className={labelClasses}>
                  Ciudad
                </label>
                <input
                  id="city"
                  name="city"
                  required
                  autoComplete="address-level2"
                  className={fieldClasses}
                />
              </div>
              <div>
                <label htmlFor="state" className={labelClasses}>
                  Estado
                </label>
                <input
                  id="state"
                  name="state"
                  required
                  autoComplete="address-level1"
                  className={fieldClasses}
                />
              </div>
              <div>
                <label htmlFor="postalCode" className={labelClasses}>
                  Código postal
                </label>
                <input
                  id="postalCode"
                  name="postalCode"
                  required
                  inputMode="numeric"
                  pattern="[0-9]{5}"
                  autoComplete="postal-code"
                  className={fieldClasses}
                />
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Estos datos solo se usan en esta sesión de demostración y no se envían a ningún
              servidor.
            </p>
          </section>

          <section
            aria-labelledby="payment-title"
            data-tour="checkout-methods"
            className="rounded-3xl border border-border bg-background p-5 md:p-6"
          >
            <h2 id="payment-title" className="font-display text-2xl font-extrabold text-brand-ink">
              Método de pago
            </h2>
            <p className="mt-2 text-xs text-muted-foreground">
              Demostración visual. No se solicitan datos bancarios ni se procesa ningún cobro.
            </p>
            <fieldset className="mt-4">
              <legend className="sr-only">Método de pago de demostración</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {PAYMENT_METHODS.map(({ value, label, description, icon: Icon }, index) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-start gap-3 rounded-2xl border-2 border-border px-4 py-3 transition has-[:checked]:border-brand-pink has-[:checked]:bg-brand-soft-pink/40"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={value}
                      defaultChecked={index === 0}
                      className="mt-1 h-4 w-4 accent-brand-pink"
                    />
                    <span>
                      <span className="flex items-center gap-2 text-sm font-bold text-brand-ink">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {label}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {description}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </section>

          <section
            aria-labelledby="notifications-title"
            className="rounded-3xl border border-border bg-background p-5 md:p-6"
          >
            <h2
              id="notifications-title"
              className="font-display text-2xl font-extrabold text-brand-ink"
            >
              Avisos
            </h2>
            <div className="mt-4 space-y-3">
              <label className="flex items-start gap-3 text-sm font-semibold text-brand-ink">
                <input
                  type="checkbox"
                  name="notifyWhatsapp"
                  className="mt-0.5 h-4 w-4 accent-brand-pink"
                />
                Avísenme por WhatsApp cuando salga la siguiente guía
              </label>
              <label className="flex items-start gap-3 text-sm font-semibold text-brand-ink">
                <input
                  type="checkbox"
                  name="notifyEmail"
                  className="mt-0.5 h-4 w-4 accent-brand-pink"
                />
                Quiero recibir correos de Lazox
              </label>
            </div>
          </section>

          {error && (
            <p
              role="alert"
              className="rounded-2xl bg-brand-red/10 px-4 py-3 text-sm font-semibold text-brand-red"
            >
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row-reverse sm:justify-start">
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-pink px-6 py-3 text-sm font-bold text-primary-foreground transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
            >
              Confirmar pedido demo
            </button>
            <Link
              href="/carrito"
              className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-border px-6 py-3 text-sm font-bold text-brand-ink transition hover:border-brand-pink"
            >
              Volver al carrito
            </Link>
          </div>
        </form>

        <div className="lg:sticky lg:top-24">
          <OrderSummary lines={summaryLines} subtotal={subtotal} />
          <p className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
            <Receipt className="h-3.5 w-3.5" aria-hidden="true" />
            ¿Necesita factura?{" "}
            <Link href={invoiceUrl} className="font-bold text-brand-pink underline">
              Solicitar factura
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
