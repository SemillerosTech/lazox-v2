# AGENTS.md — LAZOX v2

Este archivo contiene las instrucciones persistentes para cualquier agente que trabaje en este
proyecto. Aplica a todo el árbol de `lazox-v2/`.

## 1. Lectura obligatoria

Antes de cambiar comportamiento, contenido o arquitectura, lea:

1. [`README.md`](./README.md): contexto, estado, rutas y decisiones.
2. [`TODO.md`](./TODO.md): pendientes editoriales, técnicos y de lanzamiento.
3. [`lib/catalog/README.md`](./lib/catalog/README.md): contrato de catálogo y preparación para
   Shopify.
4. [`docs/lo-de-adentro-afuera.md`](./docs/lo-de-adentro-afuera.md): hoja de Gero con las 27
   tarjetas de la fachada. Es el documento de referencia de esta entrega; no lo edite.

Si la documentación y el código no coinciden, investigue antes de asumir que uno de los dos está
equivocado. No invente requisitos ni contenido editorial.

## 2. Contexto operativo

- **Proyecto activo:** `lazox-v2/`, una aplicación Next.js 16 desplegable en Vercel con Root
  Directory `lazox-v2`.
- **Repositorio:** la raíz de Git también contiene `prework/`, una presentación estática
  independiente. No es parte de la aplicación, no se despliega con ella y no debe mezclarse.
- **Estado de Git:** el último commit puede ser el snapshot anterior a la migración. Revise
  `git status`; no asuma que `HEAD` contiene el estado actual.
- **Alcance actual:** borrador navegable de la tienda Lazox. No hay Shopify, checkout real, correo
  real, pedidos reales, cuentas de usuario ni búsqueda.
- **Borrador cerrado a buscadores:** el layout raíz declara `noindex, nofollow` y
  `public/robots.txt` bloquea el rastreo. Esa protección se retira el día que la tienda abra en
  `lazox.com`.
- **Guía pública en borrador:** `/guias/[slug]` se abre sin contraseña. La licencia con Semilleros
  de Sentido A.C. sigue pendiente y el aviso de borrador debe permanecer visible. No hay control
  de acceso; el `noindex` es una capa adicional, no una barrera.
- **Dos precios construidos y apagados:** la ficha puede mostrar precio normal y económico cuando
  un lote es de precio libre y `NEXT_PUBLIC_ENABLE_DUAL_PRICING=true`. Para el público debe quedar
  apagado hasta que abogado y contador cierren la cuenta del 30 %. La vista interna de revisión es
  `/revision/precios`.
- **WhatsApp sin número oficial:** con `NEXT_PUBLIC_WHATSAPP_NUMBER` vacío se muestra un panel de
  demostración con el mensaje preparado. No se abre WhatsApp ni se envía nada.
- **Stack:** Next.js 16 App Router, React 19, TypeScript estricto, Tailwind CSS v4, pnpm 11.

No agregue Lovable, Vite, Bun, TanStack, shadcn/ui, Radix ni dependencias equivalentes. Tampoco
cambie de gestor de paquetes.

## 3. Comandos

Ejecute los comandos desde `lazox-v2/`.

```sh
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm typecheck
pnpm format
pnpm format:check
```

Antes de dar por terminado un cambio, ejecute como mínimo:

```sh
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
```

`docs/` está excluido de Prettier porque es el documento de referencia recibido. No lo formatee ni
lo reescriba para hacer pasar `format:check`.

El recorrido guiado de demostración solo se activa con `NEXT_PUBLIC_ENABLE_DEMO_TOUR=true` antes
del build. Con `false`, vacío o ausente no debe montarse ni cargar Driver.js.

Nunca escriba una contraseña real, un número de WhatsApp real ni secretos en el repositorio, en
capturas, en documentación o en un commit. `.env.local` no se versiona.

## 4. Mapa de arquitectura

```text
app/
  layout.tsx                  Metadata global, fuentes y layout raíz
  (site)/
    layout.tsx                CartProvider, WhatsAppProvider y DemoTourMount
    (shell)/                  Shell público: header, footer y WhatsApp fijo
      page.tsx                Portada
      estantes/               Índice y detalle de estantes
      libros/[slug]/          Ficha
      guias/                  Colección de guías
      carrito/                Carrito
      compra/demo/            Checkout ficticio
      pedido/                 Confirmación y caja
      cinco-preguntas/        Página del regalo (En preparación)
      trazaurus/              Página de la serie (En preparación)
      para-escuelas/          Ferias, acervos, renta y equipamiento
      nosotros/               Página institucional (En preparación)
      factura/                Factura (En preparación)
      envios/                 Envíos (borrador legal)
      devoluciones/           Devoluciones (borrador legal)
      preguntas-frecuentes/   Preguntas frecuentes (En preparación)
      que-es-silee/           Qué es SILEE (En preparación)
      lo-que-esta-casa-promete/ Promesas de la casa (En preparación)
      privacidad/             Aviso de privacidad (borrador legal)
      terminos/               Términos (borrador legal)
      revision/precios/       Vista interna de los dos precios
    guias/[slug]/             Guía pública en borrador, sin shell de tienda
    guias/[slug]/descargar/   Versión imprimible de la guía
  sitemap.ts                  Sitemap público, condicionado a NEXT_PUBLIC_SITE_URL
components/                   UI compartida
features/demo-tour/           Recorrido guiado aislado, activado por variable
lib/
  cart/                       Store, localStorage y pedido de demostración
  catalog/                    CatalogRepository y adaptador local
  data/                       Datos editoriales provisionales
  pricing.ts                  Precio normal, precio libre y 30 % económico
  site-nav.ts                 Navegación del header y columnas del pie
  whatsapp.ts                 URL, mensajes y número
  whatsapp-context.tsx        Mensaje por pantalla y WhatsApp fijo
  types.ts                    Modelos de dominio
public/                       Assets estáticos, robots.txt y favicon
```

