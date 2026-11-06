# LAZOX — Entrega al agente local

## Pedido autorizado

Aplicar los cambios de este paquete a https://github.com/SemillerosTech/lazox-v2,
validar la integración con el catálogo existente, configurar/verificar el entorno de Vercel y
hacer push a `main`. El usuario ya autorizó ese push y sabe que dispara el despliegue.
Las guías están incompletas: avanzar sin crearlas ni publicar contenido inventado.
Carrito y checkout reales permanecen cerrados.

## Paquete y base

- `01-catalogo-parcial.patch`: cambios reales preparados y probados; cinco archivos.
- Base: `946eca44537ecd5bd9eb8146d46a0d800570cdc4`.
- Commit de origen: `241d612dcb2690b087979e10079aedd434dcafa5`, aún no publicado.
- Árbol de archivos final esperado al aplicar exactamente sobre la base:
  `7ec2635638ee4b1b60312a8dee804affd5831f26`.

No intentar `git cherry-pick 241d612`: ese commit solo existe en el entorno que preparó
el paquete. El parche contiene los cambios completos. No incluye credenciales.

## Antes de aplicar

1. Leer AGENTS.md y los documentos obligatorios del repositorio.
2. Revisar `git status`, rama y remoto. Conservar cualquier trabajo del usuario;
   no usar reset --hard, clean, force push ni sobrescribir archivos existentes.
3. Hacer fetch de origin. Si el árbol está limpio, pasar a main y actualizarlo con
   `git pull --ff-only origin main`. Si hay trabajo sin guardar o divergencia, preservarlo
   y reconciliar los cambios sin descartar nada.
4. Localizar la raíz REAL de la aplicación por package.json. En la copia revisada,
   package.json está en la raíz del repositorio; algunos documentos aún describen una
   carpeta histórica `lazox-v2/`. No cambiar Root Directory de Vercel a ciegas.

## Aplicar

Desde la raíz de Git, sustituyendo la ruta por la ubicación real del parche descargado:

```sh
git apply --check /ruta/al/01-catalogo-parcial.patch
git apply --3way /ruta/al/01-catalogo-parcial.patch
```

Si `--check` falla, revisar por qué antes de aplicar. Si main avanzó o el agente local
ya hizo cambios similares, comparar el diff e integrar únicamente los cambios faltantes;
no duplicar funciones ni reemplazar archivos completos con versiones anteriores.
`--3way` puede dejar cambios preparados para commit: revisar también `git diff --cached`.

Crear el commit con la identidad Git local ya configurada. No importar el autor Codex del
format-patch con git am: usar git apply y un commit local facilita que Vercel reconozca al autor.

## Qué cambia el parche

- `lib/catalog/shopify.ts`: React.cache para las lecturas de libro, estantes y productos de
  colección. Comparte resultados dentro de UNA petición entre metadata y página; no persiste
  datos entre visitantes ni cambia mutaciones del carrito.
- `app/(site)/(shell)/libros/[slug]/page.tsx`: leer guía y estante en paralelo; conservar el precio
  cuando el libro está agotado; anunciar que la guía está disponible solo si la consulta la devuelve.
- README.md, TODO.md y lib/shopify/README.md: avances y pendientes de esta entrega.

Las claves exactas de los tres metaobjetos YA estaban correctas en la base; no es necesario
inventarlas ni volver a modificarlas. APPROVED_RECOMMENDATION_STATUSES sigue vacío: no existe
aprobación editorial que autorice mostrar recomendaciones.

## Shopify ya realizado — no repetir ni crear duplicados

Verificado el 5 de noviembre de 2026:

- Inseparables: activo, publicado únicamente en Lazox Headless; precio 435 MXN; existencias 0.
- Diez estantes publicados únicamente en Lazox Headless.
- EST-09 tenía el orden vacío: se completó con 2. Orden editorial completo:
  EST-10, EST-09, EST-06, EST-04, EST-08, EST-03, EST-02, EST-05, EST-07, EST-01.
- Metaobjeto contenido_de_portada_lazox, handle global: activo, con el prefijo ya existente
  «Para el niño o la niña que…». Los demás campos vacíos no se rellenaron.
- Guías de lectura: 0 entradas. Recomendaciones: 0 entradas.
- Acceso Storefront de productos, colecciones y metaobjetos habilitado.
- Hostname confirmado en Dominios: h717u0-js.myshopify.com.

No alterar inventario, impuestos, precios, reglas de venta ni aprobación editorial para
hacer pasar una prueba. Las compras reales siguen cerradas.

