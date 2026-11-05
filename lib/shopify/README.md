# Integración con Shopify Storefront API

## Avance del catálogo parcial — 5 de noviembre de 2026

Se avanza con el libro y los estantes existentes sin esperar las guías completas.
Inseparables quedó activo y publicado únicamente en Lazox Headless desde el administrador.
Las diez colecciones están publicadas solo en ese canal. Se completó el orden 2 de EST-09,
que estaba vacío. La entrada de portada `global` está activa con su prefijo existente; no se
rellenaron textos vacíos. No se crearon guías ni recomendaciones ni se aprobó contenido editorial.

Storefront real verificado con el token público: diez estantes con orden, Inseparables a $435 MXN
y metacampos editoriales disponibles. Se probaron 26 rutas de la aplicación contra la API real
mediante un adaptador de autenticación de prueba externo al repositorio, sin usar ni copiar el
token privado. Esa prueba corresponde al entorno que preparó el paquete.

El agente local también verificó el token privado existente con `pnpm shopify:check` y 36 rutas
contra Shopify real el 5 de noviembre de 2026: diez estantes ordenados, ficha a $435 MXN sin
existencias ni guía, colección de guías vacía y compras cerradas. Se comprobaron `noindex`,
`robots.txt`, ausencia del token en HTML y assets públicos, y estados no encontrados con sus
dos salidas tras hidratar en Chrome. Las pruebas temporales no forman parte del repositorio.

Las lecturas de libro, estantes y productos de colección usan `React.cache` durante una petición
para compartir resultados entre metadata y página. La siguiente visita consulta Shopify de nuevo;
no hay caché persistente ni se modifica el transporte de carrito.

La ficha conserva el precio cuando no hay existencias y solo anuncia una guía disponible si la
consulta devuelve esa guía. El carrito y el checkout siguen cerrados en modo Shopify.

Para desplegar este modo, Vercel necesita `LAZOX_CATALOG_SOURCE=shopify`,
`SHOPIFY_STORE_DOMAIN` y `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` (solo servidor).
Un push no carga las variables que existen únicamente en `.env.local` de otra computadora.
Mantener `LAZOX_ENABLE_CART=false` y `LAZOX_ENABLE_CHECKOUT=false`.

Production y Preview del proyecto Vercel `lazox-v2` ya tienen las ocho variables del paquete,
con el token privado marcado como sensible. Root Directory es `.` (raíz real de Git y de
`package.json`). Se conserva `.env.local` en `local-draft`: las pruebas usan un override
`LAZOX_CATALOG_SOURCE=shopify`. No se cambiaron las variables de WhatsApp, dominio o factura.
GitHub permite el push autorizado a `main` con la identidad Git local.

El commit `f75b016` quedó publicado y desplegado el 5 de noviembre de 2026. Vercel confirmó
Ready para `dpl_64aMci7tViT9s1K2WvfCvhF5xq5p` y GitHub mostró el check exitoso.
Se repitieron las 36 rutas, las comprobaciones de robots y de exposición del token, y los
estados no encontrados en Chrome sobre https://lazox-v2.vercel.app. No hubo compras ni
mutaciones de Shopify. Los aliases largos de Vercel pueden pedir autenticación; se usó la URL
pública existente sin desactivar protecciones.

Las secciones identificadas como iniciales conservan el diagnóstico anterior como registro
histórico. Configurar variables no demuestra por sí solo que una nueva versión esté publicada:
cada push requiere comprobar su SHA, build y rutas.

> Documento de trabajo de la integración. Explica qué quedó implementado, cómo se enciende y
> qué debe completarse a mano. Las reglas editoriales de Lazox siguen vigentes: este documento
> no autoriza publicar catálogo, cambiar precios ni abrir compras.

## 1. Estado inicial de la integración (antes del catálogo parcial)

- La integración está **implementada y apagada**. El sitio sigue usando el borrador local.
- `LAZOX_CATALOG_SOURCE` decide la fuente. Por defecto es `local-draft`.
- No hay fallback silencioso: si se elige `shopify` y algo falla, la página falla; no muestra
  datos locales encubiertos.
