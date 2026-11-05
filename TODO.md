# TODO — LAZOX v2

> Lista viva de lo que falta. El estado de lo ya construido está en [`README.md`](./README.md).
>
> **Regla:** no marque una tarea como completada sin verificarla. Al cerrar una tarea, agregue una
> nota breve con la fecha y la evidencia (comando, ruta o aprobación recibida).

**Última actualización:** 5 de noviembre de 2026.

## Avance del catálogo parcial (5 de noviembre de 2026)

- [x] Inseparables activo y publicado únicamente en Lazox Headless. Evidencia: estado Activo y
      canal Lazox Headless en el administrador después de guardar. No se cambió el inventario.
- [x] Compartir lecturas de libro, estantes y productos de colección dentro de cada petición.
      Evidencia: `React.cache` en `lib/catalog/shopify.ts`; no se cachean mutaciones ni visitas.
- [x] Mantener el precio sin existencias y no anunciar una guía que no existe. Evidencia:
      condición `guide` en la ficha. Las guías incompletas no se crean en Shopify.
- [x] Formato, lint, TypeScript y build correctos. Prueba de 26 rutas en modo Shopify con fixture
      externo al repositorio: diez estantes, libro sin existencias, guías vacías, compras cerradas
      y páginas inexistentes. Se verificó una sola consulta de producto entre metadata y página.
      No sustituye la prueba contra la tienda real. El estante inexistente muestra la página de
      no encontrado y `noindex`, pero Next puede responder HTTP 200 al haber iniciado streaming.
- [x] Diez colecciones publicadas únicamente en Lazox Headless; orden 2 de EST-09 completado.
      Evidencia: comprobación de las colecciones por Storefront API real.
- [x] Entrada de portada `global` activa con su prefijo existente; campos vacíos sin cambios.
- [x] Verificar Storefront real con token público: diez estantes, libro a $435 MXN y 26 rutas
      probadas sin guías ni compras reales. Adaptador de autenticación de prueba fuera del repo;
      no se usó ni se copió el token privado.
- [x] Acceso de escritura a GitHub confirmado el 5 de noviembre de 2026 mediante `gh api`;
      push a `main` autorizado por el propietario.
- [x] Validación local con token privado el 5 de noviembre de 2026: `pnpm shopify:check`,
      formato, lint, TypeScript, build y 36 rutas en modo Shopify real. Los diez estantes
      respetan el orden; Inseparables conserva $435 MXN sin guía ni compra. Chrome verifica
      las páginas no encontradas y sus dos salidas. Token ausente de HTML y assets públicos;
      `noindex` y `robots.txt` conservados. Script de comprobación fuera del repositorio.
- [x] Configurar las ocho variables del paquete en Production y Preview de Vercel el
      5 de noviembre de 2026. Evidencia: `vercel env ls`; token privado sensible enviado por
      stdin sin mostrarlo. Proyecto `lazox-v2`, Root Directory `.`. No se modificó `.env.local`
      ni las variables de WhatsApp, dominio o factura.
- [ ] Comprobar el despliegue del nuevo SHA después del push; un push no garantiza un build
      correcto. El archivo `.env.local` del equipo de desarrollo no viaja con Git.

No se cerró el vocabulario editorial de recomendaciones; no se habilitaron compras reales.

## Resumen

- **Fachada del borrador:** las 27 tarjetas de `docs/lo-de-adentro-afuera.md` están implementadas
  en el árbol de trabajo.
- **Listo para producción:** no.
- **Principal bloqueo:** aprobación editorial, licencia de la guía, assets oficiales, número de
  WhatsApp, facturación/Shopify y flujos reales de compra y contacto.
- **Deuda técnica principal:** no hay pruebas automatizadas, CI ni prueba funcional de Shopify
  contra la tienda real. La integración está implementada y apagada.

## Registro de esta entrega (27 de octubre de 2026)

Implementado en el árbol de trabajo; la verificación manual en navegador queda pendiente en los
puntos marcados abajo.

- [x] Portada reordenada: primera franja, dos puertas, ocho estantes, Inseparables, cinco preguntas,
      caja, Trazaurus/escuelas y pie. Evidencia: `app/(site)/(shell)/page.tsx`.
- [x] Opiniones inventadas y estrellas fuera. Evidencia: búsqueda sin coincidencias en `app/` y
      `components/`.
