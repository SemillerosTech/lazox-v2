# LAZOX — Conectar el proyecto Next.js local con Shopify

Documento de implementación para Codex u OpenCode. Preparado el 30 de octubre de 2026 a partir de la configuración realizada en el administrador de LAZOX.

## Cómo usar este archivo

1. Guarda este archivo en la raíz de tu proyecto Next.js.
2. Abre Codex u OpenCode en esa carpeta.
3. Envía este mensaje:

> Lee `LAZOX-Shopify-Nextjs-Configuracion-Local.md` completo e implementa la integración local descrita. Primero inspecciona el repositorio y sus instrucciones. Adapta la solución a la versión y arquitectura instaladas, conserva la UI existente y ejecuta las comprobaciones disponibles. No publiques el catálogo, no despliegues y no reveles credenciales. Completa todo lo que no dependa de secretos y al final indícame únicamente las variables que debo llenar manualmente.

Este documento no contiene tokens. El agente debe trabajar en el repositorio local, sin modificar Shopify ni contratar servicios.

## 1. Objetivo y límites

Conectar la UI existente de Next.js con Shopify como fuente de catálogo, colecciones, contenido y carrito. Shopify no será el frontend público principal. No construir otro back office ni rediseñar el homepage.

- Inspeccionar `AGENTS.md`, `package.json`, el lockfile, estructura `src`, router, componentes y capa de datos existentes.
- Usar el gestor de paquetes del repositorio y las versiones instaladas. No migrar Next.js, React, Tailwind ni el router como parte de esta tarea.
- Preferir `fetch` nativo y GraphQL. Instalar dependencias solo si aportan algo necesario y compatible.
- Conservar diseño, navegación, estilos y componentes. Adaptar las rutas existentes antes de crear otras.
- No cambiar el tema de Shopify, DNS, datos legales, impuestos, pagos, usuarios o permisos.
- No publicar productos, colecciones, guías ni contenidos. No activar compras reales ni desplegar a producción.
- No crear productos ficticios, imágenes de portada, reseñas ni descripciones editoriales inventadas.
- Usar lenguaje de usted. En textos editoriales de LAZOX usar «acompañamiento» cuando corresponda; evitar introducir «experiencia».
- No almacenar información clínica de niños en Shopify, archivos de fixtures, logs o analítica.

## 2. Estado real de Shopify

| Recurso | Estado / enlace |
|---|---|
| Administrador | https://admin.shopify.com/store/lazox-2 |
| Plan | Basic |
| País y moneda | México, MXN |
| Zona horaria | Guadalajara / Ciudad de México, GMT-06:00 |
| Dominio comercial existente | `tienda.lazox.com.mx`; no cambiar |
| Tienda online | Privada |
| Tienda externa creada | Lazox Headless |
| Headless | https://admin.shopify.com/store/lazox-2/headless/414832 |
| Credenciales / permisos Storefront | https://admin.shopify.com/store/lazox-2/headless/414832/storefront_api |
| Producto piloto | https://admin.shopify.com/store/lazox-2/products/10385515708635 |
| Metacampos de producto | https://admin.shopify.com/store/lazox-2/settings/custom_data/product/metafields |

Inseparables permanece en borrador y sin asignaciones de publicación. Los diez estantes tienen cero canales. Las guías y recomendaciones solo tienen definición, sin entradas. Existe contenido de portada `global` en borrador con el prefijo editorial común.

También existe un producto previo de Viktor Frankl y la colección «Página de inicio». No modificarlos ni tratarlos como parte del piloto.

**Importante:** al crear Headless, Shopify asignó automáticamente productos y colecciones al canal nuevo. Se retiraron esas asignaciones. No volver a publicarlos para hacer que una consulta devuelva datos.

### Permisos guardados de Storefront API