- El catálogo real todavía no está publicado en el canal Headless de Shopify. La conexión de
  Storefront sí responde con las credenciales locales, pero no devuelve colecciones, productos ni
  metaobjetos visibles. El modo `shopify` muestra estados vacíos hasta que el propietario autorice
  publicarlos.
- El carrito y el checkout de Shopify están preparados en servidor, pero **cerrados** por
  `LAZOX_ENABLE_CART=false` y `LAZOX_ENABLE_CHECKOUT=false`. La UI los muestra deshabilitados.
- El carrito y la compra de demostración existentes siguen funcionando **solo** en `local-draft`.
- No se modificó Shopify, no se desplegó nada y no se hizo commit.

### Diferencias deliberadas con el documento de configuración

El documento `docs/LAZOX-Shopify-Nextjs-Configuracion-Local.md` pedía que `local-draft` mostrara
«Vista local de borrador — compras deshabilitadas», ocultara la portada y marcara el precio como
provisional. No se aplicó así porque el pedido explícito fue **conservar la UI y la compra de
demostración existentes**, y porque las reglas editoriales prohíben mostrar marcas de trabajo en la
tienda. En `local-draft` sigue la demo actual (con su etiqueta de demostración); en `shopify` las
compras quedan deshabilitadas. Si se prefiere el comportamiento estricto del documento, hay que
retirar la demo y la portada del modo local en un cambio aparte y con aprobación.

## 2. Cómo se elige la fuente

`lib/catalog/index.ts` exporta `catalogSource` y `catalog`:

```ts
export const catalogSource = getCatalogSource();

export const catalog = catalogSource === "shopify" ? shopifyCatalog : localDraftCatalog;
```

- `local-draft`: `lib/catalog/local-draft.ts` lee `lib/data/`. Es una copia del piloto real, no
  una simulación de Shopify.
- `shopify`: `lib/catalog/shopify.ts` consulta Storefront API.
- Cualquier otro valor de `LAZOX_CATALOG_SOURCE` lanza un error de configuración.

### Protección de despliegue

`getCatalogSource()` falla cerrado cuando detecta un despliegue (`VERCEL=1` o
`LAZOX_DEPLOY_ENV=production`) y la fuente es `local-draft`. Para mantener el borrador desplegado
mientras la tienda sigue cerrada hay que declararlo explícitamente:

```sh
LAZOX_ALLOW_LOCAL_DRAFT_ON_VERCEL=true
```

Sin esa variable, un despliegue con `local-draft` no compila. Es deliberado: evita publicar el
borrador por descuido.

## 3. Variables de entorno

Todas se leen en servidor. `NEXT_PUBLIC_*` se incorpora en tiempo de build; las demás solo viven
en el proceso de servidor.

| Variable                            | Defecto       | Uso                                                                 |
| ----------------------------------- | ------------- | ------------------------------------------------------------------- |
| `LAZOX_CATALOG_SOURCE`              | `local-draft` | `local-draft` o `shopify`. Sin otros valores.                       |
| `SHOPIFY_STORE_DOMAIN`              | —             | Hostname canónico `*.myshopify.com`. No el admin ni el dominio web. |
| `SHOPIFY_STOREFRONT_PRIVATE_TOKEN`  | —             | Token privado de Storefront API. Solo servidor.                     |
| `SHOPIFY_STOREFRONT_API_VERSION`    | `2026-10`     | Formato `YYYY-MM`.                                                  |
| `LAZOX_ENABLE_CART`                 | `false`       | Habilita mutaciones del carrito Shopify en servidor.                |
| `LAZOX_ENABLE_CHECKOUT`             | `false`       | Permite devolver `checkoutUrl`.                                     |
| `LAZOX_TRUST_PROXY`                 | `false`       | Reenvía `Shopify-Storefront-Buyer-IP` desde un proxy de confianza.  |
| `LAZOX_ALLOW_LOCAL_DRAFT_ON_VERCEL` | vacío         | `true` permite desplegar el borrador local.                         |

El token **nunca** debe llamarse `NEXT_PUBLIC_*`. No se imprime en errores, diagnósticos ni logs.
`.env.example` contiene solo nombres y valores vacíos.

## 4. Archivos y responsabilidades