- [x] `noindex, nofollow` global y `robots.txt` bloqueado. Evidencia: `app/layout.tsx`,
      `public/robots.txt`.
- [x] Menú de cinco puertas y pie de cuatro columnas con la línea de SILEE®. Evidencia:
      `lib/site-nav.ts`, `components/site-header.tsx`, `components/site-footer.tsx`.
- [x] Códigos `EST-` fuera de la vista; migajas con el nombre del estante. Evidencia:
      `components/shelf-card.tsx`, `app/(site)/(shell)/estantes/`.
- [x] Ficha reordenada, páginas 48, formato y encuadernación ocultos mientras falten. Evidencia:
      `app/(site)/(shell)/libros/[slug]/page.tsx`, `lib/data/books.ts`.
- [x] Dos precios construidos, apagados con `NEXT_PUBLIC_ENABLE_DUAL_PRICING=false`, con vista
      interna `/revision/precios`. Evidencia: `lib/pricing.ts`, `components/book-purchase.tsx`,
      `components/price-options.tsx`, `app/(site)/(shell)/revision/precios/page.tsx`.
- [x] Marcas de trabajo fuera de la tienda: sin «provisional», «pendiente», «EST-» ni «Rossy» en
      las pantallas públicas. Evidencia: búsqueda en `app/` y `components/`.
- [x] Guía pública sin contraseña, con aviso de licencia, atribución y versión imprimible.
      Evidencia: `app/(site)/guias/[slug]/page.tsx`, `app/(site)/guias/[slug]/descargar/`.
- [x] Carrito con línea a la guía, checkout con factura, métodos de pago y casillas sin marcar.
      Evidencia: `app/(site)/(shell)/carrito/`, `app/(site)/(shell)/compra/demo/`.
- [x] Confirmación con guía y factura primero, resumen, «¿Cómo nos conoció?» e invitación a
      escuelas. Evidencia: `app/(site)/(shell)/pedido/confirmacion-demo/`.
- [x] Estados vacíos y 404 con los textos aprobados; estado de libro agotado preparado. Evidencia:
      `app/not-found.tsx`, `app/(site)/(shell)/not-found.tsx`, `app/(site)/(shell)/carrito/`,
      `app/(site)/(shell)/libros/[slug]/page.tsx`.
- [x] WhatsApp por pantalla con mensaje preparado y panel de demostración si falta el número.
      Evidencia: `lib/whatsapp.ts`, `lib/whatsapp-context.tsx`, `components/whatsapp-inquiry.tsx`,
      `components/whatsapp-dock.tsx`.
- [x] Recorrido de 16 pasos actualizado a la portada nueva, sin el paso de contraseña. Evidencia:
      `features/demo-tour/`.
- [x] Documentación actualizada: `AGENTS.md`, `README.md`, `TODO.md`, `lib/catalog/README.md`,
      `.env.example`.
- [x] `format:check`, `lint`, `typecheck` y `build` ejecutados sin errores el 27 de octubre de 2026.

### Verificación manual

- [x] Rutas nuevas y estados vacíos revisados el 27 de octubre de 2026 con respuestas `200`/`404` y
      Chrome sin interfaz. Evidencia: `/carrito` y `/pedido/confirmacion-demo` muestran sus estados
      vacíos; los `404` muestran el texto y los dos botones aprobados.
- [x] Carrito completo probado en Chrome sin interfaz: agregar, cambiar cantidad a 2, recargar,
      eliminar y subtotal. Evidencia: `lazox:cart:v2` persistió y el subtotal pasó de `$435` a
      `$870 MXN`.
- [x] Checkout y confirmación probados en escritorio: formulario, métodos de pago, casillas sin
      marcar, orden en `sessionStorage`, carrito vaciado y orden de guía/factura antes del resumen.
- [ ] Repetir el checkout, la confirmación y la caja en un móvil real. El overflow ya se revisó a
      375, 390 y 430 px.
- [x] Panel de WhatsApp sin número probado en portada, ficha, estante, escuelas, carrito, checkout
      y confirmación. Evidencia: muestra el mensaje preparado y no hay enlaces `wa.me`.
- [x] `/revision/precios` muestra `$435 MXN` y `$305 MXN` y no está enlazada desde el menú ni el
      sitemap. Evidencia: ruta directa.
