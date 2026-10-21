# LAZOX

Sitio de LAZOX: libros, estantes, talleres y experiencias para crecer juntos. Incluye el
prototipo navegable de **Inseparables**: ficha, guía privada, carrito, compra de demostración,
confirmación y representación de la caja.

> **Documento de contexto para personas y agentes.** Antes de modificar el proyecto, lea también
> [`AGENTS.md`](./AGENTS.md) y [`TODO.md`](./TODO.md). `AGENTS.md` contiene las reglas operativas;
> `TODO.md` es la lista viva de pendientes.

## 1. Contexto del proyecto

LAZOX trabaja con familias, escuelas, empresas y comunidades. La propuesta editorial organiza los
libros en **10 estantes emocionales** identificados con códigos estables `EST-01`…`EST-10`.

El prototipo actual sirve para validar la experiencia alrededor de un solo libro aprobado:

| Dato             | Valor                                                         |
| ---------------- | ------------------------------------------------------------- |
| Libro            | **Inseparables**                                              |
| Autora           | Mar Pavón                                                     |
| Ilustradora      | María Girón                                                   |
| Editorial        | Tramuntana Editorial                                          |
| Año              | 2015                                                          |
| ISBN             | 978-84-943046-0-6                                             |
| Edad sugerida    | Hacia los 7 años en adelante, y por toda la familia           |
| Estante          | `EST-03` — “teme perder lo que ama”                           |
| Precio           | **$435 MXN**, precio único                                    |
| Estado editorial | Recomendación provisional sujeta a aprobación de Rossy        |
| Guía             | Privada, con licencia pendiente de Semilleros de Sentido A.C. |

Los demás estantes existen y se muestran en orden editorial, pero **no tienen libros ni
recomendaciones inventadas**. Su estado es “selección en preparación”.

## 2. Estado actual

### Implementado y verificado

- Migración a Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4 y pnpm.
- Homepage LAZOX conservando identidad visual, header, footer y tokens `brand-*`.
- Banda de Inseparables en la homepage y CTAs hacia el libro y su estante.
- Índice de los 10 estantes y plantilla de detalle de estante.
- Ficha completa de Inseparables con textos editoriales aprobados.
- Guía privada con control de acceso real y `noindex`.
- Carrito con `localStorage`, cantidades, eliminación, subtotal y estado compartido.
- Checkout ficticio, confirmación de demostración y página conceptual de la caja.
- WhatsApp con mensaje prellenado y panel de demostración si falta el número.
- SEO básico, `robots.txt`, sitemap condicionado, 404 y páginas de error.
- Documentación de catálogo y despliegue.

### Verificaciones realizadas

- `pnpm format:check`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- Rutas públicas y privadas, respuestas `404`, redirección de la guía sin cookie y acceso con
  cookie válida.
- Flujo manual de carrito: agregar, cambiar cantidad, recargar, eliminar y comprobar subtotal.
- Checkout, confirmación, caja, sesión sin pedido y estados vacíos.
- Revisión responsive a 390 px y 1440 px, sin overflow horizontal ni errores de consola.
- Modo sin `GUIDE_ACCESS_PASSWORD`: la guía queda bloqueada y el formulario deshabilitado.

No existe todavía una suite automatizada de pruebas ni integración real con Shopify.

## 3. Stack

