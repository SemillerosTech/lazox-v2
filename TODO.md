# TODO — LAZOX v2

> Lista viva de lo que falta. El estado de lo ya construido está en [`README.md`](./README.md).
>
> **Regla:** no marque una tarea como completada sin verificarla. Al cerrar una tarea, agregue una
> nota breve con la fecha y la evidencia (comando, ruta o aprobación recibida).

**Última actualización:** 21 de octubre de 2026.

## Resumen

- **Prototipo navegable:** completo.
- **Listo para producción:** no.
- **Principal bloqueo:** aprobación editorial, licencia de la guía, assets oficiales y flujos
  reales de compra/contacto.
- **Deuda técnica principal:** no hay pruebas automatizadas, CI ni integración de Shopify.

## P0 — Contenido y aprobaciones editoriales

- [ ] **Aprobar la recomendación de `EST-03` con Rossy.** Hoy la ficha y el estante la muestran
      como provisional. Actualizar `lib/data/recommendations.ts`, `lib/data/books.ts` y las etiquetas
      visibles cuando exista aprobación.
- [ ] **Definir el libro vecino.** La ficha tiene un espacio reservado que hoy dice “pendiente”.
      No inventar un título ni una relación editorial.
- [ ] **Definir la tarjeta del buen vecino.** La confirmación y la caja mencionan que está pendiente.
      Confirmar contenido, formato y si se entrega físicamente o solo se anuncia.
- [ ] **Confirmar la licencia de la guía** con Semilleros de Sentido A.C. Cambiar
      `license.status` de `pending` a `confirmed` solo cuando exista la firma o autorización.
- [ ] **Entregar el contenido completo de la guía.** Hoy `sections` está vacío y solo se muestran
      sinopsis, pregunta y regla. Agregar secciones aprobadas y ajustar la plantilla si hace falta.
- [ ] **Entregar portada e imágenes oficiales.** Reemplazar la composición CSS de demostración,
      actualizar `BookCover`/`book.coverImage`, alt text y créditos.
- [ ] **Definir el contenido de los 9 estantes restantes.** Solo cuando exista selección editorial
      aprobada. Mientras tanto, mantener los estados vacíos.
- [ ] **Revisar el texto de la homepage** contra la versión final de marca, sin reintroducir
      descuentos ni promociones.

## P1 — Lanzamiento y operación

- [ ] **Definir la política de acceso a la guía.** Decidir si se mantiene una contraseña compartida
      o se migra a cuentas/enlaces firmados. Documentar rotación y soporte.
- [ ] **Agregar limitación de intentos** al acceso privado si se mantiene la contraseña compartida.
- [ ] **Definir el número oficial de WhatsApp** y probar el mensaje prellenado. No usar números de
      ejemplo en el repositorio.
- [ ] **Definir dominio y `NEXT_PUBLIC_SITE_URL`.** Verificar sitemap, canonical, Open Graph y
      metadata social.
- [ ] **Confirmar precio, disponibilidad, envío y devoluciones.** Hoy el precio es `$435 MXN` y el
      envío figura como “Por definir”.
- [ ] **Crear páginas legales definitivas:** términos, privacidad, envíos, devoluciones y aviso de
      cookies/analítica si aplica.
- [ ] **Definir si se usará Shopify.** Si sí, implementar el adaptador de Storefront API y el flujo
      real de carrito, checkout y pedidos.
- [ ] **Reemplazar el checkout ficticio** por el flujo real aprobado, o mantenerlo claramente
      aislado como demostración.
- [ ] **Configurar correo transaccional** y notificaciones de pedido si habrá compra real.
- [ ] **Configurar analítica, consentimiento y monitoreo de errores.** No agregar rastreadores sin
      definir privacidad.
- [ ] **Definir enlaces de newsletter, redes y footer.** Varios enlaces actuales son `#` o
      provisionales.
- [ ] **Decidir si habrá búsqueda y cuenta de usuario.** Hoy los iconos del header son visuales y
      no tienen flujo asociado.

## P2 — Ingeniería y calidad

- [ ] **Agregar pruebas automatizadas.** Prioridad:
  - unitarias para formato de precio, token de guía y store del carrito;
  - integración para rutas y metadata `noindex`;
  - E2E para agregar, cambiar cantidad, recargar, eliminar, checkout y confirmación;
  - E2E para guía sin cookie, contraseña incorrecta y contraseña correcta;
  - caso sin `GUIDE_ACCESS_PASSWORD`.