- [ ] Probar el diálogo de impresión de `/guias/inseparables/descargar` en un navegador real.
- [x] El botón del recorrido y el de WhatsApp no se superponen a 375, 390 y 430 px. Evidencia:
      recorrido abajo a la izquierda y WhatsApp abajo a la derecha.
- [x] Recorrido de 16 pasos: inicia en la portada, muestra «1 de 16» y cierra sin dejar overlays.
      Evidencia: Chrome sin interfaz.

## Registro de la integración Shopify (5 de noviembre de 2026)

Implementado en el árbol de trabajo. La conexión de Storefront responde con las credenciales
locales, pero la prueba funcional de catálogo y carrito queda pendiente porque el contenido no está
publicado en el canal Headless y no se creó ningún carrito real.

- [x] Selección explícita de fuente `local-draft`/`shopify` sin fallback silencioso. Evidencia:
      `lib/catalog/index.ts`, `lib/shopify/config.ts`.
- [x] Guardia de despliegue: `local-draft` falla en Vercel salvo
      `LAZOX_ALLOW_LOCAL_DRAFT_ON_VERCEL=true`. Evidencia: `lib/shopify/config.ts`.
- [x] Transporte GraphQL de servidor con timeout, errores saneados y token privado fuera del
      bundle cliente. Evidencia: `lib/shopify/client.ts`, `lib/shopify/request.ts`.
- [x] Consultas paginadas de colecciones, productos, guías, recomendaciones y portada. Evidencia:
      `lib/shopify/queries.ts`, `lib/catalog/shopify.ts`.
- [x] Mapeo de metacampos y metaobjetos; claves faltantes en `null`, sin inventarlas. Evidencia:
      `lib/shopify/mappers.ts`, `lib/shopify/metaobject-fields.ts`.
- [x] HTML enriquecido saneado con `sanitize-html` y estilos `.rich-text`. Evidencia:
      `lib/shopify/mappers.ts`, `app/globals.css`.
- [x] Carrito Shopify preparado y cerrado por flags de servidor; cookie `httpOnly`. Evidencia:
      `lib/shopify/cart.ts`, `app/actions/cart.ts`.
- [x] Modo `shopify` deshabilita compras en ficha, carrito y checkout; el recorrido de demostración
      no se monta. Evidencia: `app/(site)/layout.tsx`, `components/book-purchase.tsx`,
      `app/(site)/(shell)/carrito/cart-page.tsx`,
      `app/(site)/(shell)/compra/demo/checkout-demo.tsx`.
- [x] Diagnóstico interno `/revision/catalogo` y comando `pnpm shopify:check`. Evidencia:
      `app/(site)/(shell)/revision/catalogo/page.tsx`, `scripts/check-shopify.mjs`.
- [x] Prueba de humo en modo `shopify` con las credenciales locales: Storefront responde, no
      devuelve recursos publicados, las rutas muestran estados vacíos y las compras quedan
      deshabilitadas. No se creó ningún carrito ni se modificó Shopify.
- [x] `.env.example` documentado sin secretos y documentación de la integración. Evidencia:
      `.env.example`, `lib/shopify/README.md`, `lib/catalog/README.md`.
- [x] `format:check`, `lint`, `typecheck` y `build` sin errores el 5 de noviembre de 2026.

## P0 — Contenido y aprobaciones editoriales

- [ ] **Reemplazar las imágenes de maqueta por las definitivas.** El 28 de octubre de 2026 se
      integraron cuatro imágenes para ver el sitio armado. Todas son provisionales:
  - `l1-inseparables-mesa.webp`: el libro aparece **cerrado**, pero la tarjeta 5 pide la toma con
    el libro **abierto** sobre la mesa.
  - `anfitrion-leyendo.webp`: incumple cinco reglas de la tarjeta 5 — tiene ojos grandes con
    brillos en lugar de ojos de punto, dos brillos por ojo, chapitas rosas, boca abierta y está de
    cuerpo entero en lugar de asomándose. Se usa por decisión de Gero del 28 de octubre de 2026.
  - `portada-inseparables.jpg`: parece una **reproducción generada**, no el archivo de la
    editorial. El crédito dice «Maria Girón» sin acento. No se publica como definitiva hasta tener
    el archivo y el permiso de Tramuntana.
  - `c1-caja-abierta.webp`: maqueta de la caja, no la caja impresa real.
