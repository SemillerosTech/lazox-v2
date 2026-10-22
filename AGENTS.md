# AGENTS.md — LAZOX v2

Este archivo contiene las instrucciones persistentes para cualquier agente que trabaje en este
proyecto. Aplica a todo el árbol de `lazox-v2/`.

## 1. Lectura obligatoria

Antes de cambiar comportamiento, contenido o arquitectura, lea:

1. [`README.md`](./README.md): contexto completo, estado, rutas y decisiones.
2. [`TODO.md`](./TODO.md): pendientes editoriales, técnicos y de lanzamiento.
3. [`lib/catalog/README.md`](./lib/catalog/README.md): contrato de catálogo y preparación para
   Shopify.

Si la documentación y el código no coinciden, investigue antes de asumir que uno de los dos está
equivocado. No invente requisitos ni contenido editorial.

## 2. Contexto operativo

- **Proyecto activo:** `lazox-v2/`, una aplicación Next.js 16 desplegable en Vercel con Root
  Directory `lazox-v2`.
- **Repositorio:** la raíz de Git también contiene `prework/`, una presentación estática
  independiente. No es parte de la aplicación, no se despliega con ella y no debe mezclarse.
- **Estado de Git:** el último commit puede ser el snapshot anterior a la migración. Revise
  `git status`; no asuma que `HEAD` contiene el estado actual.
- **Alcance actual:** prototipo navegable de Inseparables. No hay Shopify, checkout real, correo
  real, pedidos reales ni cuentas de usuario.
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

Para probar la guía localmente, defina `GUIDE_ACCESS_PASSWORD` en `.env.local` o en el entorno del
proceso. Para la demo ejecutiva puede usar `GUIDE_PUBLIC_DEMO=true`, que abre la guía sin
contraseña; nunca active esa variable en producción. Nunca escriba una contraseña real, un número
de WhatsApp real ni secretos en el repositorio, en capturas, en documentación o en un commit.

El recorrido guiado de demostración solo se activa con `NEXT_PUBLIC_ENABLE_DEMO_TOUR=true` antes
del build. Con `false`, vacío o ausente no debe montarse ni cargar Driver.js.

## 4. Mapa de arquitectura

```text
app/
  layout.tsx                  Metadata, fuentes y layout raíz
  (site)/                     Shell público: header, footer, CartProvider
    page.tsx                  Homepage
    estantes/                 Índice y detalle de estantes
    libros/[slug]/            Ficha
    guias/                    Acceso y guía privada
    carrito/                  Carrito
    compra/demo/              Checkout ficticio
    pedido/                   Confirmación y caja
  sitemap.ts                  Sitemap público
components/                   UI compartida
features/demo-tour/           Recorrido guiado aislado, activado por variable
lib/
  cart/                       Store, localStorage y pedido de demostración
  catalog/                    CatalogRepository y adaptador local
  data/                       Datos editoriales provisionales
  guide-access*.ts            Cookie, hash y validación de la guía
  whatsapp.ts                 URL y mensaje de WhatsApp
  types.ts                    Modelos de dominio
proxy.ts                      Protección de /guias
public/                       Assets estáticos
```

## 5. Reglas de producto y contenido

Estas reglas son parte del brief. No las cambie sin aprobación:

- **Precio único:** `$435 MXN`. No agregue descuentos, promociones, precios tachados ni precios
  alternativos.
- **Textos de Rossy:** sinopsis, pregunta, regla y textos editoriales aprobados son literales. No
  los “mejore”, corrija ni reescriba.
- **Tono LAZOX:** en usted. Los textos de Rossy pueden usar “tú” y deben permanecer así.
- **Sin lenguaje clínico.**
- **Solo `EST-03`** tiene un libro aprobado. Los demás estantes muestran un estado vacío neutral.
- **No inventar** libros, recomendaciones, ISBN, autores, contenido de guía, números de WhatsApp,
  enlaces legales ni datos de contacto.
- **Recomendación provisional:** `EST-03` sigue pendiente de aprobación de Rossy.
- **Guía:** solo usa el contenido aprobado de la tarjeta. El contenido extenso y la licencia
  definitiva están pendientes.
- **Atribución literal:** “Guía de Semilleros de Sentido A.C., usada por Lazox bajo licencia.”
- **Portada:** composición CSS marcada como demostración. No hay imágenes oficiales.
- **Libro vecino y tarjeta del buen vecino:** pendientes de definición editorial.

