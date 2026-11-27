# LAZOX · Cambios de código para la apertura del 30 de noviembre de 2026

Implementa estos cambios en el storefront de LAZOX (Next.js y Shopify). Referencias: [corte del 25 de noviembre de la bitácora](https://claude.ai/artifact/FJXfAT2Cg2f3mbpsnxivyK#estado) y [especificaciones y textos de «Lo de adentro, afuera»](https://claude.ai/artifact/THGbX5iq62rLtQkVSwrtTZ).

Antes de editar, localiza en el repositorio las rutas, componentes, metadatos de Shopify, configuración de WhatsApp y recursos existentes. Comprueba qué tarjetas ya están implementadas y completa las diferencias. Conserva el diseño, las convenciones del repositorio y el funcionamiento de los productos existentes. Usa el texto indicado tal cual.

## Portada

### Tarjeta 5 · Imagen de entrada

- Sustituye el arte del arcoíris del hero (en el borrador, `/images/hero.jpg`) por la foto real L1 de *Inseparables* abierto sobre una mesa con luz de día. Mientras falte la foto, muestra un recuadro gris con el texto «Toma L1 · Inseparables abierto sobre una mesa».
- Coloca una sola gelatinita asomada al borde, visualmente más pequeña que el libro. Usa la referencia aprobada del personaje con ojos de punto, boca cerrada, color plano y un libro sin título. Si el recurso aprobado aún falta, conserva el espacio del hero estable y registra qué archivo falta para incorporar el personaje.
- Permite seleccionar el libro de entrada con el mecanismo de contenido existente. La foto de apertura del libro que elija Rossy se coloca al recibir la selección y la imagen autorizada.
- **Aceptación.** En móvil, incluso con brillo bajo, el libro tiene prioridad visual sobre el personaje. El recuadro provisional se anuncia como texto y el alt de una foto describe la toma real.

### Tarjeta 12 · Qué trae la caja

- Construye el bloque después de «Cinco preguntas para después de leer». Durante el desarrollo, mientras falta C1, usa un recuadro gris con «Toma C1 · La caja abierta con sus tres piezas». Mantén el bloque oculto al público hasta confirmar que la caja existe impresa. Usa la foto real C1 cuando esté disponible.
- Título: «Qué trae la caja». Renglones en este orden:
  1. El libro.
  2. La guía impresa: el mismo contenido de la descarga, en buen papel.
  3. La tarjeta del buen vecino: el libro que va al lado, y por qué.
  4. La tarjeta «Lo que dijo»: un lugar para anotar, con fecha, lo que dijo su hijo después de leer.
- **Aceptación.** El bloque se puede verificar en pruebas y respeta la condición de visibilidad pública. Presenta el contenido de la caja sin precio.

### Tarjeta 13 · Trazaurus y Para escuelas

- Añade dos bloques breves antes del pie. Trazaurus debe verse más pequeño que los estantes. Usa «Trazaurus: una serie para aprender a leer y escribir.» y el botón «Conocer Trazaurus». El botón apunta a su página existente o a una página con su título y «En preparación».
- Usa «Una feria de libros en su escuela. Llevamos los libros; cada uno trae sus preguntas.» y el botón «Escríbanos por WhatsApp» con el mensaje «Hola, escribo de una escuela. Me interesa una feria de libros.»
- **Aceptación.** Los dos destinos funcionan. Ambos bloques quedan sin precio y sin referencias a SILEE.

## Navegación y WhatsApp

### Tarjeta 15 · Menú

- Mantén en escritorio y móvil este orden: **Libros · Guías · Renta escolar · Trazaurus · Para escuelas · Nosotros**.
- Libros apunta a `/estantes`, Guías a su colección y Renta escolar a `/renta-escolar`. Para secciones pendientes, enlaza a una página con su título y «En preparación». Evita enlaces a `#`.
- Mantén carrito y WhatsApp accesibles. Quita el icono de cuenta y muestra la lupa únicamente si hay un buscador funcional.

### Tarjeta 16 y pieza A2 · Línea oficial y mensajes

- Reutiliza o consolida la configuración y el generador de enlaces de WhatsApp. El enlace usa `https://wa.me/52XXXXXXXXXX?text=…`, con la línea mexicana en formato internacional, solo dígitos y el mensaje codificado una vez. Conserva el acceso fijo en móvil y en el menú de escritorio.
- Usa el número oficial cuando Gero lo entregue. El número de prueba pertenece al entorno de demostración. Si falta el oficial, registra el bloqueo de contacto y deja lista la configuración para incorporarlo.
- Usa mensajes contextuales en cada botón:

| Pantalla | Mensaje |
| --- | --- |
| Ficha de libro | Hola, quiero preguntar por el libro [título]. |
| Estante | Hola, busco un libro para un niño o una niña que [nombre del estante]. |
| Para escuelas | Hola, escribo de una escuela. Me interesa [una feria / un acervo / la renta / equipamiento]. |
| Confirmación | Hola, conozco una escuela donde me gustaría que se leyera así. |
| Renta escolar | Hola, me gustaría que la renta escolar llegara a la escuela de mis hijos. |
| Resto de pantallas | Hola, tengo una pregunta. |

- Sustituye las variables por los datos de la pantalla y, en Para escuelas, por la opción correspondiente al botón. El bloque de feria y el CTA de renta conservan sus textos específicos.
- **Aceptación.** Prueba desde un celular el encabezado, el botón fijo y cada CTA contextual. Confirma destinatario y mensaje. Reporta por separado cualquier prueba que aún dependa del número real o de un dispositivo.

## Metadatos y fichas

### Tarjeta 18 · Vista previa al compartir

- Portada, `og:title`: «Lazox · Un libro para lo que le está pasando».
- Portada, `description` y `og:description`: «Cada uno viene con preguntas para conversarlo en casa.»
- Portada, `og:image`: toma real L1 en 1200 × 630 cuando esté disponible. Usa una URL absoluta resoluble y evita imágenes inventadas de libros o de la caja en la vista previa.
- Fichas de libro, `og:title`: «[Título del libro] · Lazox». Usa la pregunta del libro como `og:description` y su portada en `og:image` cuando esté autorizada por la editorial.
- **Aceptación.** Revisa el HTML entregado y comparte el enlace de prueba por WhatsApp para validar la vista previa.

### Tarjeta 20 · Orden de la ficha de *Inseparables*

En `/libros/inseparables`, usa este orden de lectura en móvil y escritorio:

1. Portada autorizada y, como segunda imagen si está disponible, foto propia del libro abierto.
2. Título, autora, ilustradora y editorial.
3. De qué trata y «Para el niño o la niña que…».
4. La pregunta que trae, con su línea de «cuéntame más».
5. Precio y «Agregar al carrito», cuando correspondan.
6. «Descargar la guía · sin registro», junto al botón de carrito y a la misma altura.
7. «Preguntar por WhatsApp» y, debajo, la invitación a Renta escolar de la tarjeta 28.
8. «Vive en estos estantes», con nombres públicos.
9. Su vecino, cuando exista.
10. Datos: edad sugerida, **48 páginas**, formato, encuadernación, editorial, año e ISBN.

- Toma los datos de la fuente de catálogo del repositorio. Para el colofón de *Inseparables*, el valor es **2021**. Mantén los dos precios apagados conforme a la configuración existente. Omite formato y encuadernación de la ficha pública si siguen sin confirmarse y deja constancia como datos faltantes.
- **Aceptación.** La pregunta aparece antes del precio y la guía mantiene su posición junto al carrito. Los requisitos del modo solo renta de la tarjeta 28 tienen prioridad sobre la presentación comercial.

## Confirmación y estados alternativos

### Tarjeta 25 · Confirmación

- En `/pedido/confirmacion-demo` y en la plantilla de correo si está en el repositorio, verifica el orden: «Gracias. Su libro va en camino.» → «Abrir la guía» y «Solicitar factura» → resumen y «Lo que recibirá» → «¿Cómo nos conoció?» → invitación opcional a escuelas.
- Para «¿Cómo nos conoció?» usa «Me lo recomendó otra familia», «En una feria en la escuela», «Buscando en internet», «En redes sociales» y «Otra». Permite omitir la respuesta.
- Invitación: «¿Conoce una escuela donde le gustaría que se leyera así? Si quiere, cuéntenos por WhatsApp y le escribimos para platicar. Es opcional y no cambia nada de su pedido.» Botón: «Contarles por WhatsApp». Usa el mensaje de confirmación de la tarjeta 16.
- **Aceptación.** La guía aparece antes del resumen. La invitación queda al final, funciona con cualquier modalidad de precio y se puede ignorar. Si el correo lo administra Shopify fuera del repositorio, identifica la dependencia en el resumen de implementación.

### Tarjeta 26 · Carrito vacío, ruta inexistente y libro agotado

| Estado | Texto | Acciones |
| --- | --- | --- |
| Carrito vacío | Su carrito está vacío. Los estantes están aquí. | Ver los libros |
| Página inexistente | Esta página no está. Los estantes sí. | Ver los libros · Descargar las cinco preguntas |
| Libro agotado | Este libro se agotó por ahora. Su guía sigue disponible. | Descargar la guía · Avisarme cuando vuelva |

- Usa una gelatinita dormida sobre un libro o asomándose en carrito vacío y página inexistente. Reutiliza un recurso aprobado. Mantén el comportamiento 404 del framework.
- Para el estado agotado, usa la disponibilidad real que llega del catálogo. Conecta el aviso al flujo existente si está disponible. Si falta una integración, registra la dependencia y evita mostrar una suscripción ficticia.
- **Aceptación.** Las rutas de salida existen, el carrito con artículos sigue funcionando y el estado agotado ofrece la guía cuando existe. Prueba una ruta inexistente y una ficha sin inventario.

## Tarjeta 28 · Renta escolar pública

Crea `/renta-escolar` y usa este contenido en orden:

1. **La renta escolar**
2. La renta es por mes. Usted escoge el libro aquí, con la clave de su escuela, y paga el mes. El día de entrega de su escuela, el mismo cada mes, su hija o su hijo recibe el libro con preguntas para conversarlo en casa. Lo regresa el siguiente día de entrega, y ese mismo día recibe el que usted escoja después.
3. Se hace solo donde la escuela, o un grupo de familias de esa escuela, la pide y firma un acuerdo con nosotros. Empezamos con pocas, para hacerlo bien.
4. **Pruébelo primero en casa**. Escoja un libro y descargue su guía, sin registro: son preguntas para conversarlo en casa después de leer. Enlace: «Ver las guías».
5. **¿Le gustaría tenerla en la escuela de sus hijos?** Cuéntenos de su escuela. Le contesta una persona. Botón: «Cuéntenos por WhatsApp», con el texto de Renta escolar de la tarjeta 16.
6. Le contestamos siempre. Si este ciclo no podemos llegar a su escuela, se lo decimos con claridad y queda apuntada para el siguiente.

- Deja la página sin precio, sin referencias a SILEE o a la asociación y sin fotos de niños. Si el diseño necesita una imagen, usa un solo dibujo aprobado del anfitrión junto a un librero abierto.
- Debajo de «Preguntar por WhatsApp» en las fichas de libros, añade «¿Le gustaría que libros como este se rentaran en la escuela de sus hijos?» y el enlace «Así funciona la renta escolar» a `/renta-escolar`.
- Prepara el estado **Solo en renta escolar**, apagado en producción al abrir. Reutiliza la convención de Shopify para identificarlo con un campo de producto. Cuando esté habilitado para un producto, muestra «Solo en renta escolar», «Este libro no está a la venta: aquí solo se presta, por renta escolar.» y el enlace «Así funciona la renta escolar». Omite precio y carrito y valida que el flujo de la aplicación impida agregar ese producto al carrito, incluso al invocar la acción directamente. Los productos existentes sin ese campo conservan su comportamiento.
- Deja preparado, con la condición apagada, el bloque «¿Su escuela ya tiene renta escolar? Entre con la clave que le dieron en su escuela.», campo «Clave de la escuela» y botón «Entrar». Con la condición apagada, el bloque queda fuera de la página pública y su acceso permanece cerrado. El convenio de la primera escuela y «El patio» 2.0 definen su activación y el flujo de libros, folio y pagos.
- **Aceptación.** En móvil, el menú abre la ruta, Guías lleva a su colección y WhatsApp abre su mensaje. El campo de clave permanece oculto. Verifica el estado solo renta en pruebas y el comportamiento normal de *Inseparables*.

## Verificación final

- Ejecuta el lint, chequeo de tipos, pruebas y build que estén definidos en el repositorio.
- Recorre en móvil y escritorio portada → estantes → *Inseparables* → guía → carrito → confirmación de demostración. Revisa también la 404, el estado agotado, `/renta-escolar` y los enlaces de WhatsApp.
- Entrega el resumen de cambios por tarjeta, las verificaciones ejecutadas y los insumos concretos pendientes para activar o validar lo que corresponda. Trabaja con la configuración de desarrollo o vista previa del proyecto para las pruebas.