- [ ] **Aprobar la recomendación de `EST-03` con Rossy.** Hoy la ficha y el estante no muestran
      marcas de trabajo; el estado interno sigue en `lib/data/recommendations.ts` y
      `lib/data/books.ts`. Actualizar el estado interno cuando exista aprobación.
- [ ] **Definir el libro vecino.** La ficha no muestra el bloque mientras no exista. No inventar un
      título ni una relación editorial.
- [ ] **Definir la tarjeta del buen vecino.** Confirmar contenido, formato y si se entrega
      físicamente o solo se anuncia.
- [ ] **Confirmar la licencia de la guía** con Semilleros de Sentido A.C. Cambiar
      `license.status` de `pending` a `confirmed` solo cuando exista la firma o autorización. La
      guía es pública en el borrador; no publicar contenido licenciado sin esta confirmación.
- [ ] **Entregar el contenido completo de la guía.** Hoy `sections` está vacío y solo se muestran
      sinopsis, pregunta y regla. Agregar secciones aprobadas y ajustar la plantilla si hace falta.
- [ ] **Entregar la toma L1** de Inseparables abierto sobre una mesa. Reemplazar el hueco de la
      primera franja y usarla en la vista previa al compartir. Los prompts de fondo y las medidas
      están en `docs/prompts-imagenes.md`.
- [ ] **Entregar la toma C1** de la caja abierta con sus tres piezas. Reemplazar el hueco de
      «Qué trae la caja» y de `/pedido/caja-demo`. La maqueta de referencia está en
      `docs/prompts-imagenes.md`.
- [ ] **Entregar portada e imágenes oficiales.** Reemplazar la composición CSS, actualizar
      `BookCover`/`book.coverImage`, alt text y créditos.
- [ ] **Confirmar el permiso de portada de Tramuntana** (por Colofón). Sin permiso no se publica la
      portada en la ficha.
- [ ] **Definir el anfitrión.** No hay asset aprobado; la primera franja no lo muestra. Si se
      retoma, seguir las reglas de la tarjeta 5: ojos de punto, color plano, sin boca abierta, sin
      destellos y siempre con un libro.
- [ ] **Entregar la tarjeta «Cinco preguntas para después de leer»** firmada por Rossy. Mientras
      tanto, `/cinco-preguntas` dice «En preparación» y no hay PDF inventado.
- [ ] **Entregar las líneas de los diez estantes.** Hoy `shelf.line` está vacío y no se muestra
      nada debajo del título. La línea de «solo quiere reírse» es solo un ejemplo.
- [ ] **Confirmar formato y encuadernación de Inseparables.** Mientras falten, no se muestran en la
      ficha.
- [ ] **Confirmar la fecha del colofón del lote de Inseparables.** Define si el libro es de precio
      libre. No inventar la fecha.
- [ ] **Definir el contenido de los 9 estantes restantes.** Solo cuando exista selección editorial
      aprobada. Mientras tanto, mantener los estados vacíos.
- [ ] **Revisar el texto de la portada** contra la versión final de marca, sin reintroducir
      descuentos, promociones ni «Precio único».
- [ ] **Definir si se nombra a Rossy en la tienda y cómo.** Mientras ella no lo decida, su nombre
      no aparece.

## P1 — Lanzamiento y operación

- [ ] **Definir la política de la guía para producción.** Hoy es pública, sin contraseña, con
      `noindex` y licencia pendiente. Decidir si seguirá abierta, si requerirá cuenta o si se
      retirará hasta la firma.
- [ ] **Confirmar que `NEXT_PUBLIC_ENABLE_DUAL_PRICING` esté apagado en producción.** Solo debe
      encenderse cuando abogado y contador cierren la cuenta del 30 %.
- [ ] **Definir el número oficial de WhatsApp** y probar los mensajes de cada pantalla. No usar
      números de ejemplo en el repositorio.
- [ ] **Definir el sistema de facturación.** Mientras no exista Shopify, «Solicitar factura» lleva
      a `/factura`; configurar `NEXT_PUBLIC_SHOPIFY_INVOICE_URL` cuando esté disponible.
- [ ] **Publicar el catálogo en el canal Headless de Shopify.** Inseparables, las diez colecciones
      y los metaobjetos deben estar visibles para Storefront API. Sin esta autorización, el modo
      `shopify` devuelve estados vacíos. No publicar sin aprobación del propietario.