| Scope habilitado | Uso |
|---|---|
| `unauthenticated_read_product_listings` | Productos, variantes y colecciones publicadas en el canal |
| `unauthenticated_read_content` | Contenido de tienda |
| `unauthenticated_read_metaobjects` | Metaobjetos accesibles y activos |
| `unauthenticated_read_checkouts` | Lectura del recurso de checkout según la API |
| `unauthenticated_write_checkouts` | Operación de checkout según la API |

Los metacampos nuevos y los metaobjetos tienen acceso Storefront habilitado en sus definiciones. No existe un scope adicional específico por cada metacampo. La visibilidad final depende también del recurso padre, estado y publicación.

Quedaron deshabilitados los permisos de clientes, etiquetas, inventario detallado, retiro en tienda, planes de venta, operaciones masivas, paquetes y precios de Shop Pay Installments. Usar Cart API para el carrito; no implementar las antiguas mutaciones de Checkout API. No cambiar permisos para resolver errores sin autorización.

## 3. Variables de entorno y secretos

Crear o completar `.env.example` con placeholders y documentación. Nunca sobrescribir `.env.local` ni leer/imprimir su contenido para mostrarlo en la conversación.

```dotenv
# Host canónico exacto obtenido de Shopify > Configuración > Dominios.
# Solo hostname, sin https:// ni rutas. No deducirlo del slug del admin.
SHOPIFY_STORE_DOMAIN=REEMPLAZAR.myshopify.com
SHOPIFY_STOREFRONT_API_VERSION=2026-10

# Token PRIVADO de la tienda externa, para uso exclusivo en servidor.
SHOPIFY_STOREFRONT_PRIVATE_TOKEN=REEMPLAZAR_MANUALMENTE

# Estado seguro inicial. Nunca usar esta variable como única barrera de publicación.
LAZOX_CATALOG_SOURCE=local-draft
LAZOX_ENABLE_CART=false
LAZOX_ENABLE_CHECKOUT=false
```

El usuario debe copiar manualmente estas variables a `.env.local` y llenar el hostname y token privado desde Shopify. No pedir que los pegue en el chat. No utilizar el dominio del administrador como hostname de Storefront API; `lazox-2` es un identificador del admin y no prueba el dominio canónico.

- Asegurar que `.env.local` y otros archivos con secretos no estén versionados. Preservar las reglas existentes y permitir `.env.example` con placeholders.
- Nunca usar `NEXT_PUBLIC_` para el token privado.
- No introducir tokens en componentes cliente, URLs, mensajes de error, snapshots, tests o logs.
- No ejecutar `cat .env.local`, volcar `process.env`, imprimir headers o registrar cuerpos completos de errores de red.
- Las llamadas pueden leer los valores desde el proceso durante la ejecución, sin exponerlos al agente ni al usuario.
- No crear credenciales de Admin API ni instalar apps para leer borradores.
- Mantener los flags comerciales en servidor. No agregar una ruta pública que permita habilitarlos.

La versión `2026-10` es la referencia comprobada al preparar este archivo. Antes de implementar, consultar documentación oficial de Shopify y de la versión instalada de Next.js; si se usa en el futuro, confirmar que esa versión de API siga soportada. No actualizar dependencias automáticamente.

## 4. Dos fuentes de catálogo explícitas

### `local-draft`: desarrollo visual inicial

Es el modo predeterminado porque el catálogo real aún no está publicado. Crear un adaptador local con los datos reales proporcionados de Inseparables y los diez estantes de este documento.

- Es una copia local identificada como borrador; Shopify sigue siendo la fuente administrable futura.
- No crear estos datos en Shopify ni simular una respuesta exitosa de Shopify.
- No añadir productos de ejemplo adicionales.
- Mostrar una indicación de desarrollo visible solo en local: «Vista local de borrador — compras deshabilitadas».
- Peso, existencias y cualquier dato desconocido deben ser `null`, no cantidades inventadas. El cero de Shopify es un valor inicial sin carga de inventario real.
- Precio `435 MXN` marcado como provisional; no permitir checkout.
- Sin imagen de portada: usar el estado vacío que tenga el diseño, sin generar una portada ni buscarla automáticamente.
- Impedir que este modo se use en un despliegue de producción. Distinguir la ejecución local de una compilación de producción usando la arquitectura del proyecto, sin dejar que un flag público eluda el bloqueo.