```text
lib/shopify/
  config.ts              Fuente activa, validación, flags y guardia de despliegue
  client.ts              Transporte GraphQL, timeout, errores saneados
  queries.ts             Fragmentos, consultas y mutaciones
  types.ts               Tipos de las respuestas (sin codegen)
  mappers.ts             Shopify → modelos de dominio; saneo de HTML
  cart.ts                Carrito cerrado, cookie httpOnly, validaciones
  request.ts             IP del comprador solo con proxy de confianza
  metaobject-fields.ts   Mapa central de claves de metaobjetos
  diagnostics.ts         Comprobaciones para /revision/catalogo
lib/catalog/
  types.ts               Contrato CatalogRepository
  local-draft.ts         Adaptador del borrador
  shopify.ts             Adaptador de Storefront API
  index.ts               Selección explícita de fuente
app/actions/cart.ts      Server Actions del carrito Shopify (aún sin UI)
scripts/check-shopify.mjs Comprobación por terminal (pnpm shopify:check)
```

Regla: estos módulos son de servidor (`import "server-only"`). No se importan desde componentes
cliente. Por eso `CartProvider` recibe los libros y el flag `enabled` desde el layout de servidor,
en lugar de leer `lib/data/` en el navegador.

## 5. Lecturas implementadas

| Método                                            | Origen Shopify                                                                                                  |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `listShelves()`                                   | `collections(first: 50)` paginado; solo colecciones con `lazox.estante_codigo` y `lazox.estante_orden` válidos. |
| `getShelf(slug)` / `getShelfByCode(code)`         | Misma lista; el slug de la app es `est-XX` y se compara con el código.                                          |
| `listBooksByShelf(code)`                          | `collection.products` paginado con los metacampos del producto.                                                 |
| `listBooks()`                                     | Productos de todas las colecciones de estante, sin duplicados por handle.                                       |
| `getBook(slug)`                                   | `product(handle:)` con sus metacampos.                                                                          |
| `listGuides()` / `getGuide(slug)`                 | Metaobjetos `guia_de_lectura`. Enriquecidos con el libro relacionado.                                           |
| `getGuideForBook(bookSlug)`                       | `lazox.guia` del producto → handle del metaobjeto.                                                              |
| `getApprovedRecommendations(location, shelfCode)` | Metaobjetos `recomendacion_lazox`. Hoy devuelve `[]` a propósito.                                               |
| `getHomepageContent()`                            | Metaobjeto `contenido_de_portada_lazox` con handle `global`.                                                    |

Detalles:

- Las conexiones se paginan (`first: 50`) hasta `hasNextPage: false`, con un tope de 20 páginas.
- El orden de estantes se lee de `lazox.estante_orden`; nunca por nombre, handle, ID ni fecha.
- Códigos duplicados no rompen las rutas: se conserva el primero y el diagnóstico los reporta.
- Si un metafield falta, el campo queda `undefined`/`null`; no es un error fatal.
- Los precios llegan como texto decimal y se convierten a **centavos** sin punto flotante.
- `precio_reducido` se consulta pero **no se usa** para promociones ni descuentos.
- `descriptionHtml` y el HTML de guías se sanean con `sanitize-html` antes de renderizarse.

### Rutas dinámicas

Las páginas que dependen del catálogo declaran `export const dynamic = "force-dynamic"`:

- `/`
- `/estantes` y `/estantes/[slug]`
- `/libros/[slug]`
- `/guias` y `/guias/[slug]`
- `/guias/[slug]/descargar`
- `/sitemap.xml`
- `/revision/catalogo`

Esto elimina `generateStaticParams`/`dynamicParams` y evita prerenderizar un catálogo que aún no
existe. El sitemap conserva las rutas fijas si Shopify falla.

### Imágenes

`next.config.ts` declara `cdn.shopify.com` en `images.remotePatterns`. Las portadas que entrega
Shopify se muestran con `next/image`; el `alt` usa `coverImageAlt` si existe.

## 6. Metacampos de producto

Namespace `lazox`. El adaptador consulta los 20 campos documentados más dos opcionales.