- [ ] **Confirmar las credenciales de Shopify en cada entorno.**
      `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` y
      `SHOPIFY_STOREFRONT_API_VERSION` ya responden en local (el token vive en `.env.local`, no se
      versiona). Falta cargarlas en Vercel si el despliegue usará Shopify.
- [x] **Completar las claves de metaobjetos** en `lib/shopify/metaobject-fields.ts`. Verificadas
      el 5 de noviembre de 2026: `guia_de_lectura` (10 claves), `recomendacion_lazox` (6) y
      `contenido_de_portada_lazox` (7). Falta contrastarlas contra entradas publicadas en
      `/revision/catalogo` cuando existan.
- [ ] **Definir el vocabulario de estados aprobados** de recomendaciones en
      `APPROVED_RECOMMENDATION_STATUSES`. Hoy está vacío y la tienda no muestra recomendaciones.
- [ ] **Conectar la UI del carrito Shopify.** Las Server Actions existen, pero ningún botón las
      llama. Falta estado de carrito en cliente, revalidación, errores y prueba real.
- [ ] **Decidir si se abren `LAZOX_ENABLE_CART` y `LAZOX_ENABLE_CHECKOUT`.** Solo después de una
      decisión explícita, con impuestos, envío, pedidos, correo y facturación resueltos.
- [ ] **Decidir el despliegue del borrador.** Si `local-draft` sigue en Vercel, definir
      `LAZOX_ALLOW_LOCAL_DRAFT_ON_VERCEL=true`; si ya se usa Shopify, configurar la fuente y las
      credenciales. Sin esa decisión, un despliegue con `local-draft` falla a propósito.
- [ ] **Definir la estrategia de caché e invalidación** para producción. Hoy el transporte usa
      `cache: "no-store"`; no hay webhooks ni app administrativa.
- [ ] **Reemplazar el checkout ficticio** por el flujo real aprobado, o mantenerlo claramente
      aislado como demostración.
- [ ] **Configurar correo transaccional** y notificaciones de pedido si habrá compra real.
- [ ] **Definir la regla de envíos.** Hasta entonces, el resumen no muestra renglón de envío.
- [ ] **Confirmar precio, disponibilidad, envío y devoluciones.** Hoy el precio normal es
      `$435 MXN`.
- [ ] **Crear páginas legales definitivas:** términos, privacidad, envíos, devoluciones y aviso de
      cookies/analítica si aplica. Hoy las cuatro primeras ya tienen un borrador de trabajo con
      campos entre corchetes (`components/legal-page.tsx`); falta que un abogado los revise y que
      el equipo complete razón social, RFC, domicilio, correos, paquetería, costos y plazos.
      Mientras sean borrador, conservan el aviso visible y el `noindex`. Nota del 27 de octubre de 2026.
- [ ] **Revisar con un abogado el borrador de licencia de la guía.** El punto de partida está en
      `docs/licencia-guia-borrador.md`. Falta completar los datos de las partes, decidir la
      contraprestación y firmar. La guía sigue con `license.status: "pending"`.
- [ ] **Confirmar el número de WhatsApp de pruebas.** El entorno local usa `5515940732` solo para
      probar; no es el número oficial y no debe quedar en el repositorio ni en Vercel como
      definitivo.
- [ ] **Definir el dominio definitivo.** Hoy `NEXT_PUBLIC_SITE_URL` apunta a
      `https://lazox-v2.vercel.app` y `metadataBase` ya lo usa; el dominio final será `lazox.com`.
      Verificar sitemap, canonical, Open Graph y metadata social cuando cambie.
- [ ] **Agregar imágenes Open Graph aprobadas**, empezando por la toma L1 de 1200 × 630.
- [ ] **Configurar analítica, consentimiento y monitoreo de errores.** No agregar rastreadores sin
      definir privacidad.
- [ ] **Instrumentar el clic de las puertas de estante.** Hoy cada puerta lleva `data-shelf-code`,
      pero no hay proveedor de analítica que registre el evento.
- [ ] **Definir enlaces de redes y footer.** Solo las cuentas que existan; hoy no se muestran
      redes.
- [ ] **Decidir si habrá búsqueda y cuenta de usuario.** Hoy no existen; el menú no muestra lupa ni
      cuenta.
- [ ] **Guardar las respuestas rápidas de WhatsApp** de la confirmación (Mamá o papá, Maestro o
      maestra, Directivo, Otro; Sí, Más adelante; «Gracias. Gero le escribe [plazo].») cuando
      exista la línea oficial.