### `shopify`: integración real

Usar exclusivamente los datos devueltos por Storefront API. Si faltan recursos porque están sin publicar, mostrar un estado vacío claro para desarrollo y una UI apropiada para el visitante. No cambiar silenciosamente a la fuente local.

**Un token privado de Storefront no convierte un borrador en un producto consultable.** No quitar esta restricción para poder completar la prueba. Los metaobjetos en borrador tampoco deben tratarse como contenido publicado.

El modo Shopify puede probar transporte, configuración y manejo de respuestas vacías ahora. La prueba funcional de catálogo y carrito queda pendiente hasta que el propietario autorice publicar contenido en el canal adecuado. Proteger el frontend de pruebas por separado: la privacidad de la tienda online Shopify no protege automáticamente una aplicación Next.js externa.

## 5. Contrato de catálogo existente

### Estantes

Cada colección tiene:

- `title`: nombre editable.
- `description` / `descriptionHtml`: contenido editorial nativo editable; actualmente vacío.
- `lazox.estante_codigo`: texto de una línea, identificador permanente.
- `lazox.estante_orden`: entero, orden de presentación.

No ordenar por nombre, handle, ID ni fecha. Leer `lazox.estante_orden` y ordenar numéricamente. Validar códigos duplicados y órdenes ausentes en diagnóstico sin modificar Shopify automáticamente.

| Orden | Código | Nombre | ID numérico de colección |
|---|---|---|---|
| 1 | EST-10 | solo quiere reírse | 544768983259 |
| 2 | EST-09 | todavía no lee, pero ya lee | 544769048795 |
| 3 | EST-06 | está empezando de nuevo | 544769081563 |
| 4 | EST-04 | tiene miedo de algo | 544769114331 |
| 5 | EST-08 | pregunta cosas grandes | 544769147099 |
| 6 | EST-03 | teme perder lo que ama | 544769179867 |
| 7 | EST-02 | cree que no puede | 544769212635 |
| 8 | EST-05 | se siente distinto a todos | 544769245403 |
| 9 | EST-07 | vio algo que no le pareció justo | 544769278171 |
| 10 | EST-01 | siente que solo sabe romper | 544769310939 |

Los IDs identifican los recursos creados en esta tienda. Para las rutas del frontend, reutilizar la estructura del repositorio y utilizar el código como identidad estable; no acoplar la lógica editorial al título.

### Metacampos de producto

Las siguientes claves fueron configuradas expresamente en el namespace `lazox`:

| Clave completa | Tipo |
|---|---|
| `lazox.isbn` | Texto de una línea |
| `lazox.autora` | Texto de una línea |
| `lazox.ilustradora` | Texto de una línea |
| `lazox.traductor` | Texto de una línea |
| `lazox.editorial` | Texto de una línea |
| `lazox.anio` | Entero |
| `lazox.paginas` | Entero |
| `lazox.edad_sugerida` | Texto de una línea |
| `lazox.ficha_madre_id` | Texto de una línea |
| `lazox.estante_principal_codigo` | Texto de una línea |
| `lazox.estantes_vecinos` | Lista de referencias a colecciones |
| `lazox.pregunta_conversar` | Texto multilínea |
| `lazox.libro_vecino` | Referencia a producto |
| `lazox.libro_vecino_motivo` | Texto multilínea |
| `lazox.guia` | Referencia al metaobjeto Guía de lectura |
| `lazox.colofon_fecha` | Fecha |
| `lazox.colofon_origen` | Texto multilínea |
| `lazox.estado_libro` | Texto de una línea |
| `lazox.condicion_precio` | Texto de una línea |
| `lazox.precio_reducido` | Dinero |

