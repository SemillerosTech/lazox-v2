# LAZOX

Tienda de libros, estantes, guías y conversaciones para crecer juntos. Incluye el borrador
navegable de **Inseparables**: portada, ficha, guía pública, carrito, compra de demostración,
confirmación y representación de la caja.

> **Documento de contexto para personas y agentes.** Antes de modificar el proyecto, lea también
> [`AGENTS.md`](./AGENTS.md) y [`TODO.md`](./TODO.md). `AGENTS.md` contiene las reglas operativas;
> `TODO.md` es la lista viva de pendientes. La hoja de las 27 tarjetas está en
> [`docs/lo-de-adentro-afuera.md`](./docs/lo-de-adentro-afuera.md).

## 1. Contexto del proyecto

LAZOX trabaja con familias, escuelas y comunidades. La propuesta editorial organiza los libros en
**10 estantes emocionales** identificados con códigos internos `EST-01`…`EST-10`.

El borrador sirve para validar el recorrido alrededor de un solo libro aprobado:

| Dato             | Valor                                                                     |
| ---------------- | ------------------------------------------------------------------------- |
| Libro            | **Inseparables**                                                          |
| Autora           | Mar Pavón                                                                 |
| Ilustradora      | María Girón                                                               |
| Editorial        | Tramuntana Editorial                                                      |
| Año              | 2015                                                                      |
| ISBN             | 978-84-943046-0-6                                                         |
| Páginas          | 48                                                                        |
| Edad sugerida    | Hacia los 7 años en adelante, y por toda la familia                       |
| Estante          | `EST-03` — “teme perder lo que ama”                                       |
| Precio normal    | **$435 MXN**                                                              |
| Dos precios      | Construidos y apagados para el público                                    |
| Estado editorial | Recomendación interna provisional, sin marcas visibles en la tienda       |
| Guía             | Pública en el borrador; licencia pendiente con Semilleros de Sentido A.C. |

Los demás estantes existen y se muestran en orden editorial, pero **no tienen libros ni
recomendaciones inventadas**. Su estado es “selección en preparación”.

## 2. Estado actual

### Implementado y verificado

- Fachada alineada a las 27 tarjetas de `docs/lo-de-adentro-afuera.md`.
- Migración a Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4 y pnpm.
- Portada con el orden aprobado: primera franja, dos puertas de entrada, ocho estantes, Inseparables,
  cinco preguntas, qué trae la caja y bloques de Trazaurus y escuelas.
- Menú de cinco puertas: Libros, Guías, Trazaurus, Para escuelas y Nosotros. Sin buscador, cuenta
  ni newsletter.
- Pie con la línea de SILEE®, cuatro columnas y enlace al sitio de Semilleros de Sentido A.C.
- Índice y detalle de los diez estantes, sin códigos `EST-` a la vista.
- Ficha de Inseparables en el orden aprobado, con páginas, pregunta, guía y compra.
- Dos precios construidos para lotes de precio libre, con la frase aprobada, dos montos del mismo
  tamaño y selección que viaja al carrito. Apagados con `NEXT_PUBLIC_ENABLE_DUAL_PRICING=false`.
- Vista interna `/revision/precios` con un libro de prueba marcado como de precio libre.
- Guía pública sin contraseña, con aviso de licencia pendiente, `noindex`, atribución y versión
  imprimible para guardar como PDF.
- Carrito con `localStorage`, cantidades, eliminación, subtotal y selección de precio.
- Checkout ficticio con tarjeta, billeteras digitales, OXXO y transferencia; sin meses sin
  intereses y sin cobro.
- Confirmación con la guía y la factura primero, resumen, pregunta «¿Cómo nos conoció?» e
  invitación a escuelas.
- WhatsApp por pantalla con mensaje preparado. Sin número oficial, muestra un panel de
  demostración y no abre WhatsApp.
- «Solicitar factura» usa `NEXT_PUBLIC_SHOPIFY_INVOICE_URL` y, si no existe, lleva a `/factura`.
- `noindex, nofollow` global y `robots.txt` bloqueado mientras sea borrador.
- Recorrido guiado de 16 pasos para la demostración ejecutiva, aislado y activado por variable.
- Páginas «En preparación» para las rutas que aún no tienen contenido aprobado.
- Documentación de catálogo, despliegue y pendientes.