| Clave                            | Tipo en Shopify                    | Campo de la app                     |
| -------------------------------- | ---------------------------------- | ----------------------------------- |
| `lazox.isbn`                     | Texto de una línea                 | `isbn`                              |
| `lazox.autora`                   | Texto de una línea                 | `author`                            |
| `lazox.ilustradora`              | Texto de una línea                 | `illustrator`                       |
| `lazox.traductor`                | Texto de una línea                 | `translator`                        |
| `lazox.editorial`                | Texto de una línea                 | `publisher`                         |
| `lazox.anio`                     | Entero                             | `year`                              |
| `lazox.paginas`                  | Entero                             | `pages`                             |
| `lazox.edad_sugerida`            | Texto de una línea                 | `ageSuggestion`                     |
| `lazox.ficha_madre_id`           | Texto de una línea                 | Se consulta; sin uso visual todavía |
| `lazox.estante_principal_codigo` | Texto de una línea                 | `shelfCode`                         |
| `lazox.estantes_vecinos`         | Lista de referencias a colecciones | `neighborShelfCodes`                |
| `lazox.pregunta_conversar`       | Texto multilínea                   | `conversationQuestion`              |
| `lazox.libro_vecino`             | Referencia a producto              | `neighborBook.title/slug`           |
| `lazox.libro_vecino_motivo`      | Texto multilínea                   | `neighborBook.reason`               |
| `lazox.guia`                     | Referencia a metaobjeto            | `guideSlug`                         |
| `lazox.colofon_fecha`            | Fecha                              | `printedAt`                         |
| `lazox.colofon_origen`           | Texto multilínea                   | `colophonOrigin`                    |
| `lazox.estado_libro`             | Texto de una línea                 | `bookStatus`                        |
| `lazox.condicion_precio`         | Texto de una línea                 | `priceCondition` y `priceMode`      |
| `lazox.precio_reducido`          | Dinero                             | Se consulta; **no se usa**          |
| `lazox.para_quien`               | Opcional, texto                    | `forWhom`                           |
| `lazox.regla_conversacion`       | Opcional, texto                    | `conversationRule`                  |

### Precio libre

- `condicion_precio` que contenga «libre» marca `priceMode: "libre"`.
- Cualquier otro valor, o su ausencia, marca `priceMode: "single"`.
- El adaptador **no** calcula la regla de 36 meses con la fecha del colofón. La decisión de precio
  vive en el metafield; `lib/pricing.ts` respeta el valor explícito.
- Los dos precios siguen apagados para el público con `NEXT_PUBLIC_ENABLE_DUAL_PRICING=false`.

### Contenido enriquecido

La ficha muestra `descriptionHtml` saneado cuando existe. Si no existe, cae a `synopsis` (texto
plano de la descripción nativa). Para conservar los bloques editoriales actuales sin parsear HTML
por posiciones se pueden crear `lazox.para_quien` y `lazox.regla_conversacion`; si no existen, la
ficha simplemente omite esos bloques.

Clases disponibles para el HTML saneado: `.rich-text` en `app/globals.css`.

## 7. Metaobjetos

| Tipo técnico                 | Uso                                                                              |
| ---------------------------- | -------------------------------------------------------------------------------- |
| `guia_de_lectura`            | Guías en `/guias`.                                                               |
| `recomendacion_lazox`        | Recomendaciones de la casa. Hoy no se muestran.                                  |
| `contenido_de_portada_lazox` | Prefijo editorial de estantes y contenido de portada. Handle esperado: `global`. |

Las **claves técnicas de los campos** ya están verificadas y viven en
`lib/shopify/metaobject-fields.ts`. Se confirmaron en el administrador de Shopify el 5 de noviembre
de 2026.

### `guia_de_lectura`

| Campo en Shopify (key) | Uso en la app       |
| ---------------------- | ------------------- |
| `titulo`               | `title`             |
| `slug`                 | `slug`              |
| `libro_relacionado`    | `book` (referencia) |
| `codigo_del_estante`   | `shelfCode`         |
| `texto_introductorio`  | `intro`             |
| `contenido`            | `content`           |
| `preguntas`            | `questions`         |
| `archivo_descargable`  | `download`          |
| `estado_editorial`     | `status`            |
| `creditos`             | `credits`           |

### `recomendacion_lazox`