Leer `type`, `value`, `reference` o `references` según corresponda. No tratar todas las respuestas como texto: analizar enteros, dinero y fechas; resolver referencias de forma tipada. Metacampos faltantes son `null`, no errores fatales. No calcular condición de precio ni usar precio reducido para aplicar descuentos.

### Metaobjetos

| Tipo técnico | Campos definidos en el administrador |
|---|---|
| `guia_de_lectura` | Título, Slug, Libro relacionado, Código del estante, Texto introductorio, Contenido, Preguntas, Archivo descargable, Estado editorial, Créditos |
| `recomendacion_lazox` | Libro recomendado, Ubicación de la recomendación, Estante relacionado, Motivo de la recomendación, Estado de aprobación editorial, Responsable de la aprobación |
| `contenido_de_portada_lazox` | Identificador, Título, Mensaje principal, Contenido, Orden, Estado editorial, Prefijo editorial de estantes |

Definiciones:

- https://admin.shopify.com/store/lazox-2/settings/custom_data/metaobjects/guia_de_lectura
- https://admin.shopify.com/store/lazox-2/settings/custom_data/metaobjects/recomendacion_lazox
- https://admin.shopify.com/store/lazox-2/settings/custom_data/metaobjects/contenido_de_portada_lazox

Los tipos anteriores están verificados. **Las claves técnicas individuales de sus campos fueron generadas por Shopify y no se inspeccionaron en esta sesión. No asumir que coinciden con una transliteración del nombre.** Centralizar ese mapeo y documentar su validación en el administrador. Cuando haya entradas accesibles, leer `fields { key type value reference ... }` y contrastar las claves. Storefront no sustituye a Admin API para inspeccionar definiciones; si no hay entradas accesibles, dejar la comprobación pendiente y no inventar claves ni pedir una credencial administrativa.

El contenido global existente tiene handle `global`, está en borrador y solo contiene:

> Para el niño o la niña que…

Este prefijo se puede usar como copia local en `local-draft`, identificado como tal. En modo Shopify debe provenir del contenido administrado cuando se autorice activarlo.

Las guías no tienen entradas todavía. Preparar la ruta `/guias/[slug]`, con destino previsto `/guias/inseparables`, sin publicar páginas vacías como si fueran guías terminadas ni ofrecer una descarga inexistente.

Las recomendaciones deben ser de la casa y aprobadas por Rossy. Actualmente no hay vocabulario cerrado para el estado editorial: centralizar valores y no inferir aprobación por un campo no vacío. Hasta confirmar la convención y una entrada aprobada, no mostrar recomendaciones. No usar `productRecommendations`, IA o algoritmos para rellenarlas.

## 6. Datos reales del único producto piloto local

| Campo | Valor |
|---|---|
| Título | Inseparables |
| ID Shopify | `gid://shopify/Product/10385515708635` |
| Handle observado | `inseparables` |
| SKU | `TRAM-INS-002` |
| Autora | Mar Pavón |
| Ilustradora | María Girón |
| Editorial | Tramuntana Editorial |
| Año | 2015 |
| ISBN | 978-84-943046-0-6 |
| Páginas | 48 |
| Precio provisional | 435 MXN |
| Edad sugerida | Hacia los 7 años en adelante, y por toda la familia. |
| Estante principal | EST-03 |
| Estado | Borrador, no publicado |

### Sinopsis

Dos zapatillas que iban juntas a todas partes, hasta que un día algo las separa. Una de ellas cuenta el viaje: el camino lejos de casa, la espera, las manos desconocidas. Un cuento sobre lo que la guerra les quita a los más pequeños, y sobre lo que todavía puede llegar cuando ya casi nadie lo esperaba.

### Para el niño o la niña que…

teme perder lo que ama, o ya perdió algo y le cuesta creer que después de eso algo bueno pueda volver. Aquí encuentra una historia donde lo perdido no es el final del camino.

### Pregunta

