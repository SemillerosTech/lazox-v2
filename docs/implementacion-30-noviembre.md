# Ajustes de apertura · Implementación local

Fecha de trabajo: 26 de noviembre de 2026. Base: `LAZOX-ajustes-codigo-30-noviembre.md`.
Los cambios permanecen en el árbol de trabajo. No hubo commit, push, despliegue, escritura en
Shopify desde este agente, cobro, correo ni mensaje real. Los campos creados por separado desde
Shopify Admin se conectaron al código y se consultaron por Storefront el 26 de noviembre. Se conservaron los dos documentos que ya estaban sin
seguimiento antes de esta tarea y no se editó `lo-de-adentro-afuera.md`.

## Cambios por tarjeta

| Tarjeta | Resultado y límites |
| --- | --- |
| 5 | Hero con recuadro gris L1 y texto seleccionable; se retiraron la foto del libro cerrado y el personaje no aprobado. Tamaño estable. El libro se toma de `HomepageContent.entryBookSlug`, con Inseparables como selección inicial. Foto y alt, OG y anfitrión tienen campos de contenido preparados; sus claves ya están conectadas; faltan selección y recursos aprobados. |
| 12 | Bloque después de Cinco preguntas, con sus cuatro renglones literales. Oculto por defecto. `LAZOX_BOX_PRINTED_CONFIRMED=true` lo publica solo después de confirmar la impresión. `LAZOX_PREVIEW_BOX=true` lo muestra exclusivamente en desarrollo. Sin C1 real se ve el recuadro gris solicitado. |
| 13 | Se conservaron los bloques ya implementados y los destinos existentes. Trazaurus mantiene menor jerarquía; feria usa su mensaje específico. |
| 15 | Menú compartido de seis destinos en el orden pedido. Renta lleva a `/renta-escolar`; Guías a `/guias`. WhatsApp también está dentro del menú móvil. Sin cuenta ni buscador sin función. |
| 16 / A2 | Generador único; normaliza diez dígitos mexicanos o acepta `52` más diez dígitos. Rechaza otros formatos. Mensaje codificado una vez. Se añadió el mensaje de renta y se conservaron los contextuales. Sin número oficial se mantiene el panel de demostración. |
| 18 | Textos OG de portada exactos. Se retiraron las imágenes inventadas del metadata global. Portada admite L1 real en 1200 × 630 desde contenido; fichas incluyen portada en OG solo si `coverImageAuthorized` es verdadero. Falta imagen autorizada y validación real al compartir. |
| 20 | Orden editorial conservado, pregunta antes del precio, guía y carrito alineados también a 390 px (ambos 80 px; a 1440 px, 44 px). Año local 2021 y 48 páginas. Invitación de renta debajo de WhatsApp. Segunda imagen y vecino se muestran únicamente cuando existen. Formato y encuadernación siguen omitidos por falta de confirmación. |
| 25 | Guía/factura antes del resumen. Se corrigió el orden del DOM: Lo que recibirá precede a Cómo nos conoció también en móvil. Cinco opciones y respuesta opcional. Invitación a escuelas al final. El correo del repositorio es solo un ejemplo visual; falta adaptar la notificación real administrada por Shopify. |
| 26 | Se conservaron los textos de carrito vacío y 404 y las salidas existentes. Se verificó 404 HTTP para ruta y libro inexistentes. Agotado consume disponibilidad del catálogo y muestra guía solo si existe. Avisarme reutiliza el contacto humano por WhatsApp; no hay suscripción ni notificación automática. La gelatinita no se añadió porque no hay un recurso aprobado. |
| 28 | Página pública de renta con los textos en orden, guías y WhatsApp contextual; sin precio, imágenes de niños ni menciones a la asociación, incluido el pie. Enlace desde ficha y Para escuelas. Estado solo renta preparado y apagado al abrir. Campo de clave fuera del HTML público y sin endpoint de acceso. |

## Protección de solo renta

`NEXT_PUBLIC_ENABLE_RENTAL_ONLY` permanece en `false` en la configuración de ejemplo. Con
`true`, un libro con `rentalOnly: true` no muestra precio ni carrito en ficha, tarjeta o portada.
Conserva la guía si existe.

La función de agregado local valida el libro; el proveedor filtra líneas persistidas que ya no
puedan comprarse. El recorrido guiado usa ahora el mismo agregado validado del proveedor.

La acción Shopify vuelve a consultar el producto de la variante antes de agregar. La actualización
y la entrega del checkout verifican las líneas del carrito, incluidas las persistidas. Productos
ilegibles y lecturas incompletas fallan cerrados. Los productos sin el campo mantienen el
comportamiento existente. Los flags de carrito y checkout siguen cerrados; no se habilitaron compras.

## Contenido y configuración pendientes

- **Gero / editorial:** L1 real del libro abierto y su versión 1200 × 630; C1 real y confirmación de
  caja impresa; archivo y permiso de portada; formato y encuadernación; número oficial de WhatsApp.
