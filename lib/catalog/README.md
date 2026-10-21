# Catálogo

La UI consume `CatalogRepository` (`lib/catalog/index.ts`) y no conoce el origen de los datos.
Hoy la implementación activa es `localCatalog`, respaldada por los archivos de `lib/data/`.

## Contrato

| Método                         | Uso                          |
| ------------------------------ | ---------------------------- |
| `listShelves()`                | Índice `/estantes`           |
| `getShelf(slug)`               | Plantilla `/estantes/[slug]` |
| `listBooksByShelf(code)`       | Libros del estante           |
| `getBook(slug)`                | Ficha `/libros/[slug]`       |
| `getGuide(slug)`               | Guía `/guias/[slug]`         |
| `getGuideForBook(bookSlug)`    | Enlace libro → guía          |
| `getRecommendation(shelfCode)` | Nota editorial provisional   |

## Mapeo previsto a Shopify Storefront API

- `Shelf` → colección o metafield con código `EST-XX` como identificador estable.
- `Book` → producto; precio en `priceRange`, ISBN y edad en metafields.
- `Guide` → metaobject con secciones y estado de licencia.
- `EditorialRecommendation` → metafield del estante o metaobject de curación.
- `CartItem` → línea del carrito de Shopify (`merchandiseId`, `quantity`).

Al implementar Shopify, se crea un adaptador que cumpla `CatalogRepository` y se cambia la
exportación `catalog`. Las páginas, componentes y modelos no requieren cambios.

## Reglas de contenido

- Los códigos `EST-XX` son estables; los nombres pueden cambiar.
- Los estantes sin libros muestran un estado vacío; no se inventan recomendaciones.
- La recomendación de EST-03 permanece marcada como provisional hasta la aprobación de Rossy.