## Entorno local y Vercel

Leer las credenciales que YA funcionan en el .env.local del usuario. No imprimir tokens,
no incluirlos en commits ni usar NEXT_PUBLIC_ para el token privado.

Valores requeridos en el entorno que se desplegará al hacer push a main:

```dotenv
LAZOX_CATALOG_SOURCE=shopify
SHOPIFY_STORE_DOMAIN=h717u0-js.myshopify.com
SHOPIFY_STOREFRONT_API_VERSION=2026-10
# Configurar mediante el valor privado existente del usuario; no usar este comentario como valor.
SHOPIFY_STOREFRONT_PRIVATE_TOKEN=
LAZOX_ENABLE_CART=false
LAZOX_ENABLE_CHECKOUT=false
NEXT_PUBLIC_ENABLE_DUAL_PRICING=false
NEXT_PUBLIC_ENABLE_DEMO_TOUR=false
```

Configurar estas variables en Production de Vercel y, si se usará, también en Preview.
No sustituir el token existente por vacío. Verificar vínculo con el proyecto correcto y Root
Directory real. Mantener noindex, nofollow y robots.txt mientras la tienda sea borrador.
No usar LAZOX_ALLOW_LOCAL_DRAFT_ON_VERCEL=true como solución para simular que Shopify funciona.
No hay fallback silencioso a datos locales en modo shopify.

Un push NO copia .env.local a Vercel. Revisar esto ANTES del push. Si el agente no tiene acceso
a Vercel, dejar los cambios de código listos e indicar al usuario los nombres de las variables
faltantes; no afirmar que el despliegue funciona ni habilitar compras como atajo.

## Validación y publicación

Desde la carpeta que contiene package.json, usando pnpm y el lockfile existente:

```sh
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
pnpm shopify:check
```

Comprobar modo Shopify real en /revision/catalogo, /, /estantes, /estantes/est-03,
/estantes/est-09, /libros/inseparables y /guias:

- Diez estantes en el orden indicado; Inseparables visible en EST-03.
- Ficha con precio 435 MXN, sin enlace a guía inexistente ni promesa de guía disponible.
- /guias muestra el estado vacío; guía de Inseparables y descarga no muestran contenido local.
- /carrito y /compra/demo muestran compra no disponible.
- No aparecen códigos internos ni estados editoriales en la tienda.
- Una ruta inexistente muestra la página de no encontrado y noindex. Next puede responder
  HTTP 200 si ya inició streaming: no confundir ese caso con un recurso real.
- No se expone el token privado en HTML, bundle, logs ni diagnóstico.

El entorno que preparó el paquete ya pasó formato, lint, TypeScript, build y 26 rutas con
fixture y Storefront real. La comprobación real usó el token público a través de un adaptador
externo de prueba: falta verificar el token privado y el entorno concreto de Vercel.
Los scripts temporales de prueba no forman parte del parche ni constituyen una suite en el repo.

Cuando todo lo disponible esté verificado, actualizar las notas de estado de la documentación
para que reflejen lo que este agente efectivamente logró, revisar el diff y publicar:

```sh
git add README.md TODO.md 'app/(site)/(shell)/libros/[slug]/page.tsx' lib/catalog/shopify.ts lib/shopify/README.md
git commit -m "fix: support partial Shopify catalog and deduplicate reads"
git push origin main
```

Antes de git add, confirmar que esos archivos solo contienen cambios de esta tarea o conservar
por separado los cambios anteriores del usuario. Si el contenido ya está publicado, no generar
un commit duplicado. No hacer force push.

Comprobar el resultado de Vercel para el nuevo SHA y abrir las rutas anteriores en la URL
desplegada. Reportar SHA publicado, URL, resultado del build y cualquier bloqueo concreto.
No confundir push exitoso con despliegue exitoso.

## Mejoras posteriores, sin bloquear esta entrega

- Caché persistente con invalidación por webhooks cuando el catálogo crezca.
- Convertir los campos rich_text_field de Shopify desde su estructura JSON antes de renderizarlos,
  cuando se complete el contenido de guías; no tratarlos como HTML plano.
- Resolver referencias de estantes vecinos y recomendaciones usando los metacampos de código
  de la colección: sus handles reales son nombres y no est-XX.
- Aprobación editorial, contenido de guías, imágenes oficiales y operación comercial.

No ampliar esta entrega para implementar esas mejoras sin necesidad; el objetivo inmediato es
catálogo parcial funcionando con compras cerradas.