- **Personaje:** falta gelatinita aprobada con ojos de punto, boca cerrada, color plano y libro sin
  título para el hero; falta postura aprobada dormida/asomada para carrito y 404. El archivo existente
  `public/images/anfitrion-leyendo.webp` no cumple las reglas y no se reutilizó.
- **Rossy:** selección del libro de entrada y foto autorizada de ese libro.
- **Shopify conectado:** `lazox.solo_renta_escolar` y `lazox.portada_autorizada` devolvieron
  booleanos `false` por Storefront; `lazox.paginas` y `lazox.anio` devolvieron enteros 48 y 2021.
- **Portada Shopify conectada:** `entryBook=libro_entrada`, `entryImage=foto_entrada`,
  `entryImageAlt=foto_entrada_alt`, `entryOgImage=imagen_entrada_compartir`,
  `hostImage=anfitrion_aprobado`, `boxImage=foto_caja`. Las claves se tomaron del reporte de
  Shopify Admin y se conectaron en `HOMEPAGE_FIELD_KEYS`. Storefront entrega `global`, pero
  omite los seis campos vacíos. Falta recibir la selección y los recursos aprobados para
  verificar referencias reales; no se llenaron campos para probar.
- **Guías:** contenido completo y licencia siguen pendientes, con aviso y noindex conservados.
- **Correo / avisos:** plantilla real de Shopify fuera del repositorio. No existe integración de
  aviso de reposición; el botón actual inicia conversación humana.
- **Acceso escolar:** convenio de la primera escuela y El patio 2.0 deben definir claves, libros,
  folio y pagos. `SCHOOL_ACCESS_ENABLED` es falso y sus controles están deshabilitados incluso en
  la estructura preparada; no existe ruta o acción que acepte una clave.

## Verificaciones ejecutadas

- `pnpm format:check`, `pnpm lint`, `pnpm typecheck`: correctos.
- `pnpm test:shopify-guides`: 15 pruebas correctas sin red.
- `pnpm test:opening`: 10 pruebas correctas sin red. Incluyen acción directa de Shopify rechazada
  antes de mutaciones, carrito local, checkout persistido, campo ausente, flag apagado, WhatsApp
  y las seis claves de portada con referencias y valores vacíos.
- Chrome sin interfaz, a 390 y 1440 px: 30 visitas a portada, estantes, ficha, colección de guías,
  guía, imprimible, carrito, checkout, confirmación, renta, Trazaurus, escuelas y dos rutas
  inexistentes. Sin desbordamiento horizontal ni errores de página. Las rutas inexistentes
  devolvieron HTTP 404. Se comprobó ausencia de caja por defecto, clave escolar e imagen OG falsa.
- Chrome móvil: menú → renta; agregar Inseparables → carrito → recarga con persistencia →
  checkout con casillas sin marcar → confirmación. Se comprobó orden de regalo, resumen,
  contenido de caja, pregunta opcional e invitación a escuelas.
- Chrome con catálogo Shopify sintético interceptado en memoria: seis fichas (normal, agotado y
  solo renta, a 390 y 1440 px). Solo renta sin precio/carrito y con guía; agotado con guía y contacto;
  Inseparables normal conserva precio y compras cerradas de Shopify. Sin llamadas a la tienda real.
- Chrome: caja visible con `LAZOX_PREVIEW_BOX=true`, recuadro C1 y cuatro renglones. WhatsApp fijo en portada, ficha, estante, renta y confirmación, y encabezado de escritorio: mensajes correctos en el panel de demostración, sin enlaces a `wa.me` con la línea vacía.
- Capturas de revisión en `/tmp/lazox-*.png` y scripts temporales de navegador en `/tmp/`.

### Build

Se ejecutó `pnpm build`, pero **no quedó aprobado**. La ejecución restringida no pudo descargar
Google Fonts. Con permisos ampliados se observaron fallos internos de Turbopack (puerto de su
proceso CSS y, tras limpiar caché, resolución interna de las fuentes de Baloo 2). También se
intentó `pnpm build --webpack`: falló en el cargador existente de Google Fonts al analizar la URL
con `TypeError: Cannot read properties of null (reading '1')`.

No se cambiaron las fuentes, el gestor ni las dependencias para ocultar el fallo. Hay que resolver
la compatibilidad de `next/font` y repetir el build antes de publicar. Next emitió además un aviso
de actualización de seguridad para la versión instalada; no se actualizó el framework en esta tarea.

### Pruebas externas pendientes

No se probó en un teléfono físico, ni se abrió WhatsApp con el número real, ni se compartió el
sitio para validar el destinatario y la vista previa. Esas verificaciones dependen de la línea
oficial, las imágenes autorizadas y un dispositivo. Las pruebas de portada con fixtures no validan
referencias reales aún vacías. La consulta de solo lectura sí confirmó el acceso a `global`
y los cuatro metacampos de Inseparables.