### Verificaciones realizadas

- `pnpm format:check`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- Rutas públicas y privadas, respuestas `404` y guía sin contraseña.
- Flujo manual de carrito: agregar, cambiar cantidad, recargar, eliminar y comprobar subtotal.
- Checkout, confirmación, caja, sesión sin pedido y estados vacíos.
- Revisión responsive a 390 px y 1440 px, sin overflow horizontal ni errores de consola.
- WhatsApp sin número: panel de demostración con el mensaje preparado.

No existe todavía una suite automatizada de pruebas ni integración real con Shopify.

## 3. Stack

- [Next.js 16](https://nextjs.org) con App Router y Turbopack.
- React 19.
- TypeScript en modo estricto.
- Tailwind CSS v4.
- [lucide-react](https://lucide.dev) para iconografía.
- [Driver.js](https://driverjs.com) solo para el recorrido de demostración.
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

No hay contraseña de guía. `GUIDE_ACCESS_PASSWORD` y `GUIDE_PUBLIC_DEMO` ya no existen. La guía se
abre directamente y conserva su aviso de licencia pendiente.

## 6. Variables de entorno

| Variable                          | Obligatoria | Uso                                                                                                                      |
| --------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`     | No          | Número oficial con código de país, sin `+` ni espacios. Si está vacío, se muestra el panel de demostración.              |
| `NEXT_PUBLIC_SITE_URL`            | No          | URL pública para el sitemap y metadatos canónicos.                                                                       |
| `NEXT_PUBLIC_ENABLE_DEMO_TOUR`    | No          | `"true"` activa el recorrido guiado de demostración. Cualquier otro valor o su ausencia lo desactiva.                    |
| `NEXT_PUBLIC_ENABLE_DUAL_PRICING` | No          | `"true"` enciende los dos precios en la ficha. Debe quedar apagado para el público hasta la aprobación legal y contable. |
| `NEXT_PUBLIC_SHOPIFY_INVOICE_URL` | No          | URL del sistema de facturación de Shopify. Si está vacía, «Solicitar factura» lleva a `/factura`.                        |

`NEXT_PUBLIC_*` se incorpora en tiempo de build. Defina esas variables antes de `pnpm dev` o
`pnpm build`.

No agregue contraseñas, números reales ni secretos a `.env.example`.

## 7. Rutas

| Ruta                        | Tipo     | Descripción                                                       |
| --------------------------- | -------- | ----------------------------------------------------------------- |
| `/`                         | Pública  | Portada con el orden aprobado                                     |
| `/estantes`                 | Pública  | Los 10 estantes en orden editorial, sin códigos visibles          |
| `/estantes/[slug]`          | Pública  | Detalle de estante; los vacíos muestran estado neutro             |
| `/libros/[slug]`            | Pública  | Ficha de Inseparables                                             |
| `/guias`                    | Pública  | Colección de guías                                                |
| `/guias/[slug]`             | Pública  | Guía para conversar en familia; `noindex`                         |
| `/guias/[slug]/descargar`   | Pública  | Versión imprimible de la guía; `noindex`                          |
| `/cinco-preguntas`          | Pública  | Regalo «Cinco preguntas»; hoy «En preparación»                    |
| `/trazaurus`                | Pública  | Serie Trazaurus; hoy «En preparación»                             |
| `/para-escuelas`            | Pública  | Ferias, acervos, renta y equipamiento, con WhatsApp por bloque    |
| `/nosotros`                 | Pública  | Página institucional; hoy «En preparación»                        |
| `/factura`                  | Pública  | Facturación; hoy «En preparación»                                 |
| `/envios`                   | Pública  | Envíos; borrador legal para revisión                              |
| `/devoluciones`             | Pública  | Devoluciones; borrador legal para revisión                        |
| `/preguntas-frecuentes`     | Pública  | Preguntas frecuentes; hoy «En preparación»                        |
| `/que-es-silee`             | Pública  | Qué es SILEE; hoy «En preparación»                                |
| `/lo-que-esta-casa-promete` | Pública  | Promesas de la casa; hoy «En preparación»                         |
| `/privacidad`               | Pública  | Aviso de privacidad; borrador legal para revisión                 |
| `/terminos`                 | Pública  | Términos y condiciones; borrador legal para revisión              |
| `/carrito`                  | No index | Carrito con cantidades, eliminación y subtotal                    |
| `/compra/demo`              | No index | Checkout ficticio                                                 |
| `/pedido/confirmacion-demo` | No index | Confirmación de la compra ficticia                                |
| `/pedido/caja-demo`         | No index | Representación conceptual de la caja                              |
| `/revision/precios`         | Interna  | Vista de los dos precios con un libro de prueba; no está enlazada |

Los códigos de estante son estables. Los slugs actuales son `est-01`…`est-10`; solo `est-03`
tiene un libro. El código vive en la dirección, los datos y la medición, nunca en la vista.

## 8. Arquitectura

```text
app/
  layout.tsx                  Layout raíz, fuentes y metadata global con noindex
  (site)/
    layout.tsx                CartProvider, WhatsAppProvider y DemoTourMount
    (shell)/
      layout.tsx              Header, footer, WhatsApp fijo y skip link
      page.tsx                Portada
      estantes/               Índice y detalle de estantes
      libros/[slug]/          Ficha de libro
      guias/                  Colección de guías
      carrito/                Carrito
      compra/demo/            Checkout ficticio
      pedido/                 Confirmación y caja
      cinco-preguntas/        Regalo pendiente
      trazaurus/              Serie pendiente
      para-escuelas/          Opciones para escuelas
      nosotros/               Página institucional pendiente
      factura/                Factura pendiente
      envios/                 Envíos pendiente
      devoluciones/           Devoluciones pendiente
      preguntas-frecuentes/   Preguntas pendientes
      que-es-silee/           SILEE pendiente
      lo-que-esta-casa-promete/ Promesas pendientes
      privacidad/             Privacidad pendiente
      terminos/               Términos pendientes
      revision/precios/       Vista interna de dos precios
    guias/[slug]/             Guía pública en borrador, sin shell de tienda
    guias/[slug]/descargar/   Versión imprimible
  sitemap.ts                  Sitemap público, condicionado a NEXT_PUBLIC_SITE_URL
  error.tsx                   Error boundary de aplicación
  global-error.tsx            Error boundary global
  not-found.tsx               404
components/                   Componentes compartidos de UI
features/
  demo-tour/                  Recorrido guiado aislado, cargado solo con la flag activa
lib/
  cart/                       Store, persistencia y pedido de demostración
  catalog/                    Contrato CatalogRepository y adaptador local
  data/                       Datos editoriales provisionales
  pricing.ts                  Precio normal, precio libre y 30 % económico
  site-nav.ts                 Navegación del header y columnas del pie
  whatsapp.ts                 URL, mensajes y número
  whatsapp-context.tsx        Mensaje por pantalla y WhatsApp fijo
  types.ts                    Modelos de dominio
public/                       Logo, robots.txt y favicon
```

### Decisiones técnicas relevantes

- **Server Components por defecto.** Los componentes cliente se limitan a carrito, formularios,
  menú móvil, WhatsApp, selección de precio, impresión y recorrido guiado.
- **Datos desacoplados.** Las páginas consumen `CatalogRepository` (`lib/catalog/index.ts`). La
  implementación activa es `localCatalog`, respaldada por `lib/data/`.
- **Carrito externo.** `lib/cart/cart-store.ts` usa `useSyncExternalStore` para evitar parpadeos de
  hidratación y compartir estado entre páginas.
- **Precio en centavos.** `43500` representa `$435 MXN`; nunca use números flotantes para dinero.
- **Guía pública en borrador.** No hay `proxy.ts`, cookie ni contraseña. La página se abre directo,
  conserva el aviso de licencia pendiente y declara `noindex`. El `noindex` no es control de acceso.
- **Dos precios apagados.** `NEXT_PUBLIC_ENABLE_DUAL_PRICING` controla la vista pública. El carrito
  vuelve a validar la opción para que un valor manipulado no aplique el precio económico.
- **Tailwind v4.** Los tokens de color viven en `app/globals.css`; conserve los nombres `brand-*`.

## 9. Datos y contenido

- `lib/data/books.ts`: libro aprobado, precio, páginas, disponibilidad y textos editoriales.
- `lib/data/shelves.ts`: los 10 estantes en orden y sus libros.
- `lib/data/guides.ts`: guía construida a partir del contenido aprobado del libro.
- `lib/data/recommendations.ts`: recomendación interna provisional de `EST-03`.
- `lib/data/pricing-preview.ts`: libro de prueba para la vista interna de dos precios.
- `lib/catalog/index.ts`: contrato que deberá cumplir un futuro adaptador de Shopify.
- `lib/catalog/README.md`: mapeo previsto a Shopify Storefront API.

No invente sinopsis, preguntas, reglas, libros, autores, ISBN, precios ni recomendaciones. Si falta
contenido editorial, use un estado vacío o deje el pendiente en `TODO.md`.

## 10. Carrito y compra de demostración

- Persistencia: `localStorage`, clave `lazox:cart:v2`, con migración desde `lazox:cart:v1`.
- Cantidades permitidas: enteros entre 1 y 99.
- El carrito se comparte mediante `CartProvider` y `useCart()`.
- Cada línea guarda `priceOption` (`normal` o `economic`). El carrito valida la opción contra el
  libro y la variable de dos precios.
- La compra se guarda solo en `sessionStorage` (`lazox:demo-order:v1`) para mostrar la confirmación.
- El checkout no envía datos a ningún servidor.
- Formas de pago: tarjeta, billeteras digitales, OXXO y transferencia. Sin meses sin intereses.
- «Solicitar factura» usa `NEXT_PUBLIC_SHOPIFY_INVOICE_URL` o `/factura`.
- La etiqueta obligatoria es:

  > Demostración: no se realizará ningún cargo ni se generará un pedido real.

No convierta este flujo en una compra real sin integrar antes el checkout, pedidos, correo y
cumplimiento legal correspondientes.

### 10.1 Recorrido guiado de demostración

El recorrido para Gero vive en `features/demo-tour/` y está aislado del resto de la aplicación.

- **Activación:** solo se muestra si `NEXT_PUBLIC_ENABLE_DEMO_TOUR=true` en el entorno de
  `pnpm dev` o de `pnpm build`. Con `false`, vacío o ausente no se monta el controlador, no aparece
  el botón y no se carga Driver.js.
- **Inicio:** botón discreto “Iniciar recorrido de muestra”. Nunca se inicia automáticamente. Al
  comenzar vuelve a la portada y arranca en el paso 1.
- **Reinicio y salida:** “Salir” cierra el recorrido en cualquier paso; “Finalizar recorrido” lo
  cierra al terminar. Ambos limpian overlays, listeners y el paso guardado. No hay reanudación
  automática después de recargar la página.
- **Navegación:** son 16 pasos por las rutas reales. “Anterior” y “Siguiente” pueden cruzar de
  página; el controlador espera el elemento `data-tour` correspondiente antes de abrir el popover.
- **Interacción bloqueada:** mientras el recorrido está activo, la página y el área resaltada no
  reciben clics ni toques. Solo responden los controles del popover.
- **Guía:** el paso entra directamente a la guía pública, sin contraseña.
- **WhatsApp:** el paso muestra el mensaje preparado dentro del popover y desactiva la interacción
  con el botón real. No abre WhatsApp, no usa un número inventado y no envía nada.
- **Carrito:** el paso de compra agrega Inseparables con cantidad 1 usando el store existente.
- **Checkout:** el paso de pago crea la misma orden de demostración del checkout, la guarda en
  `sessionStorage`, vacía el carrito y abre la confirmación. No hay cobro, correo ni pedido real.
- **Estado del recorrido:** solo se guarda el identificador del paso en
  `sessionStorage` (`lazox:demo-tour:v1`). Nunca se guardan datos personales, de pago o del carrito.
- **Último paso:** popover centrado sin elemento resaltado. Ofrece “Finalizar recorrido” y, como
  opción, “Volver al inicio”.
- **Responsive:** el botón se coloca abajo a la izquierda en el celular y abajo a la derecha en
  escritorio, lejos del botón de WhatsApp. Validar que no tape contenido esencial.

Qué es real y qué es simulado:

| Real                                                           | Simulado                                                      |
| -------------------------------------------------------------- | ------------------------------------------------------------- |
| Navegación entre páginas y estados reales.                     | Cobro, pedido, correo y envío.                                |
| Guía pública y versión imprimible.                             | Contenido extenso y licencia definitiva de la guía.           |
| Carrito en `localStorage` y orden en `sessionStorage`.         | WhatsApp: solo se muestra el mensaje preparado.               |
| Actualización de cantidad y subtotal con el store del carrito. | Portada, caja y materiales con composiciones de demostración. |
| Selección de precio normal o económico.                        | Precio libre real y aprobación legal del 30 %.                |

Para retirar la demostración cuando ya no se necesite, siga la sección de limpieza de
[`TODO.md`](./TODO.md).

## 11. Guía

- Ruta pública: `/guias/inseparables`.
- Sin contraseña, cookie ni `proxy.ts`. La guía se abre directamente.
- `noindex` en la guía y en la versión imprimible.
- Aviso visible: la licencia con Semilleros de Sentido A.C. debe confirmarse como firmada antes de
  publicarla.
- Atribución literal: “Guía de Semilleros de Sentido A.C., usada por Lazox bajo licencia.”
- Solo muestra el contenido aprobado de la tarjeta: sinopsis, pregunta y regla. El contenido
  extenso y la licencia definitiva están pendientes.
- La descarga abre una versión imprimible con `window.print()` para guardar como PDF. No hay PDF
  firmado ni archivo estático inventado.
- La guía no tiene menú de tienda, carrito, precio, redes ni personaje.
- La última página incluye la línea para escuelas.

La guía es pública mientras sea borrador. No es un sistema de cuentas ni un control de acceso.
Antes de producción hay que confirmar la licencia y decidir si seguirá abierta o requerirá otro
esquema.

## 12. Reglas editoriales y de marca

Estas reglas vienen del brief y de las 27 tarjetas. No deben cambiarse sin aprobación:

- LAZOX habla de **usted**. Los textos de Rossy se conservan literalmente aunque usen “tú”.
- No usar lenguaje clínico.
- No usar «experiencia» ni sus variantes en contenido público. Según el contexto, preferir
  «recorrido», «conversación», «acompañamiento», «aparador», «libros», «lecturas» o «actividades».
- Precio normal: `$435 MXN`. Sin descuentos, promociones, precios tachados, relojes ni meses sin
  intereses. No usar «Precio único».
- Dos precios solo para lotes de precio libre: normal y económico (30 % menos), sin nombres
  visibles. Apagados para el público hasta la aprobación legal y contable.
- La recomendación de `EST-03` permanece **provisional** en los datos internos, sin marcas visibles
  en la tienda.
- Solo `EST-03` tiene un libro aprobado. Los demás estantes muestran un estado vacío neutral.
- Los códigos `EST-01`…`EST-10` no se muestran; viven en direcciones y datos.
- El nombre de Rossy no aparece en la tienda mientras ella no lo decida.
- La guía solo muestra el contenido aprobado de la tarjeta. El contenido extenso y la licencia
  definitiva están pendientes.
- El libro vecino y la tarjeta del buen vecino están pendientes de definición. Si no existen, no se
  muestran.
- La portada actual es una composición CSS; no hay imágenes oficiales. L1 y C1 son huecos visibles.
- El anfitrión no se muestra hasta que exista un asset aprobado.
- SILEE y la asociación solo se nombran en la línea del pie y en páginas sin precio.
- No inventar opiniones, estrellas, testimonios, productos, títulos, autores, precios ni cifras.

## 13. WhatsApp

- `NEXT_PUBLIC_WHATSAPP_NUMBER` debe contener el número oficial con código de país, sin `+` ni
  espacios. Si está vacío, se muestra un panel de demostración con el mensaje preparado.
- Mensajes por pantalla:
  - Ficha: «Hola, quiero preguntar por el libro [título].»
  - Estante: «Hola, busco un libro para un niño o una niña que [nombre del estante].»
  - Escuelas: «Hola, escribo de una escuela. Me interesa [una feria / un acervo / la renta /
    equipamiento].»
  - Confirmación: «Hola, conozco una escuela donde me gustaría que se leyera así.»
  - Cualquier otra: «Hola, tengo una pregunta.»
- El botón fijo aparece en el celular y el del menú en escritorio. El pie también ofrece WhatsApp.
- No incluya números inventados ni números de prueba en `.env.example`, README o código.
- Las respuestas rápidas de la confirmación (Mamá o papá, Maestro o maestra, Directivo, Otro; Sí,
  Más adelante; «Gracias. Gero le escribe [plazo].») quedan pendientes de la línea oficial.

## 14. Shopify

Shopify **no está integrado todavía**. La preparación actual consiste en:

1. Mantener la UI dependiendo de `CatalogRepository`.
2. Implementar un adaptador de Shopify Storefront API que cumpla el mismo contrato.
3. Cambiar la exportación `catalog` al nuevo adaptador.
4. Resolver el carrito y checkout reales, incluyendo líneas, variantes, impuestos, envío y pedidos.
5. Conectar `NEXT_PUBLIC_SHOPIFY_INVOICE_URL` al sistema de facturación.

El detalle del mapeo está en `lib/catalog/README.md`.

## 15. Validación antes de entregar

```sh
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
```

Además, compruebe manualmente:

- `/`, `/estantes`, `/libros/inseparables`, `/carrito`, `/compra/demo`, confirmación, caja y guía.
- Un slug de estante inválido y un libro inexistente devuelven `404`.
- `/guias/inseparables` abre sin contraseña y muestra el aviso de licencia.
- El carrito persiste al recargar, actualiza cantidades y elimina artículos.
- El checkout vacío y la confirmación sin pedido muestran sus estados vacíos.
- Las casillas de avisos aparecen sin marcar.
- La confirmación muestra la guía y la factura antes del resumen.
- La vista móvil no tiene overflow horizontal.
- Las páginas privadas y de demostración tienen `noindex`.
- Con WhatsApp vacío, los botones muestran el panel de demostración.
- `/revision/precios` muestra los dos montos y no está enlazada.
- No aparecen «EST-», «provisional», «pendiente», «Precio único», opiniones ni estrellas.

## 16. Despliegue en Vercel

1. Importe el repositorio en Vercel.
2. Configure **Root Directory** en `lazox-v2`.
3. Defina `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_SITE_URL`,
   `NEXT_PUBLIC_ENABLE_DEMO_TOUR=true` y `NEXT_PUBLIC_SHOPIFY_INVOICE_URL` si corresponde.
4. Deje `NEXT_PUBLIC_ENABLE_DUAL_PRICING=false` hasta la aprobación legal y contable.
5. Vercel detecta Next.js y usa `pnpm install` / `pnpm build`. Las variables `NEXT_PUBLIC_*` deben
   existir antes del build.
6. Mientras sea borrador, mantenga `noindex, nofollow` y `robots.txt` bloqueado. Retírelos el día
   que la tienda abra en `lazox.com`.

## 17. Estructura del repositorio

La raíz de Git contiene tres áreas:

- `lazox-v2/`: aplicación Next.js desplegable. **Este es el proyecto activo.**
- `prework/`: presentación estática independiente de estrategia. No forma parte del build de
  Vercel ni debe mezclarse con la aplicación.
- `docs/lo-de-adentro-afuera.md`: hoja de referencia de las 27 tarjetas. No se formatea ni se
  reescribe.

El último commit del repositorio puede corresponder al snapshot anterior a la migración. No asuma
que `HEAD` refleja el estado actual: revise siempre `git status` y el árbol de trabajo.

## 18. Documentación para agentes

- [`AGENTS.md`](./AGENTS.md): instrucciones persistentes de OpenCode.
- [`TODO.md`](./TODO.md): pendientes priorizados y criterios de cierre.
- [`opencode.jsonc`](./opencode.jsonc): configuración mínima que carga este README y el TODO como
  instrucciones.
- [`lib/catalog/README.md`](./lib/catalog/README.md): contrato de catálogo y mapeo a Shopify.
- [`docs/lo-de-adentro-afuera.md`](./docs/lo-de-adentro-afuera.md): hoja de las 27 tarjetas.

Si cambia una ruta, variable, flujo o decisión editorial, actualice esta documentación y `TODO.md`
en el mismo cambio.