¿Hay algo o alguien que no te gustaría perder nunca?

### Texto complementario

Aquí no hay respuestas correctas. Si lo que diga te sorprende, la mejor respuesta son dos palabras: «cuéntame más».

En Shopify estos textos están guardados en la descripción nativa del producto; la pregunta también está en `lazox.pregunta_conversar`. No hay metacampos separados para todos los párrafos. No crear un parser frágil de HTML basado en posiciones: renderizar la descripción o usar una transformación explícita documentada. En el adaptador local pueden separarse los bloques para conservar el diseño existente.

## 7. Implementación solicitada al agente

### Capa de servidor

Crear módulos equivalentes a los siguientes, adaptados al repositorio:

```text
lib/shopify/config.ts           Validación de configuración de servidor
lib/shopify/client.ts           Transporte GraphQL de servidor
lib/shopify/queries.ts          Consultas y fragmentos
lib/shopify/mappers.ts          Conversión a modelos de dominio
lib/shopify/types.ts            Tipos de respuestas y dominio
lib/catalog/index.ts           Selección explícita de fuente
lib/catalog/local-draft.ts     Copia local del piloto real
lib/catalog/shopify.ts         Adaptador real
```

Usar la protección de módulos de servidor apropiada a la versión instalada, por ejemplo `server-only` cuando esté disponible. No importarlos desde componentes cliente. En App Router usar Server Components y Server Actions o Route Handlers según el patrón existente; en Pages Router usar las alternativas del proyecto.

Transporte:

```text
POST https://{SHOPIFY_STORE_DOMAIN}/api/{SHOPIFY_STOREFRONT_API_VERSION}/graphql.json
Content-Type: application/json
Shopify-Storefront-Private-Token: {valor secreto leído en servidor}
```

- Validar hostname y versión antes de construir el endpoint. No aceptar un endpoint arbitrario enviado por el navegador.
- Usar variables GraphQL, no interpolación de entradas del usuario dentro de consultas.
- Aplicar un timeout y manejar HTTP no exitoso, errores GraphQL con HTTP 200, `userErrors`, respuestas vacías y recursos `null`.
- Devolver errores sanitizados. No exponer headers ni credenciales.
- Para peticiones que provengan de tráfico de compradores, implementar `Shopify-Storefront-Buyer-IP` siguiendo la documentación de Shopify y la confianza del proxy del despliegue real. No inventar una IP ni confiar ciegamente en headers arbitrarios del cliente; documentar lo pendiente si el hosting aún no está definido.
- Durante la integración local priorizar frescura. Definir explícitamente la caché según la versión de Next.js instalada. No cachear operaciones ni respuestas personalizadas del carrito. No depender de defaults históricos de `fetch`.
- No añadir webhooks ni una app administrativa en esta fase. Documentar después la estrategia de invalidación para producción.

### Lecturas

Implementar servicios de dominio equivalentes a:

- `getShelves()` y `getShelfByCode(code)`.
- `getPilotProduct()` o adaptación a la consulta de producto existente.
- `getHomepageContent()`.
- `getReadingGuide(slug)`.
- `getApprovedRecommendations(location, shelfCode?)`.

Paginar conexiones GraphQL. No asumir que `first: 10` contiene todos los estantes si la tienda tiene otras colecciones. Filtrar por los códigos permanentes y obtener el orden desde sus metacampos. Las referencias a recursos inaccesibles o sin publicar pueden ser `null`.

Renderizar dinero con `Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })`, respetando la moneda real recibida. No usar `compareAtPrice` ni `precio_reducido` para crear una promoción.

Para `descriptionHtml` y contenido enriquecido usar una estrategia segura compatible con el proyecto; no permitir HTML arbitrario sin control. Si se necesita sanitización, reutilizar una solución existente o justificar una dependencia mantenida.

### Carrito preparado, cerrado inicialmente

Preparar integración con `cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove` y lectura de carrito, verificando el esquema oficial de la versión usada.

