# Catálogo

La UI consume `CatalogRepository` (`lib/catalog/index.ts`) y no conoce el origen de los datos.
Hay dos adaptadores y la fuente se elige explícitamente:

- `lib/catalog/local-draft.ts`: borrador local respaldado por `lib/data/`. Es el valor por defecto.
- `lib/catalog/shopify.ts`: Storefront API. Ver [`lib/shopify/README.md`](../shopify/README.md).

No hay fallback silencioso. Si `LAZOX_CATALOG_SOURCE=shopify` y algo falla, el error se propaga.

## Contrato

| Método                                        | Uso                                        |
| --------------------------------------------- | ------------------------------------------ |
| `listBooks()`                                 | Catálogo completo y sitemap                |
| `listGuides()`                                | Colección `/guias` y rutas imprimibles     |
| `listShelves()`                               | Índice `/estantes`                         |
| `getShelf(slug)`                              | Plantilla `/estantes/[slug]`               |
| `getShelfByCode(code)`                        | Búsqueda por código estable                |
| `listBooksByShelf(code)`                      | Libros del estante                         |
| `getBook(slug)`                               | Ficha `/libros/[slug]`                     |
| `getGuide(slug)`                              | Guía pública `/guias/[slug]`               |
| `getGuideForBook(bookSlug)`                   | Enlace libro → guía                        |
| `getRecommendation(shelfCode)`                | Primera recomendación aprobada del estante |
| `getApprovedRecommendations(location, code?)` | Recomendaciones aprobadas por ubicación    |
| `getHomepageContent()`                        | Prefijo editorial y contenido de portada   |

## Campos que debe respetar cualquier adaptador

- **Precio en centavos.** `Book.price.amount` es un entero; `43500` representa `$435 MXN`. Nunca
  use números flotantes para dinero. `currency` refleja la moneda real que entrega Shopify.
- **Precio libre.** `Book.priceMode` (`single` o `libre`) tiene prioridad. Si existe, el cálculo de
  36 meses no se aplica. `Book.printedAt` solo se usa cuando el adaptador no declara `priceMode`.
  El 30 % vive en `lib/pricing.ts`, no en el adaptador.
- **Disponibilidad.** `Book.availability` (`available` o `out_of_stock`) decide el estado de compra.
- **Identificadores.** `Book.id`/`Book.slug` son estables para la app. `shopifyProductId` y
  `variantId` son datos de Shopify y no sustituyen al slug en rutas ni en el carrito local.
- **Campos opcionales.** `forWhom`, `conversationRule`, `illustrator`, `publisher`, `year`, `isbn`,
  `pages`, `shelfCode` y `coverImage` pueden faltar. La UI los omite sin inventar contenido.
- **Estado editorial.** `Book.status` (`published` o `provisional`) y
  `EditorialRecommendation.status` son marcas internas. No se muestran en la tienda.
- **Recomendaciones.** Sin vocabulario aprobado, `APPROVED_RECOMMENDATION_STATUSES` está vacío y
  no se muestra ninguna recomendación.
- **Guía.** `Guide.license.status` debe permanecer en `pending` mientras no exista la firma con
  Semilleros de Sentido A.C. La guía es pública en el borrador, sin contraseña, con `noindex`.
- **Secciones de guía.** `Guide.sections` está vacío hasta que llegue el contenido aprobado. El
  contenido enriquecido de Shopify llega en `introHtml`, `contentHtml` y `questionsHtml`, saneado.
- **HTML.** Cualquier HTML de Shopify pasa por `sanitize-html` antes de renderizarse.

## Mapeo a Shopify Storefront API

- `Shelf` → colección; `lazox.estante_codigo` y `lazox.estante_orden` como identidad y orden.
- `Book` → producto y primera variante; metacampos del namespace `lazox` para los datos
  editoriales, más `descriptionHtml` para el contenido enriquecido.
- `Guide` → metaobjeto `guia_de_lectura`.
- `EditorialRecommendation` → metaobjeto `recomendacion_lazox`.
- `HomepageContent` → metaobjeto `contenido_de_portada_lazox` con handle `global`.
- Carrito real → Cart API de Shopify, cerrado por flags de servidor. No confundir con el carrito
  de demostración de `local-draft`.

El detalle de claves, variables y diagnóstico está en
[`lib/shopify/README.md`](../shopify/README.md).

## Reglas de contenido

- Los códigos `EST-XX` son estables; los nombres pueden cambiar.
- Los estantes sin libros muestran un estado vacío; no se inventan recomendaciones.
- Solo `EST-03` tiene un libro aprobado en este borrador.
- La recomendación de `EST-03` permanece marcada como provisional hasta la aprobación de Rossy.
- Las páginas deben consumir `catalog`; no agregue imports directos de `lib/data/` salvo las
  excepciones documentadas: `lib/data/pricing-preview.ts` para `/revision/precios` y el adaptador
  local mismo. El carrito ya no importa `lib/data/`: recibe los libros desde el layout de servidor.
