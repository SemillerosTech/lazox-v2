import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { catalogSource } from "@/lib/catalog";
import { getShopifyDiagnostics } from "@/lib/shopify/diagnostics";

export const metadata: Metadata = {
  title: "Revisión del catálogo",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function Value({ children }: { children: ReactNode }) {
  return <span className="font-mono text-xs break-all text-brand-ink">{children}</span>;
}

function Status({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
        ok ? "bg-brand-mint text-brand-ink" : "bg-brand-yellow text-brand-ink"
      }`}
    >
      <span aria-hidden="true">{ok ? "●" : "○"}</span>
      {children}
    </span>
  );
}

export default async function CatalogReviewPage() {
  const diagnostics = catalogSource === "shopify" ? await getShopifyDiagnostics() : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Revisión del catálogo" }]} />

      <header className="mt-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-pink">
          Vista interna
        </p>
        <h1 className="mt-2 text-4xl font-extrabold text-brand-ink md:text-5xl">
          Estado del catálogo
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Esta página no está enlazada desde el menú ni el sitemap. Nunca muestra el token ni
          identificadores de carrito. Sirve para confirmar qué responde Shopify antes de publicar el
          catálogo.
        </p>
      </header>

      <section aria-labelledby="source-title" className="mt-8 rounded-3xl border border-border p-6">
        <h2 id="source-title" className="font-display text-2xl font-extrabold text-brand-ink">
          Fuente activa
        </h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-bold text-muted-foreground">LAZOX_CATALOG_SOURCE</dt>
            <dd className="mt-1">
              <Value>{catalogSource}</Value>
            </dd>
          </div>
          <div>
            <dt className="font-bold text-muted-foreground">Configuración de Shopify</dt>
            <dd className="mt-1">
              <Status ok={Boolean(diagnostics?.configured)}>
                {diagnostics?.configured ? "Completa" : "No disponible"}
              </Status>
            </dd>
          </div>
          {diagnostics?.storeDomain && (
            <div>
              <dt className="font-bold text-muted-foreground">Tienda</dt>
              <dd className="mt-1">
                <Value>{diagnostics.storeDomain}</Value>
              </dd>
            </div>
          )}
          {diagnostics?.apiVersion && (
            <div>
              <dt className="font-bold text-muted-foreground">Versión de API</dt>
              <dd className="mt-1">
                <Value>{diagnostics.apiVersion}</Value>
              </dd>
            </div>
          )}
        </dl>

        {catalogSource === "local-draft" ? (
          <p className="mt-4 rounded-2xl bg-brand-soft-pink px-4 py-3 text-sm font-semibold text-brand-ink">
            El sitio usa el borrador local de <Value>lib/data</Value>. Para revisar Shopify,
            configure <Value>LAZOX_CATALOG_SOURCE=shopify</Value> y las variables de{" "}
            <Value>.env.example</Value>.
          </p>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Sin fallback: si la configuración o la red fallan, las rutas del catálogo muestran un
            error, no una copia local.
          </p>
        )}
      </section>

      {diagnostics && (
        <>
          <section
            aria-labelledby="connection-title"
            className="mt-6 rounded-3xl border border-border p-6"
          >
            <h2
              id="connection-title"
              className="font-display text-2xl font-extrabold text-brand-ink"
            >
              Conexión
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Status ok={diagnostics.connection.ok}>
                {diagnostics.connection.ok ? "Responde" : "Sin respuesta"}
              </Status>
              {diagnostics.connection.shopName && (
                <span className="text-sm font-semibold text-brand-ink">
                  {diagnostics.connection.shopName}
                </span>
              )}
              {diagnostics.connection.shopHost && <Value>{diagnostics.connection.shopHost}</Value>}
            </div>
            {diagnostics.connection.error && (
              <p className="mt-3 rounded-2xl bg-brand-yellow/30 px-4 py-3 text-sm font-semibold text-brand-ink">
                {diagnostics.connection.error}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Status ok={diagnostics.cartEnabled}>
                Carrito {diagnostics.cartEnabled ? "encendido" : "cerrado"}
              </Status>
              <Status ok={diagnostics.checkoutEnabled}>
                Checkout {diagnostics.checkoutEnabled ? "encendido" : "cerrado"}
              </Status>
            </div>
          </section>

          <section
            aria-labelledby="shelves-title"
            className="mt-6 rounded-3xl border border-border p-6"
          >
            <h2 id="shelves-title" className="font-display text-2xl font-extrabold text-brand-ink">
              Estantes
            </h2>

            {diagnostics.shelvesError && (
              <p className="mt-3 rounded-2xl bg-brand-yellow/30 px-4 py-3 text-sm font-semibold text-brand-ink">
                {diagnostics.shelvesError}
              </p>
            )}

            {diagnostics.shelves ? (
              <>
                <p className="mt-3 text-sm text-muted-foreground">
                  {diagnostics.shelves.mappedShelves} de {diagnostics.shelves.totalCollections}{" "}
                  colecciones se pueden mapear como estantes.
                </p>
                <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                  <li>
                    <span className="font-bold text-muted-foreground">Códigos: </span>
                    <Value>{diagnostics.shelves.codes.join(", ") || "—"}</Value>
                  </li>
                  <li>
                    <span className="font-bold text-muted-foreground">Órdenes: </span>
                    <Value>{diagnostics.shelves.orders.join(", ") || "—"}</Value>
                  </li>
                  <li>
                    <span className="font-bold text-muted-foreground">Falta código: </span>
                    <Value>{diagnostics.shelves.missingCode.join(", ") || "—"}</Value>
                  </li>
                  <li>
                    <span className="font-bold text-muted-foreground">Falta orden: </span>
                    <Value>{diagnostics.shelves.missingOrder.join(", ") || "—"}</Value>
                  </li>
                  <li>
                    <span className="font-bold text-muted-foreground">Códigos inválidos: </span>
                    <Value>
                      {diagnostics.shelves.invalidCodes
                        .map((item) => `${item.handle}=${item.value}`)
                        .join(", ") || "—"}
                    </Value>
                  </li>
                  <li>
                    <span className="font-bold text-muted-foreground">Duplicados: </span>
                    <Value>
                      {[
                        ...diagnostics.shelves.duplicateCodes,
                        ...diagnostics.shelves.duplicateOrders.map(String),
                      ].join(", ") || "—"}
                    </Value>
                  </li>
                  <li>
                    <span className="font-bold text-muted-foreground">Órdenes faltantes: </span>
                    <Value>{diagnostics.shelves.missingOrderSequence.join(", ") || "—"}</Value>
                  </li>
                </ul>
              </>
            ) : (
              !diagnostics.shelvesError && (
                <p className="mt-3 text-sm text-muted-foreground">
                  No se pudo leer la lista de colecciones.
                </p>
              )
            )}
          </section>

          <section
            aria-labelledby="metaobjects-title"
            className="mt-6 rounded-3xl border border-border p-6"
          >
            <h2
              id="metaobjects-title"
              className="font-display text-2xl font-extrabold text-brand-ink"
            >
              Claves de metaobjetos
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Las claves configuradas viven en <Value>lib/shopify/metaobject-fields.ts</Value> y se
              verificaron en el administrador de Shopify el 5 de noviembre de 2026. Si aparece
              «pendiente», complete la key exacta del administrador.
            </p>

            {diagnostics.metaobjects.length === 0 && (
              <p className="mt-3 text-sm text-muted-foreground">Sin datos de metaobjetos.</p>
            )}

            {diagnostics.metaobjects.map((group) => (
              <div key={group.type} className="mt-5 border-t border-border pt-4">
                <h3 className="text-sm font-extrabold uppercase tracking-[0.15em] text-brand-pink">
                  {group.type}
                </h3>
                {group.error && (
                  <p className="mt-2 rounded-2xl bg-brand-yellow/30 px-4 py-3 text-sm font-semibold text-brand-ink">
                    {group.error}
                  </p>
                )}
                <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  {Object.entries(group.configured).map(([name, key]) => (
                    <div key={name} className="flex flex-wrap items-baseline gap-2">
                      <dt className="font-bold text-muted-foreground">{name}</dt>
                      <dd>{key ? <Value>{key}</Value> : <Status ok={false}>pendiente</Status>}</dd>
                    </div>
                  ))}
                </dl>

                {group.guideSlugIssues && group.guideSlugIssues.length > 0 && (
                  <div className="mt-3 rounded-2xl bg-brand-yellow/30 p-4 text-sm text-brand-ink">
                    <p className="font-bold">Guías sin ruta pública: revise el campo slug.</p>
                    <ul className="mt-2 list-inside list-disc">
                      {group.guideSlugIssues.map((issue) => (
                        <li key={issue.handle}>
                          <Value>{issue.handle}</Value>:{" "}
                          {issue.reason === "missing"
                            ? "falta slug"
                            : issue.reason === "invalid"
                              ? "formato de slug inválido"
                              : "slug duplicado"}
                          {issue.slug && (
                            <>
                              {" "}
                              (<Value>{issue.slug}</Value>)
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {group.entries.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    No hay entradas visibles para Storefront. Publíquelas en el canal Headless.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-3">
                    {group.entries.map((entry) => (
                      <li key={entry.handle} className="rounded-2xl bg-brand-cream p-3">
                        <p className="text-sm font-bold text-brand-ink">{entry.handle}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {entry.keys
                            .map(
                              (field) =>
                                `${field.key} (${field.type})${field.hasValue ? "" : " · vacío"}`,
                            )
                            .join(" · ") || "Sin campos"}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        </>
      )}

      <Link
        href="/"
        className="mt-8 inline-block text-sm font-bold text-brand-pink hover:underline"
      >
        ← Volver a la portada
      </Link>
    </div>
  );
}
