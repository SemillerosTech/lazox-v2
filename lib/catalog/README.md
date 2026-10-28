# Catálogo

La UI consume `CatalogRepository` (`lib/catalog/index.ts`) y no conoce el origen de los datos.
Hoy la implementación activa es `localCatalog`, respaldada por los archivos de `lib/data/`.

## Contrato

| Método                         | Uso                                    |
| ------------------------------ | -------------------------------------- |
| `listBooks()`                  | Catálogo completo y sitemap            |
| `listGuides()`                 | Colección `/guias` y rutas imprimibles |
| `listShelves()`                | Índice `/estantes`                     |
| `getShelf(slug)`               | Plantilla `/estantes/[slug]`           |
| `listBooksByShelf(code)`       | Libros del estante                     |
| `getBook(slug)`                | Ficha `/libros/[slug]`                 |
| `getGuide(slug)`               | Guía pública `/guias/[slug]`           |
| `getGuideForBook(bookSlug)`    | Enlace libro → guía                    |
| `getRecommendation(shelfCode)` | Nota editorial interna (no visible)    |

## Campos que debe respetar cualquier adaptador

- **Precio en centavos.** `Book.price.amount` es un entero; `43500` representa `$435 MXN`. Nunca
  use números flotantes para dinero.
- **Precio libre.** `Book.priceMode` (`single` o `libre`) y `Book.printedAt` (ISO) determinan si el
  lote puede mostrar dos precios. El cálculo del 30 % vive en `lib/pricing.ts`, no en el adaptador.
- **Disponibilidad.** `Book.availability` (`available` o `out_of_stock`) decide el estado de compra.
- **Estado editorial.** `Book.status` (`published` o `provisional`) y
  `EditorialRecommendation.status` son marcas internas. No se muestran en la tienda.
- **Guía.** `Guide.license.status` (`pending` o `confirmed`) debe permanecer en `pending` mientras
  no exista la firma con Semilleros de Sentido A.C. La guía es pública en el borrador, sin
  contraseña, y siempre declara `noindex`.
- **Secciones de guía.** `Guide.sections` está vacío hasta que llegue el contenido aprobado. No
  invente secciones ni párrafos.

## Mapeo previsto a Shopify Storefront API

- `Shelf` → colección o metafield con código `EST-XX` como identificador estable.
- `Book` → producto; precio en `priceRange`, ISBN, edad, `priceMode` y `printedAt` en metafields.
- `Guide` → metaobject con secciones y estado de licencia; el acceso público se define fuera de
  Shopify en este borrador.
- `EditorialRecommendation` → metafield del estante o metaobject de curación.
- `CartItem` → línea del carrito de Shopify (`merchandiseId`, `quantity` y `priceOption` como
  atributo de línea mientras existan dos precios).

Al implementar Shopify, se crea un adaptador que cumpla `CatalogRepository` y se cambia la
exportación `catalog`. Las páginas, componentes y modelos no requieren cambios.

## Reglas de contenido

- Los códigos `EST-XX` son estables; los nombres pueden cambiar.
- Los estantes sin libros muestran un estado vacío; no se inventan recomendaciones.
- Solo `EST-03` tiene un libro aprobado en este borrador.
- La recomendación de `EST-03` permanece marcada como provisional hasta la aprobación de Rossy.
- Las páginas deben consumir `catalog`; no agregue imports directos de `lib/data/` salvo las
  excepciones documentadas: el carrito (`lib/cart/cart-context.tsx`) y el libro de prueba de la
  vista interna `/revision/precios` (`lib/data/pricing-preview.ts`).
