# Prompt · Tablero de las 27 tarjetas

> Instrucciones para convertir `docs/lo-de-adentro-afuera.md` en un artefacto interactivo con
> estado por tarjeta («Hecho» y «Tengo una duda»). El documento original no se modifica.
>
> Uso: abra ChatGPT (Canvas o artefacto), adjunte `docs/lo-de-adentro-afuera.md` y pegue el bloque
> de abajo tal cual. Si prefiere seguir en Markdown, use la variante del final.

## Prompt para ChatGPT

Vas a convertir el documento adjunto («Lo de adentro, afuera», hoja de Gero, 27 tarjetas) en un
artefacto HTML interactivo de una sola página, en español, autocontenido y sin dependencias
externas.

### Objetivo

Cada una de las 27 tarjetas debe poder marcarse como hecha y debe poder recibir una duda, sin
alterar ni una palabra del contenido original.

### Regla de oro de contenido

- Copia el documento literal: títulos, numeración de tarjetas, textos entre «», listas, tablas, el
  apartado «La prueba de la bolsita», «Preguntas para Adrián» y la tabla «Lo que todavía falta de la
  casa».
- No resumas, no reescribas, no corrijas puntuación, no traduzcas, no agregues tarjetas ni
  secciones nuevas, no inventes datos.
- Conserva el estatus original de cada tarjeta tal como aparece («Sale · por hacer», «Cambia · por
  hacer», «Nuevo · por hacer», «Se queda · por hacer»). Los botones nuevos van aparte; no
  sustituyen ese texto.
- Si algo del documento no cabe en el formato o es ambiguo, pregúntame antes de inventarlo.

### Estructura del artefacto

1. Encabezado fijo: título del documento y una barra de progreso con «X de 27 hechas · Y con duda».
2. Un índice lateral o superior con las 27 tarjetas agrupadas como en el original («Hoy mismo»,
   «La portada, de arriba abajo», «En todas las pantallas», «Los estantes», «La ficha del libro»,
   «La guía», «El carrito y después»), con un punto de color por estado: gris pendiente, verde
   hecha, ámbar con duda.
3. El cuerpo del documento, con cada tarjeta como bloque independiente.
4. Al final, «Preguntas para Adrián» y la tabla «Lo que todavía falta de la casa», sin botones.

### Botones por tarjeta

En la cabecera de cada tarjeta, alineados a la derecha, dos botones:

- **«Hecho»**: alterna entre hecha y pendiente (nunca se bloquea; se puede deshacer). Cuando está
  hecha, el botón se ve activo, la tarjeta muestra una marca discreta en el borde izquierdo y el
  índice cambia a verde. Texto accesible: `aria-pressed`.
- **«Tengo una duda»**: abre y cierra un panel dentro de la tarjeta, con un campo de texto
  multilínea, «Guardar duda» y «Quitar duda». Si hay duda guardada, la tarjeta muestra un
  distintivo «Con duda» y el índice cambia a ámbar. El panel debe verse también con el teclado y
  cerrarse con Escape.

No uses modales ni ventanas nuevas. Nada de confirmaciones para marcar hecho; solo para vaciar
todo.

### Modelo de datos y persistencia

- Identificadores estables por tarjeta: `t1` … `t27`, aunque cambie el orden visual.
- Guarda por tarjeta: `{ done: boolean, doubt: string, updatedAt: ISO }`.
- Persiste en `localStorage` con la clave `lazox-fachada-v1`. Envuelve el acceso en `try/catch`: si
  el entorno lo bloquea (algunos artefactos lo hacen), sigue funcionando en memoria y avísalo en una
  línea discreta.
- Al recargar, restaura el estado y la barra de progreso.
- Botón «Reiniciar marcas» con confirmación explícita; no borra nada sin preguntar.

### Filtros

Cuatro botones: «Todas», «Pendientes», «Hechas», «Con duda». Solo ocultan tarjetas; no reordenan ni
reescriben el documento. El filtro activo se recuerda en la misma clave de almacenamiento.

### Exportar

Botón «Copiar avance» que copia al portapapeles un Markdown así, solo con las tarjetas hechas o con
duda:

```md
## Avance

- [x] Tarjeta 1 · Las opiniones inventadas salen — hecha
- [ ] Tarjeta 16 · WhatsApp en todas las pantallas — duda: «¿el número de prueba va en .env.local?»
```

Y un botón «Descargar avance» que descarga ese mismo texto como `.md`. No incluyas datos personales
ni nada que el documento no diga.

### Reglas técnicas y visuales

- Un solo archivo HTML con CSS y JavaScript embebidos; sin CDN, sin fuentes externas, sin imágenes,
  sin peticiones de red.
- Responsive: legible a 390 px y a 1440 px, sin scroll horizontal. En móvil los dos botones se
  apilan y siguen siendo tocables (mínimo 44 px).
- Accesible: contraste suficiente, foco visible, botones reales, estados anunciados con
  `aria-pressed` y `aria-expanded`, panel de duda asociado al botón.
- Estilos de impresión: ocultar botones, filtros y barra de progreso; el documento debe imprimirse
  como el original.
- Tipografía del sistema, tono sobrio; el color solo para estado (gris, verde, ámbar), sin
  decoración.

### Criterios de aceptación

1. Las 27 tarjetas aparecen, en el orden del documento, con su texto intacto.
2. Cada tarjeta tiene «Hecho» y «Tengo una duda» funcionando y persistente.
3. La barra dice el total correcto (27) y se actualiza al marcar.
4. Los cuatro filtros y «Copiar avance» funcionan.
5. Recargar no pierde marcas ni dudas.
6. No hay ninguna frase nueva dentro del contenido de las tarjetas.
7. Se imprime limpio.

### Entrega

Primero devuélveme el artefacto completo. Si por longitud no cabe de una vez, dímelo y entrégamelo
en dos partes: (1) el esqueleto con el CSS y el JavaScript y las tarjetas 1 a 14, (2) las tarjetas
15 a 27 y los cierres. No resumas el documento para que quepa.

## Variante en Markdown

Si prefiere que el tablero viva en el repositorio y se versione con Git, use esta petición en lugar
de la anterior: «devuélveme el mismo documento en Markdown, con cada tarjeta seguida de dos casillas
`- [ ] Hecho` y `- [ ] Tengo una duda`, y un campo `> Duda:` vacío».

## Notas

- **Persistencia:** si el artefacto corre en un iframe que bloquea `localStorage`, el respaldo en
  memoria pierde las marcas al recargar. En ese caso, «Copiar avance» funciona como respaldo
  manual.
- **Seguimientos útiles:** «Agrega un contador por bloque (Hoy mismo, La portada…)», «Haz que
  "Tengo una duda" guarde también una fecha» y «Exporta además un CSV con tarjeta, estado y duda».
- Este prompt no autoriza a cambiar `docs/lo-de-adentro-afuera.md`; solo a representarlo.