| Campo en Shopify (key)           | Uso en la app       |
| -------------------------------- | ------------------- |
| `libro_recomendado`              | `book` (referencia) |
| `ubicacion_de_la_recomendacion`  | `location`          |
| `estante_relacionado`            | `shelf`             |
| `motivo_de_la_recomendacion`     | `reason`            |
| `estado_de_aprobacion_editorial` | `status`            |
| `responsable_de_la_aprobacion`   | `approvedBy`        |

### `contenido_de_portada_lazox`

| Campo en Shopify (key)          | Uso en la app |
| ------------------------------- | ------------- |
| `identificador`                 | `identifier`  |
| `titulo`                        | `title`       |
| `mensaje_principal`             | `message`     |
| `contenido`                     | `content`     |
| `orden`                         | `order`       |
| `estado_editorial`              | `status`      |
| `prefijo_editorial_de_estantes` | `shelfPrefix` |

Para editar el mapeo, cambie el valor del objeto correspondiente en
`lib/shopify/metaobject-fields.ts`. Si Shopify cambia una definición:

1. Abra **Datos personalizados → Metaobjetos** en el administrador.
2. Copie la **key técnica** del campo (no la etiqueta visible).
3. Actualice el objeto (`GUIDE_FIELD_KEYS`, `RECOMMENDATION_FIELD_KEYS` o
   `HOMEPAGE_FIELD_KEYS`).
4. Ejecute `pnpm shopify:check` o abra `/revision/catalogo` para contrastar las claves que
   Storefront devuelve.

El diagnóstico lista las claves reales de las entradas visibles; no modifica Shopify. Mientras no
haya entradas publicadas, el diagnóstico confirma la configuración local pero no puede contrastarla
contra datos reales.

### Recomendaciones

`APPROVED_RECOMMENDATION_STATUSES` está vacío a propósito. No hay vocabulario editorial cerrado
para el estado de aprobación. Mientras esté vacío, `getApprovedRecommendations()` devuelve `[]` y
la tienda no muestra recomendaciones. Agregue los valores exactos (en minúsculas) cuando Rossy y
el equipo los definan; no se infiere aprobación por un campo no vacío.

## 8. Carrito y checkout

Preparado en `lib/shopify/cart.ts` y expuesto en `app/actions/cart.ts`:

- `cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove`, `cart`.
- Usa IDs de **variante** (`merchandiseId`); nunca el ID del producto.
- Valida cantidades enteras entre 1 y 99 y formatos de GID.
- El ID del carrito se guarda en cookie `httpOnly`, `sameSite=lax`, `secure` en producción.
- No imprime el ID ni lo trata como dato público.
- Shopify calcula precios y totales; el navegador no los envía.
- `LAZOX_ENABLE_CART=false` bloquea **cualquier** mutación en servidor.
- `LAZOX_ENABLE_CHECKOUT=false` impide devolver `checkoutUrl`.
- En `local-draft` las acciones lanzan `ShopifyCartDisabledError` aunque alguien cambie un flag.
- `LAZOX_TRUST_PROXY=true` habilita `Shopify-Storefront-Buyer-IP`; sin él, no se reenvía.

La UI del carrito Shopify **aún no está conectada**. Las Server Actions existen y compilan, pero
ningún botón las llama. Mientras el carrito real no se conecte:

- En `shopify`, `CartProvider` se monta con `enabled={false}`.
- La ficha muestra «Compra no disponible».
- `/carrito` y `/compra/demo` muestran un estado vacío neutral.
- El recorrido de demostración no se monta.

Para conectar el carrito real hace falta una decisión explícita y trabajo adicional: botón que
llame a las acciones, estado del carrito en cliente, revalidación tras cada mutación, mensajes de
error y una prueba real con el canal Headless publicado. No se hizo porque abrir compras no está
autorizado.

## 9. Diagnóstico

### Página interna

`/revision/catalogo` (`noindex`, fuera del menú y del sitemap) muestra:

- fuente activa y si la configuración está completa;
- resultado de conexión con la tienda;
- estado de los flags de carrito y checkout;
- estantes mapeados, códigos inválidos, duplicados y órdenes faltantes;
- claves configuradas de metaobjetos y claves reales de las entradas visibles.

En `local-draft` no llama a Shopify; solo informa que el borrador está activo.

### Terminal

```sh
pnpm shopify:check
```