- [Next.js 16](https://nextjs.org) con App Router y Turbopack.
- React 19.
- TypeScript en modo estricto.
- Tailwind CSS v4.
- [lucide-react](https://lucide.dev) para iconografía.
- pnpm 11 como gestor de paquetes.

No se usa Lovable, Vite, Bun, TanStack, shadcn/ui ni Radix. No agregue esas dependencias sin una
decisión explícita.

## 4. Requisitos

- Node.js >= 20.9.
- pnpm 11 (`corepack enable` o `npm i -g pnpm`).

## 5. Inicio rápido

```sh
pnpm install
cp .env.example .env.local
pnpm dev
```

El sitio queda disponible en http://localhost:3000.

Para probar la guía en local, defina `GUIDE_ACCESS_PASSWORD` en `.env.local`. No documente ni
comparta contraseñas reales en el repositorio.

## 6. Variables de entorno

| Variable                      | Obligatoria | Uso                                                                |
| ----------------------------- | ----------- | ------------------------------------------------------------------ |
| `GUIDE_ACCESS_PASSWORD`       | Sí          | Contraseña de la guía privada. Sin ella, `/guias` queda bloqueada. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | No          | Número oficial con código de país, sin `+` ni espacios.            |
| `NEXT_PUBLIC_SITE_URL`        | No          | URL pública para el sitemap y metadatos canónicos.                 |

`NEXT_PUBLIC_*` se incorpora en tiempo de build. Definir esas variables antes de `pnpm build`.

## 7. Rutas

| Ruta                        | Tipo     | Descripción                                           |
| --------------------------- | -------- | ----------------------------------------------------- |
| `/`                         | Pública  | Homepage LAZOX con banda de Inseparables              |
| `/estantes`                 | Pública  | Los 10 estantes en orden editorial                    |
| `/estantes/[slug]`          | Pública  | Detalle de estante; los vacíos muestran estado neutro |
| `/libros/[slug]`            | Pública  | Ficha de Inseparables                                 |
| `/guias/acceso`             | Pública  | Formulario de acceso a la guía privada                |
| `/guias/[slug]`             | Privada  | Guía protegida por contraseña y no indexable          |
| `/carrito`                  | No index | Carrito con cantidades, eliminación y subtotal        |
| `/compra/demo`              | No index | Checkout ficticio                                     |
| `/pedido/confirmacion-demo` | No index | Confirmación de la compra ficticia                    |
| `/pedido/caja-demo`         | No index | Representación conceptual de la caja                  |

Los códigos de estante son estables. Los slugs actuales son `est-01`…`est-10`; solo `est-03`
tiene un libro.

## 8. Arquitectura

```text
app/
  layout.tsx                  Layout raíz, fuentes y metadata global
  (site)/
    layout.tsx                Header, footer, skip link y CartProvider
    page.tsx                  Homepage
    estantes/                 Índice y detalle de estantes
    libros/[slug]/            Ficha de libro
    guias/                    Acceso y guía privada
    carrito/                  Carrito
    compra/demo/              Checkout ficticio
    pedido/                   Confirmación y caja
  sitemap.ts                  Sitemap público
  error.tsx                   Error boundary de aplicación
  global-error.tsx            Error boundary global
  not-found.tsx               404
components/                   Componentes compartidos de UI
lib/
  cart/                       Store, persistencia y pedido de demostración
  catalog/                    Contrato CatalogRepository y adaptador local
  data/                       Datos editoriales provisionales
  types.ts                    Modelos de dominio
proxy.ts                      Protección de /guias
public/                       Logo, imágenes, robots.txt y favicon
```

### Decisiones técnicas relevantes

- **Server Components por defecto.** Los componentes cliente se limitan a carrito, formularios,
  menú móvil, WhatsApp y confirmación.
- **Datos desacoplados.** Las páginas consumen `CatalogRepository` (`lib/catalog/index.ts`). La
  implementación activa es `localCatalog`, respaldada por `lib/data/`.
- **Carrito externo.** `lib/cart/cart-store.ts` usa un store con `useSyncExternalStore` para evitar
  parpadeos de hidratación y compartir estado entre páginas.
- **Precio en centavos.** `43500` representa `$435 MXN`; nunca use números flotantes para dinero.
- **Guía protegida en dos capas.** `proxy.ts` intercepta `/guias/:path*` y la propia página vuelve
  a validar la cookie en el servidor. El `noindex` es una capa adicional, no el control de acceso.
- **Tailwind v4.** Los tokens de color viven en `app/globals.css`; conserve los nombres `brand-*`.

## 9. Datos y contenido

- `lib/data/books.ts`: libro aprobado, precio, textos editoriales y estado.
- `lib/data/shelves.ts`: los 10 estantes en orden y sus libros.
- `lib/data/guides.ts`: guía construida a partir del contenido aprobado del libro.
- `lib/data/recommendations.ts`: recomendación provisional de `EST-03`.
- `lib/catalog/index.ts`: contrato que deberá cumplir un futuro adaptador de Shopify.
- `lib/catalog/README.md`: mapeo previsto a Shopify Storefront API.

No invente sinopsis, preguntas, reglas, libros, autores, ISBN, precios ni recomendaciones. Si falta
contenido editorial, use un estado vacío o deje el pendiente en `TODO.md`.

## 10. Carrito y compra de demostración

- Persistencia: `localStorage`, clave `lazox:cart:v1`.
- Cantidades permitidas: enteros entre 1 y 99.
- El carrito se comparte mediante `CartProvider` y `useCart()`.
- La compra se guarda solo en `sessionStorage` (`lazox:demo-order:v1`) para mostrar la confirmación.
- El checkout no envía datos a ningún servidor.
- La etiqueta obligatoria es:

  > Demostración: no se realizará ningún cargo ni se generará un pedido real.

No convierta este flujo en una compra real sin integrar antes el checkout, pedidos, correo y
cumplimiento legal correspondientes.

## 11. Acceso privado a la guía

- Variable: `GUIDE_ACCESS_PASSWORD`.
- Cookie: `lazox_guide_access`, `httpOnly`, `sameSite=lax`, `secure` en producción, ruta `/guias`
  y duración de 8 horas.
- El valor de la cookie es el hash SHA-256 de la contraseña configurada; la comparación usa
  `timingSafeEqual`.
- `proxy.ts` redirige a `/guias/acceso?next=...` cuando no hay acceso.
- La página de la guía vuelve a validar la cookie en el servidor.
- `safeGuideRedirect()` evita redirecciones abiertas.
- Sin `GUIDE_ACCESS_PASSWORD`, el acceso queda bloqueado y el formulario se deshabilita.

Es una puerta de acceso compartida de prototipo, no un sistema de cuentas de usuario. Antes de
producción hay que definir política de acceso, rotación y limitación de intentos.

## 12. Reglas editoriales y de marca

Estas reglas vienen del brief y no deben cambiarse sin aprobación:

- LAZOX habla de **usted**. Los textos de Rossy se conservan literalmente aunque usen “tú”.
- No usar lenguaje clínico.
- Un solo precio: `$435 MXN`. Sin descuentos, promociones, precios tachados ni precios alternativos.
- La recomendación de `EST-03` permanece **provisional** hasta aprobación editorial.
- Solo `EST-03` tiene un libro aprobado. Los demás estantes muestran un estado vacío neutral.
- La guía solo muestra el contenido aprobado de la tarjeta: sinopsis, pregunta y regla. El contenido
  extenso y la licencia definitiva están pendientes.
- El libro vecino y la tarjeta del buen vecino están pendientes de definición.
- La portada actual es una composición CSS marcada como demostración; no hay imágenes oficiales.
- La atribución literal es: “Guía de Semilleros de Sentido A.C., usada por Lazox bajo licencia.”

## 13. WhatsApp

- `NEXT_PUBLIC_WHATSAPP_NUMBER` debe contener el número oficial con código de país, sin `+` ni
  espacios.
- El enlace abre WhatsApp con el mensaje prellenado.
- Si la variable no está definida, se muestra un panel de demostración con el mensaje y una
  respuesta humana de ejemplo. No hay envío real.
- No incluya números inventados ni números de prueba en `.env.example`, README o código.

## 14. Shopify

Shopify **no está integrado todavía**. La preparación actual consiste en:

1. Mantener la UI dependiendo de `CatalogRepository`.
2. Implementar un adaptador de Shopify Storefront API que cumpla el mismo contrato.
3. Cambiar la exportación `catalog` al nuevo adaptador.
4. Resolver el carrito y checkout reales, incluyendo líneas, variantes, impuestos, envío y pedidos.

El detalle del mapeo está en `lib/catalog/README.md`.

## 15. Validación antes de entregar

```sh
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
```

Además, compruebe manualmente:

- `/`, `/estantes`, `/libros/inseparables`, `/carrito`, `/compra/demo`, confirmación y caja.
- Un slug de estante inválido y un libro inexistente devuelven `404`.
- La guía sin cookie redirige a `/guias/acceso`.
- Contraseña incorrecta muestra error; contraseña correcta permite entrar.
- El carrito persiste al recargar, actualiza cantidades y elimina artículos.
- El checkout vacío y la confirmación sin pedido muestran sus estados vacíos.
- La vista móvil no tiene overflow horizontal.
- Las páginas privadas tienen `noindex`.

## 16. Despliegue en Vercel

1. Importe el repositorio en Vercel.
2. Configure **Root Directory** en `lazox-v2`.
3. Defina `GUIDE_ACCESS_PASSWORD` y, si corresponde, `NEXT_PUBLIC_WHATSAPP_NUMBER` y
   `NEXT_PUBLIC_SITE_URL`.
4. Vercel detecta Next.js y usa `pnpm install` / `pnpm build`.

## 17. Estructura del repositorio

La raíz de Git contiene dos áreas:

- `lazox-v2/`: aplicación Next.js desplegable. **Este es el proyecto activo.**
- `prework/`: presentación estática independiente de estrategia. No forma parte del build de
  Vercel ni debe mezclarse con la aplicación.

El último commit del repositorio puede corresponder al snapshot anterior a la migración. No asuma
que `HEAD` refleja el estado actual: revise siempre `git status` y el árbol de trabajo.

## 18. Documentación para agentes

- [`AGENTS.md`](./AGENTS.md): instrucciones persistentes de OpenCode.
- [`TODO.md`](./TODO.md): pendientes priorizados y criterios de cierre.
- [`opencode.jsonc`](./opencode.jsonc): configuración mínima que carga este README y el TODO como
  instrucciones.
- [`lib/catalog/README.md`](./lib/catalog/README.md): contrato de catálogo y mapeo a Shopify.

Si cambia una ruta, variable, flujo o decisión editorial, actualice esta documentación y `TODO.md`
en el mismo cambio.