- Usar IDs de variantes devueltos por Shopify; nunca el ID del producto como `merchandiseId` ni inventar un ID para el piloto.
- Conservar el ID completo del carrito en una cookie de servidor `httpOnly`, `sameSite` y con `secure` en HTTPS, adaptada a desarrollo local. No imprimirlo ni tratarlo como dato público.
- Validar cantidades enteras positivas, disponibilidad y respuestas `userErrors`.
- No confiar en precios o totales enviados por el navegador; Shopify los calcula.
- Respetar `LAZOX_ENABLE_CART=false`: ninguna mutación debe ejecutarse en ese estado. Un botón deshabilitado no es una barrera suficiente; validar el flag en servidor.
- Respetar `LAZOX_ENABLE_CHECKOUT=false`: no devolver ni redirigir a `checkoutUrl` mientras siga cerrado.
- En `local-draft` no ejecutar mutaciones, aunque alguien cambie un flag. No crear un checkout de prueba ni realizar compras.

## 8. Verificación y criterios de aceptación

Ejecutar los scripts de lint, tipos, build y tests pertinentes que ya tenga el repositorio. No inventar comandos que no estén instalados ni cambiar configuraciones solo para ocultar fallos. Si una comprobación no puede correr, informar la causa.

Pruebas útiles si el proyecto dispone de infraestructura:

1. Orden numérico de estantes y mapeo de metacampos faltantes.
2. Error GraphQL con HTTP 200 y error de transporte, sin filtración de secretos.
3. Separación entre `local-draft` y `shopify`: no existe fallback silencioso.
4. Carrito y checkout bloqueados en servidor por defecto.
5. Borradores y referencias inaccesibles producen estados vacíos, sin publicación automática.

No añadir pruebas que solo repliquen constantes. No llamar a Shopify desde tests unitarios ni crear carritos reales para probar los flags.

Checklist final:

- [ ] La UI existente se conserva.
- [ ] `.env.example` está documentado y no contiene secretos.
- [ ] El token privado no llega al bundle cliente ni a logs.
- [ ] Los diez estantes aparecen en el orden correcto en `local-draft`.
- [ ] Inseparables muestra los textos reales y precio provisional en la vista local.
- [ ] No hay imágenes, existencias ni peso inventados.
- [ ] En modo Shopify el catálogo sin publicar produce el estado esperado, sin datos locales encubiertos.
- [ ] No se ofrecen guías, descargas o recomendaciones inexistentes.
- [ ] Carrito y checkout están bloqueados en servidor.
- [ ] No se modificó Shopify ni se desplegó el proyecto.
- [ ] Se documentaron las claves de campos de metaobjetos que aún requieren validación.
- [ ] Se revisó el diff para evitar cambios ajenos y archivos secretos.

## 9. Entrega esperada de Codex / OpenCode

Al terminar, entregar:

1. Cambios implementados y rutas/archivos principales.
2. Comando local de arranque, tomado del `package.json` real.
3. Variables que el usuario debe completar manualmente, sin valores secretos.
4. Cómo cambiar entre vista local de borrador y modo Shopify.
5. Comprobaciones ejecutadas y resultados reales.
6. Pendientes separados: hostname/token, claves de metaobjetos, aprobación editorial, publicación, inventario, peso, precio, impuestos, pagos y logística.

No declarar la integración «probada con Inseparables desde Shopify» mientras el producto siga en borrador. Diferenciar implementación, prueba de transporte y prueba funcional con catálogo publicado.

## 10. Referencias oficiales

Consultar solo fuentes oficiales para decisiones de API y framework:

- Arquitectura Headless y gestión de tokens: https://shopify.dev/docs/storefronts/headless/overview
- Storefront API, autenticación y versión: https://shopify.dev/docs/api/storefront
- Cart API: https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/manage
- Documentación Next.js: https://nextjs.org/docs

La publicación comercial y la activación de pagos son tareas posteriores y requieren autorización de LAZOX.