No existe `proxy.ts` ni módulo de acceso a la guía. La guía es pública en este borrador.

## 5. Reglas de producto y contenido

Estas reglas son parte del brief y de las 27 tarjetas. No las cambie sin aprobación:

- **Precio:** `$435 MXN` es el precio normal de Inseparables. No agregue descuentos, promociones,
  precios tachados, relojes, avisos de existencias ni meses sin intereses. No use «Precio único».
- **Dos precios:** solo para lotes de precio libre (36 meses o más desde la impresión o
  reimpresión). Se muestran dos montos del mismo tamaño, sin nombres visibles, con la frase exacta
  aprobada. El económico es el normal menos 30 %. Un producto, un SKU y un inventario. La opción
  permanece apagada para el público hasta la aprobación legal y contable.
- **Textos de Rossy:** sinopsis, pregunta, regla y textos editoriales aprobados son literales. No
  los «mejore», corrija ni reescriba.
- **Tono LAZOX:** en usted. Los textos de Rossy pueden usar «tú» y deben permanecer así.
- **Sin lenguaje clínico.**
- **Sin «experiencia»:** no usar «experiencia» ni sus variantes en contenido público. Elegir
  «recorrido», «conversación», «acompañamiento», «aparador», «libros», «lecturas» o «actividades»
  según el contexto.
- **Códigos internos:** `EST-01`…`EST-10` viven en direcciones, datos y medición, nunca en la
  vista. Las migajas usan el nombre del estante.
- **Solo `EST-03`** tiene un libro aprobado. Los demás estantes muestran un estado vacío neutral.
- **Marcas de trabajo fuera de la vista:** no mostrar «provisional», «pendiente», «EST-» ni el
  nombre de Rossy en la tienda. El estado interno vive en los datos y en Shopify cuando exista.
- **No inventar** libros, recomendaciones, ISBN, autores, contenido de guía, números de WhatsApp,
  enlaces legales, opiniones, estrellas, testimonios, precios ni datos de contacto.
- **Guía:** pública en el borrador, sin contraseña. Mantener el aviso de licencia pendiente y la
  atribución literal: “Guía de Semilleros de Sentido A.C., usada por Lazox bajo licencia.” El
  contenido extenso y la licencia definitiva están pendientes.
- **SILEE y la asociación:** solo se nombran en la línea del pie y en páginas sin precio. La línea
  literal es: “Lazox apoya el proyecto SILEE® de Semilleros de Sentido A.C.”
- **Portada:** composición CSS marcada como demostración. No hay imágenes oficiales. La toma L1 y
  la toma C1 son huecos visibles.
- **Anfitrión:** no se muestra hasta que exista un asset aprobado. No inventar personajes ni caras
  de niños.
- **Caja:** «Qué trae la caja» se muestra en el borrador con el hueco C1 y los cuatro renglones
  aprobados.
- **Cinco preguntas:** la página dice «En preparación» hasta que Rossy firme la tarjeta. No hay
  PDF inventado.
- **Sin buscador, cuenta ni newsletter:** no hay flujo asociado. No agregue formularios que pidan
  datos sin decisión explícita.

## 6. Reglas técnicas

- Use **Server Components** por defecto. Agregue `"use client"` solo cuando se necesiten estado,
  efectos, eventos del navegador o APIs como `localStorage`.
- No reemplace el store externo del carrito por lecturas de `localStorage` dentro de un
  `useEffect` sin resolver la hidratación. El carrito usa `useSyncExternalStore` deliberadamente.
- Los precios se guardan en **centavos**. No use `number` flotante para dinero.
- Las páginas deben consumir `CatalogRepository` (`lib/catalog/index.ts`). No agregue nuevos
  imports directos de `lib/data/` en páginas o componentes.
  - Excepción conocida: `lib/cart/cart-context.tsx` resuelve el libro para mostrar el carrito con
    `findBookBySlug`. Si integra Shopify, primero desacople ese punto.