Lee `.env.local` si existe (`node --env-file-if-exists`), valida las variables y consulta la
tienda. Nunca imprime el token. Muestra colecciones con su código y orden, y las primeras
entradas de cada metaobjeto con sus claves.

## 10. Cómo encender Shopify (cuando esté autorizado)

1. Complete en `.env.local` (o en Vercel) las variables de la sección 3.
2. Publique los productos, colecciones y metaobjetos en el canal Headless de Shopify. Sin eso,
   Storefront devuelve vacío.
3. Complete las claves de `lib/shopify/metaobject-fields.ts` con las del administrador.
4. Cambie `LAZOX_CATALOG_SOURCE=shopify`.
5. Ejecute `pnpm shopify:check` y abra `/revision/catalogo`.
6. Decida si el borrador local puede seguir desplegado
   (`LAZOX_ALLOW_LOCAL_DRAFT_ON_VERCEL=true`) o si el despliegue ya debe usar Shopify.
7. Solo después de una decisión explícita, encienda `LAZOX_ENABLE_CART` y
   `LAZOX_ENABLE_CHECKOUT` y conecte la UI del carrito.

No cambie `NEXT_PUBLIC_ENABLE_DUAL_PRICING` sin aprobación legal y contable.

## 11. Cómo editar contenido

| Quiero cambiar…                         | Dónde                                                                                     |
| --------------------------------------- | ----------------------------------------------------------------------------------------- |
| Textos, precios o imágenes del borrador | `lib/data/*.ts` y `public/images/` (modo `local-draft`).                                  |
| Catálogo real                           | Administrador de Shopify (productos, colecciones, metaobjetos).                           |
| Claves de metaobjetos                   | `lib/shopify/metaobject-fields.ts`.                                                       |
| Metacampos consultados                  | `PRODUCT_METAFIELD_IDENTIFIERS` en `lib/shopify/queries.ts` y su lectura en `mappers.ts`. |
| Orden de estantes                       | `lazox.estante_orden` en Shopify, o `order` en `lib/data/shelves.ts`.                     |
| Prefijo «Para el niño o la niña que…»   | Metaobjeto de portada (`shelfPrefix`) o `lib/catalog/local-draft.ts`.                     |
| Reglas de precio                        | `lib/pricing.ts` (no en el adaptador).                                                    |
| Variables                               | `.env.example` y este documento.                                                          |

## 12. Pendientes posteriores al catálogo parcial

- Repetir la verificación del SHA y las rutas después de futuros despliegues.
- Contenido aprobado y licencia de guías; no se crean entradas incompletas para llenar la tienda.
- Vocabulario aprobado de estados de recomendación.
- Decisión sobre carrito y checkout reales.

Las claves técnicas de los tres metaobjetos ya están configuradas (sección 7).

## 13. Verificación inicial (anterior a la publicación en Headless)

Con `LAZOX_CATALOG_SOURCE=local-draft`:

- `pnpm format:check`, `pnpm lint`, `pnpm typecheck` y `pnpm build` sin errores.
- `/`, `/estantes`, `/estantes/est-03`, `/libros/inseparables`, `/guias`, `/guias/inseparables`,
  `/guias/inseparables/descargar`, `/carrito`, `/compra/demo`, `/revision/precios` y
  `/revision/catalogo` responden `200`.
- Un libro inexistente responde `404` con el texto aprobado.
- El orden de estantes y el precio `$435 MXN` se mantienen.

Con `LAZOX_CATALOG_SOURCE=shopify` y las credenciales locales:

- `pnpm shopify:check` conecta con la tienda y no imprime el token.
- Storefront responde, pero devuelve **cero** colecciones, productos y metaobjetos visibles porque
  no están publicados en el canal Headless.
- `/`, `/estantes` y `/guias` responden `200` con estados vacíos; `/libros/inseparables` responde
  `404` porque el producto no es visible.
- `/carrito` y `/compra/demo` muestran la compra deshabilitada y no aparece ningún dato local.
- `/revision/catalogo` reporta la conexión, los estantes faltantes y las claves configuradas sin
  exponer secretos.
- Las claves de los tres metaobjetos quedaron configuradas con los valores verificados en el
  administrador. No hay entradas publicadas contra las cuales contrastarlas todavía.

No se creó ningún carrito real ni se modificó Shopify.