- [ ] **Configurar CI** con `pnpm format:check`, `pnpm lint`, `pnpm typecheck` y `pnpm build`.
- [ ] **Desacoplar el carrito de `lib/data/`.** `lib/cart/cart-context.tsx` usa `findBookBySlug`
      directamente para mostrar las líneas. Resolverlo antes de integrar Shopify.
- [ ] **Auditoría de accesibilidad** con teclado, foco visible, lector de pantalla y contraste.
- [ ] **Auditoría Lighthouse** de rendimiento, accesibilidad, SEO y buenas prácticas.
- [ ] **Revisión de seguridad** de la cookie, proxy, redirecciones y exposición de variables.
- [ ] **Agregar `metadataBase` y canonical** cuando exista dominio definitivo.
- [ ] **Agregar imágenes Open Graph** aprobadas.
- [ ] **Optimizar imágenes oficiales** cuando se reemplacen los placeholders.
- [ ] **Revisar enlaces placeholder** (`#`) y retirar o implementar cada uno.
- [ ] **Implementar o retirar la newsletter.** Hoy el formulario no envía datos.
- [ ] **Implementar o retirar búsqueda y cuenta.** Hoy no tienen funcionalidad.
- [ ] **Mantener la documentación actualizada** en el mismo cambio que modifique rutas, variables,
      datos o flujos.

## P3 — Pulido

- [ ] Revisar navegación móvil con teclado y manejo de foco.
- [ ] Revisar el comportamiento de la portada compacta en carrito y caja con las imágenes oficiales.
- [ ] Revisar textos de estados vacíos con el equipo editorial.
- [ ] Revisar microcopy de errores, confirmación y formularios.
- [ ] Revisar enlaces sociales y metadatos de cada página.
- [ ] Revisar `404`, `500` y recuperación de errores en producción.
- [ ] Revisar rendimiento de fuentes y carga inicial.

## Decisiones que necesitan respuesta

Estas decisiones bloquean varias tareas. No las resuelva por su cuenta:

1. ¿La compra real será Shopify, otro checkout o solo catálogo con contacto?
2. ¿La guía seguirá siendo gratuita con contraseña o requerirá cuenta?
3. ¿Habrá envío nacional, recolección o entrega digital?
4. ¿Cuál es el número oficial de WhatsApp y quién responde?
5. ¿Cuál es el dominio canónico y el correo de soporte?
6. ¿Se publicarán los 9 estantes vacíos o se ocultarán hasta tener contenido?
7. ¿La tarjeta del buen vecino y el libro vecino forman parte de la compra o son contenido editorial?
8. ¿Qué proveedor de analítica y correo se usará?

## Riesgos actuales

- La guía usa una contraseña compartida sin limitación de intentos.
- El carrito vive solo en el navegador; no se sincroniza entre dispositivos.
- La confirmación usa `sessionStorage`; no hay pedido ni correo real.
- La portada es un placeholder CSS, no el arte oficial.
- El sitemap queda vacío si `NEXT_PUBLIC_SITE_URL` no se define en build.
- Varios enlaces son `#` y algunos iconos no tienen acción.
- No hay pruebas automatizadas ni CI.
- El repositorio puede tener el snapshot anterior en `HEAD`; el estado real está en el árbol de
  trabajo. Verifique `git status`.

## Criterio de listo para producción

- [ ] Aprobaciones editoriales y licencia documentadas.
- [ ] Assets oficiales integrados.
- [ ] Precio, stock, envío y devoluciones confirmados.
- [ ] Flujo de compra real o decisión explícita de mantener la demo.
- [ ] WhatsApp y correo reales configurados.
- [ ] Dominio, SEO, sitemap y Open Graph verificados.
- [ ] Páginas legales publicadas.
- [ ] Acceso privado endurecido según la política elegida.
- [ ] Pruebas y CI en verde.
- [ ] Accesibilidad y Lighthouse revisados.
- [ ] Monitoreo y respaldo definidos.
- [ ] `README.md` y `TODO.md` actualizados con el estado final.

## No hacer

- No inventar contenido editorial, recomendaciones, números, precios ni enlaces.
- No agregar descuentos ni precios tachados.
- No alterar los textos de Rossy.
- No eliminar el control de acceso de la guía ni confiar solo en `noindex`.
- No convertir la demo en compra real sin completar los pendientes de P1.
- No integrar Shopify sin una decisión explícita.
- No commitear secretos, contraseñas reales ni datos personales de prueba.