- [ ] **Retirar `noindex, nofollow` y el bloqueo de `robots.txt`** el día que la tienda abra en
      `lazox.com`.

## P2 — Ingeniería y calidad

- [ ] **Agregar pruebas automatizadas.** Prioridad:
  - unitarias para formato de precio, precio libre, 30 % económico y store del carrito;
  - integración para rutas, metadata `noindex` y estados vacíos;
  - E2E para agregar, cambiar cantidad, recargar, eliminar, checkout y confirmación;
  - E2E para la guía pública y su versión imprimible;
  - E2E para el panel de WhatsApp sin número.
- [ ] **Configurar CI** con `pnpm format:check`, `pnpm lint`, `pnpm typecheck` y `pnpm build`.
- [ ] **Agregar pruebas de la integración Shopify.** Prioridad: selección de fuente y guardia de
      despliegue; conversión de dinero a centavos; faltantes de metacampos; HTML saneado; flags de
      carrito/checkout en servidor; errores GraphQL con HTTP 200 sin filtrar secretos. No llamar a
      Shopify desde pruebas unitarias ni crear carritos reales.
- [ ] **Auditoría de accesibilidad** con teclado, foco visible, lector de pantalla y contraste.
- [ ] **Auditoría Lighthouse** de rendimiento, accesibilidad, SEO y buenas prácticas.
- [ ] **Revisión de seguridad** de la guía pública, la exposición de variables y los flujos de
      demostración.
- [ ] **Agregar `metadataBase` y canonical** cuando exista dominio definitivo.
- [ ] **Optimizar imágenes oficiales** cuando se reemplacen los placeholders.
- [ ] **Revisar enlaces placeholder** y retirar o implementar cada uno.
- [ ] **Mantener la documentación actualizada** en el mismo cambio que modifique rutas, variables,
      datos o flujos.
- [ ] **Revisar el sitemap** cuando se retire `noindex`; hoy se genera solo si hay
      `NEXT_PUBLIC_SITE_URL`.

## P3 — Pulido

- [ ] Revisar navegación móvil con teclado y manejo de foco.
- [ ] Revisar el comportamiento de la portada compacta en carrito y caja con las imágenes
      oficiales.
- [ ] Revisar textos de estados vacíos con el equipo editorial.
- [ ] Revisar microcopy de errores, confirmación y formularios.
- [ ] Revisar enlaces sociales y metadatos de cada página.
- [ ] Revisar `404`, `500` y recuperación de errores en producción.
- [ ] Revisar rendimiento de fuentes y carga inicial.
- [ ] Revisar que el botón del recorrido y el de WhatsApp no se tapen entre sí en móvil.

## Decisiones que necesitan respuesta

Estas decisiones bloquean varias tareas. No las resuelva por su cuenta:

1. ¿La compra real será Shopify, otro checkout o solo catálogo con contacto?
2. ¿La guía seguirá siendo pública, requerirá cuenta o se retirará hasta la firma de licencia?
3. ¿Habrá envío nacional, recolección o entrega digital?
4. ¿Cuál es el número oficial de WhatsApp y quién responde?
5. ¿Cuál es el dominio canónico y el correo de soporte?
6. ¿Se publicarán los 9 estantes vacíos o se ocultarán hasta tener contenido?
7. ¿La tarjeta del buen vecino y el libro vecino forman parte de la compra o son contenido
   editorial?
8. ¿Qué proveedor de analítica y correo se usará?
9. ¿Quién firma la cuenta del 30 % de los dos precios y con qué criterio legal y contable?
10. ¿Habrá un anfitrión ilustrado y con qué asset aprobado?
11. ¿La factura se emitirá desde Shopify o desde otro sistema?
12. ¿Quién entrega y firma la tarjeta de las cinco preguntas?

## Riesgos actuales

- La guía es pública y usa contenido cuya licencia aún no está confirmada.
- Los dos precios están construidos; encenderlos sin aprobación legal y contable es un riesgo.
- Sin número de WhatsApp, los botones muestran un panel de demostración y no abren un chat.
- El carrito vive solo en el navegador; no se sincroniza entre dispositivos.
- La integración Shopify está sin probar contra la tienda real: las credenciales locales responden,
  pero falta publicar el contenido en el canal Headless. Las claves de metaobjetos ya están
  verificadas, pero no se pudieron contrastar contra entradas reales.
