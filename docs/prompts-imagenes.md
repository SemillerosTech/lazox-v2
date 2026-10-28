# Prompts para las imágenes que faltan

> Este documento reúne los prompts para generar o preparar las imágenes pendientes del sitio.
> Las medidas y los nombres de archivo son una propuesta; ajústelos al diseño final.

## Regla antes de empezar

- **La toma L1 y la toma C1 son fotografías del producto real.** La IA sirve para el fondo, la luz
  y la composición, no para inventar el libro ni la caja. Un libro generado por IA no es el libro
  que se vende y no se puede publicar como si lo fuera.
- **La portada de Inseparables no se genera.** Es una obra de Tramuntana Editorial, Mar Pavón y
  María Girón. Solo se usa la portada oficial, con permiso escrito.
- **El anfitrión sí se puede generar**, porque es un personaje de marca. Debe respetar las reglas de
  la tarjeta 5.

---

## 1. Toma L1 — Inseparables abierto sobre una mesa

**Dónde va:** primera franja de la portada y, recortada a 1200 × 630, como imagen para compartir.

**Medidas:** 1600 × 1200 px (4:3), WebP o JPG de buena calidad.
**Archivo propuesto:** `public/images/l1-inseparables-mesa.webp`.

### Prompt A — solo el fondo (recomendado)

Se genera la mesa y la luz sin el libro. Después se pega la foto real de Inseparables abierto.

```text
Overhead editorial photograph of a warm oak table beside a window, soft morning daylight coming
from the left, long gentle shadows, a plain linen cloth, a small ceramic cup half out of frame at
the top right, a few dried leaves, muted cream and sage palette, calm and quiet mood, shallow
depth of field, generous empty space in the center-left for a product, no text, no logos, no book,
no people, 4:3 aspect ratio, high resolution
```

**Negative prompt:**

```text
text, watermark, letters, logo, book, hands, faces, children, clutter, harsh flash, oversaturated
colors, plastic look, 3d render, cartoon, rainbow, confetti
```

### Prompt B — escena completa (solo para maqueta)

Sirve para ver cómo se acomoda el bloque. **No se publica**: el libro del prompt no es Inseparables.

```text
Overhead photograph of an open children's picture book lying face up on a warm oak table beside a
window, soft morning daylight from the left, pages slightly curled, a linen napkin and a small
ceramic cup at the top right, muted cream and sage palette, quiet editorial mood, shallow depth of
field, no text, no visible faces, 4:3 aspect ratio, high resolution
```

### Cómo usarla

1. Tome la foto del libro abierto con luz de día, sin flash, sobre una mesa.
2. Recorte el libro y pégalo sobre la imagen del Prompt A, en el espacio libre.
3. El libro debe verse primero y el personaje después. Si el personaje llama más la atención,
   hágalo más chico.
4. Recorte a 1200 × 630 para compartir y mantenga el libro dentro del encuadre.

**Alt text:** `Inseparables abierto sobre una mesa, con luz de día.`

---

## 2. Toma C1 — la caja abierta con sus tres piezas

**Dónde va:** bloque «Qué trae la caja» de la portada y `/pedido/caja-demo`.

**Medidas:** 1600 × 1200 px (4:3), WebP o JPG.
**Archivo propuesto:** `public/images/c1-caja-abierta.webp`.

### Prompt — maqueta de la caja

```text
Top-down product photograph of an open kraft cardboard box on a plain cream background, lid folded
back, three neat compartments inside, soft even daylight, subtle shadow under the box, clean
minimal composition, matte paper texture, no branding, no text, no logo, 4:3 aspect ratio, high
resolution
```

**Negative prompt:**

```text
text, watermark, logo, letters, people, hands, plastic, glossy, cluttered background, harsh flash,
saturated colors, 3d render, cartoon
```

### Cómo usarla

1. Use el prompt para definir la caja y la luz. Sustituya el arte por la caja real cuando exista
   impresa.
2. Dentro de la caja van el libro, la guía impresa y las tarjetas. No agregue objetos que la caja no
   incluya: los cuatro renglones del bloque ya dicen lo que trae.
3. Si la caja todavía no existe, esta imagen queda como maqueta y el bloque sigue mostrando el hueco
   gris hasta que Gero entregue la foto real.

**Alt text:** `La caja de Lazox abierta con el libro, la guía impresa y las tarjetas.`

---

## 3. El anfitrión

**Dónde va:** asomado sobre el borde de la foto de la primera franja, más chico que el libro.
**Uno por pantalla. Nunca señala un precio.**

**Medidas:** 1200 × 1200 px con fondo transparente (PNG o WebP).
**Archivo propuesto:** `public/images/anfitrion-leyendo.webp`.

### Reglas que el personaje debe cumplir

- Ojos de punto.
- Color plano y una sola tinta para ojos y contorno.
- Un brillo como máximo.
- Sin chapitas, sin boca abierta, sin destellos, corazones, estrellas, nubes con cara ni arcoíris.
- Siempre con un libro: leyendo, asomándose, sosteniéndolo, dormido sobre uno o junto a una pila.

### Prompt

```text
Simple flat vector illustration of a small friendly reading mascot, rounded soft body in warm
yellow, two black dot eyes, single thin line smile, no teeth, no open mouth, one solid outline
color, flat colors only, maximum one small highlight, holding a small open book in both hands,
calm and gentle expression, standing and peeking over an edge, isolated on a transparent
background, children's book style, clean thick outline, no shading, no gradient, no sparkle, no
stars, no hearts, no rainbow, no badge, no text, no logo, centered, square composition
```

**Negative prompt:**

```text
sparkles, stars, hearts, rainbow, clouds with faces, badge, pin, open mouth, teeth, tongue,
realistic fur, 3d render, gradient, drop shadow, extra fingers, extra limbs, text, watermark,
logo, busy background
```

### Variantes útiles

- **Asomándose:** el cuerpo cortado por el borde inferior, solo la cabeza y las manos con el libro.
- **Leyendo sentado:** el libro abierto sobre las piernas.
- **Dormido sobre un libro:** para estados vacíos o páginas en preparación.

---

## 4. Portada de Inseparables — no se genera

La portada es una obra protegida. Lo que hay que pedir, por escrito, a Tramuntana Editorial (a
través de Colofón):

- archivo de portada a 300 dpi, sin marco ni sombra;
- autorización de uso en el sitio, en la ficha, en el carrito y en las imágenes para compartir;
- confirmación de si se puede usar también en la caja y en materiales impresos.

Mientras no exista el permiso, el sitio sigue mostrando la portada dibujada en CSS. No se reemplaza
por una portada generada.

---

## 5. Detalles técnicos

- Exporte en WebP y conserve el original en PNG o JPG.
- Sin texto quemado en la imagen: los textos van en HTML.
- Guarde también una versión sin el producto para poder recomponer.
- Nombres de archivo en minúsculas, con guiones y sin acentos.
- Escriba el `alt` en español, describiendo lo que se ve, no lo que se vende.
- Si la imagen pesa más de 300 KB, comprírmela antes de subirla.