- La selección de precio viaja al carrito como `priceOption` (`normal` o `economic`). El carrito
  vuelve a validar que el libro sea de precio libre y que la opción esté encendida.
- Conserve los tokens `brand-*` y el lenguaje visual en `app/globals.css`.
- Use `next/link` para navegación interna y `next/image` para imágenes cuando corresponda.
- Mantenga `metadata` y `noindex` en las páginas privadas o de demostración. No confíe en
  `robots.txt` como control de acceso.
- La guía no tiene contraseña ni cookie. Su `noindex` y el aviso de licencia son obligatorios
  mientras sea borrador.
- No elimine la etiqueta exacta:
  “Demostración: no se realizará ningún cargo ni se generará un pedido real.”
- «Solicitar factura» usa `NEXT_PUBLIC_SHOPIFY_INVOICE_URL`; si no existe, lleva a `/factura`, que
  dice «En preparación». No invente un sistema de facturación.
- El WhatsApp fijo y el del menú comparten el mensaje de la pantalla. Si no hay número, muestran
  el panel de demostración.
- No convierta el checkout, el correo o el WhatsApp en flujos reales sin una decisión explícita.

## 7. Seguridad y datos

- No exponga secretos en componentes cliente, logs, URLs o documentación.
- No agregue secretos a `.env.example`; use valores vacíos o marcadores.
- No escriba datos personales de prueba en logs persistentes.
- No agregue `dangerouslySetInnerHTML` con contenido no controlado.
- No active un número de WhatsApp real sin que Gero lo entregue. No use números inventados.
- La guía es pública en el borrador: no publique contenido licenciado sin la autorización
  correspondiente.
- El checkout es ficticio. No lo conecte a pagos, correo o pedidos reales sin completar los
  pendientes de P1.

## 8. Flujo de trabajo

1. Revise `git status` y no revierta cambios que no haya hecho usted.
2. Lea el archivo relevante antes de editar. Prefiera cambios pequeños y consistentes.
3. Actualice la documentación en el mismo cambio si modifica rutas, variables, flujos o decisiones.
4. No haga commit, push ni despliegue sin que se le pida explícitamente.
5. No modifique `prework/` ni el documento `docs/lo-de-adentro-afuera.md`.
6. No agregue dependencias si la plataforma o los componentes existentes ya resuelven el problema.
7. No use `pnpm dlx` para introducir herramientas que no estén aprobadas.

## 9. Validación funcional mínima

Además del build:

- `/`, `/estantes`, `/estantes/est-03`, `/libros/inseparables`, `/carrito`, `/compra/demo`,
  `/pedido/confirmacion-demo`, `/pedido/caja-demo`, `/guias`, `/guias/inseparables`,
  `/guias/inseparables/descargar`, `/cinco-preguntas`, `/trazaurus`, `/para-escuelas`,
  `/nosotros`, `/factura`, `/envios`, `/devoluciones`, `/preguntas-frecuentes`, `/que-es-silee`,
  `/lo-que-esta-casa-promete`, `/privacidad` y `/terminos` responden correctamente.
- Un estante o libro inexistente devuelve `404` con «Esta página no está. Los estantes sí.» y sus
  dos botones.
- `/guias/inseparables` abre sin contraseña y muestra el aviso de licencia pendiente.
- El carrito agrega, cambia cantidad, persiste al recargar, elimina y actualiza subtotal.
- El checkout vacío y la confirmación sin pedido muestran estados vacíos.
- La confirmación muestra primero «Abrir la guía» y «Solicitar factura», después el resumen, y al
  final la invitación a escuelas.
- Las casillas de avisos aparecen sin marcar.
- Con `NEXT_PUBLIC_WHATSAPP_NUMBER` vacío, cada botón de WhatsApp abre el panel de demostración con
  el mensaje preparado y no abre WhatsApp.
- La vista móvil no tiene overflow horizontal y el botón de WhatsApp no tapa contenido esencial.
- Carrito, checkout, confirmación, caja, guía, revisión de precios y páginas «En preparación»
  tienen `noindex`.
- En ninguna página visible aparecen «EST-», «provisional», «pendiente», «Precio único»,
  opiniones, estrellas ni descuentos.
- `/revision/precios` muestra los dos montos y no está enlazada desde el menú ni el sitemap.

## 10. Dónde está lo pendiente

Consulte [`TODO.md`](./TODO.md). No cierre un pendiente sin verificarlo. Si descubre una limitación
nueva, agréguela con contexto y prioridad; no la deje solo en la conversación.

## 11. Criterio de terminado

Un cambio está terminado cuando:

- compila y pasa formato, lint y typecheck;
- mantiene las reglas editoriales, de precio y de seguridad;
- no inventa contenido ni datos;
- actualiza la documentación afectada;
- fue probado en el flujo correspondiente;
- y el usuario autorizó cualquier commit o despliegue.