- El carrito de Shopify está preparado pero sin UI; encenderlo sin conectar las acciones no habilita
  una compra real.
- Un despliegue con `local-draft` falla salvo `LAZOX_ALLOW_LOCAL_DRAFT_ON_VERCEL=true`; es
  intencional, pero hay que decidirlo antes de desplegar.
- La confirmación usa `sessionStorage`; no hay pedido ni correo real.
- La portada, L1 y C1 son placeholders; no hay arte oficial.
- El sitemap queda vacío si `NEXT_PUBLIC_SITE_URL` no se define en build.
- El borrador está bloqueado para buscadores; retirar `noindex` sin querer lo expone.
- No hay pruebas automatizadas ni CI.
- El clic de las puertas de estante no se registra en ninguna analítica.
- Varias páginas legales e institucionales dicen «En preparación».
- El repositorio puede tener el snapshot anterior en `HEAD`; el estado real está en el árbol de
  trabajo. Verifique `git status`.
- `.env.local` puede conservar variables antiguas de la guía; no se versiona, pero conviene
  limpiarlo en cada entorno local.

## Criterio de listo para producción

- [ ] Aprobaciones editoriales y licencia documentadas.
- [ ] Assets oficiales integrados (L1, C1, portada y permiso de Tramuntana).
- [ ] Precio, stock, envío y devoluciones confirmados.
- [ ] Dos precios aprobados legal y contablemente, o decisión explícita de no usarlos.
- [ ] Flujo de compra real o decisión explícita de mantener la demo.
- [ ] WhatsApp, facturación y correo reales configurados.
- [ ] Dominio, SEO, sitemap y Open Graph verificados.
- [ ] Páginas legales publicadas.
- [ ] Política de la guía definida y licencia confirmada.
- [ ] Pruebas y CI en verde.
- [ ] Accesibilidad y Lighthouse revisados.
- [ ] Analítica, consentimiento y monitoreo definidos.
- [ ] `README.md` y `TODO.md` actualizados con el estado final.

## No hacer

- No inventar contenido editorial, recomendaciones, números, precios, opiniones ni enlaces.
- No agregar descuentos, precios tachados, relojes ni meses sin intereses.
- No usar «Precio único».
- No alterar los textos de Rossy.
- No usar «experiencia» ni sus variantes en contenido público.
- No mostrar códigos `EST-`, marcas de trabajo ni el nombre de Rossy en la tienda.
- No publicar la guía con licencia pendiente fuera del borrador.
- No encender los dos precios sin aprobación legal y contable.
- No convertir la demo en compra real sin completar los pendientes de P1.
- No integrar Shopify sin una decisión explícita.
- No commitear secretos, contraseñas reales ni datos personales de prueba.

## Limpieza del recorrido de demostración

> Ejecutar solo cuando el recorrido para Gero ya no se necesite. No retirar el carrito, el checkout
> de demostración, la guía pública ni la vista de precios.

- [ ] Quitar `NEXT_PUBLIC_ENABLE_DEMO_TOUR` de `.env.example`, de Vercel y de los entornos locales.
- [ ] Eliminar la carpeta `features/demo-tour/` completa.
- [ ] Quitar `DemoTourMount` y la lectura de la flag de `app/(site)/layout.tsx`.
- [ ] Ejecutar `pnpm remove driver.js` y comprobar que `pnpm-lock.yaml` ya no lo incluya.
- [ ] Retirar todos los atributos `data-tour` y las props `dataTour` de la portada, estantes,
      ficha, guía, carrito, checkout, confirmación y caja.
- [ ] Conservar `createDemoOrder(...)` en `lib/cart/demo-order.ts` mientras el checkout de
      demostración lo siga usando.
- [ ] Buscar restos con
      `grep -RIn "demo-tour\\|data-tour\\|driver.js\\|NEXT_PUBLIC_ENABLE_DEMO_TOUR" app components features lib README.md TODO.md .env.example`.
- [ ] Verificar que no queden popovers, overlays, listeners ni CSS del recorrido en ninguna ruta.
- [ ] Retirar la sección «Recorrido guiado de demostración» del `README.md` y esta lista de limpieza
      una vez completada.
- [ ] Ejecutar `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm build` y repetir el flujo
      manual de carrito, checkout, confirmación, guía y WhatsApp.