## 6. Reglas técnicas

- Use **Server Components** por defecto. Agregue `"use client"` solo cuando se necesiten estado,
  efectos, eventos del navegador o APIs como `localStorage`.
- No reemplace el store externo del carrito por lecturas de `localStorage` dentro de un `useEffect`
  sin resolver la hidratación. El carrito usa `useSyncExternalStore` deliberadamente.
- Los precios se guardan en **centavos**. No use `number` flotante para dinero.
- Las páginas deben consumir `CatalogRepository` (`lib/catalog/index.ts`). No agregue nuevos
  imports directos de `lib/data/` en páginas o componentes.
  - Excepción conocida: `lib/cart/cart-context.tsx` resuelve el libro para mostrar el carrito con
    `findBookBySlug`. Si integra Shopify, primero desacople ese punto.
- Conserve los tokens `brand-*` y el lenguaje visual en `app/globals.css`.
- Use `next/link` para navegación interna y `next/image` para imágenes cuando corresponda.
- Mantenga `metadata` y `noindex` en las páginas privadas. No confíe en `robots.txt` como control
  de acceso.
- La guía debe seguir validando la cookie tanto en `proxy.ts` como en el servidor de la página,
  salvo cuando `GUIDE_PUBLIC_DEMO=true` en un entorno de demostración.
- No elimine la etiqueta exacta:
  “Demostración: no se realizará ningún cargo ni se generará un pedido real.”
- No convierta el checkout, el correo o el WhatsApp en flujos reales sin una decisión explícita.

## 7. Seguridad y datos

- No exponga `GUIDE_ACCESS_PASSWORD` en componentes cliente, logs, URLs o documentación.
- No active `GUIDE_PUBLIC_DEMO` en producción: elimina la contraseña de la guía mientras esté
  activo.
- No elimine `httpOnly`, `sameSite`, `secure` ni la validación server-side de la cookie.
- No agregue secretos a `.env.example`; use valores vacíos o marcadores.
- No escriba datos personales de prueba en logs persistentes.
- Si toca autenticación, mantenga la comparación de tokens con `timingSafeEqual` y evite
  redirecciones abiertas.
- Revise que los cambios no introduzcan `dangerouslySetInnerHTML` con contenido no controlado.

## 8. Flujo de trabajo

1. Revise `git status` y no revierta cambios que no haya hecho usted.
2. Lea el archivo relevante antes de editar. Prefiera cambios pequeños y consistentes.
3. Actualice la documentación en el mismo cambio si modifica rutas, variables, flujos o decisiones.
4. No haga commit, push ni despliegue sin que se le pida explícitamente.
5. No modifique `prework/` ni los archivos del snapshot anterior salvo que la tarea lo pida.
6. No agregue dependencias si la plataforma o los componentes existentes ya resuelven el problema.
7. No use `pnpm dlx` para introducir herramientas que no estén aprobadas.

## 9. Validación funcional mínima

Además del build:

- `/`, `/estantes`, `/estantes/est-03`, `/libros/inseparables`, `/carrito`, `/compra/demo`,
  `/pedido/confirmacion-demo` y `/pedido/caja-demo` responden correctamente.
- Un estante o libro inexistente devuelve `404`.
- Con `GUIDE_PUBLIC_DEMO=false`, `/guias/inseparables` sin cookie redirige a `/guias/acceso`;
  contraseña incorrecta muestra error y la correcta permite entrar.
- Con `GUIDE_PUBLIC_DEMO=true`, `/guias/inseparables` abre directo y `/guias/acceso` redirige a la
  guía.
- El carrito agrega, cambia cantidad, persiste al recargar, elimina y actualiza subtotal.
- El checkout vacío y la confirmación sin pedido muestran estados vacíos.
- La vista móvil no tiene overflow horizontal.
- Carrito, checkout, confirmación, caja, guía y acceso tienen `noindex`.

## 10. Dónde está lo pendiente

Consulte [`TODO.md`](./TODO.md). No cierre un pendiente sin verificarlo. Si descubre una limitación
nueva, agréguela con contexto y prioridad; no la deje solo en la conversación.

## 11. Criterio de terminado

Un cambio está terminado cuando:

- compila y pasa formato, lint y typecheck;
- mantiene las reglas editoriales y de seguridad;
- no inventa contenido ni datos;
- actualiza la documentación afectada;
- fue probado en el flujo correspondiente;
- y el usuario autorizó cualquier commit o despliegue.
