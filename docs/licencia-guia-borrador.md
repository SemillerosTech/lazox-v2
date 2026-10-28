# Borrador de licencia de uso — Guía «Inseparables»

> **Documento de trabajo.** No es un contrato firmado y no tiene validez legal. Su único fin es
> servir como punto de partida para la revisión de un abogado y para la conversación con
> Semilleros de Sentido A.C. Todo lo que está entre corchetes debe completarse antes de firmar.
>
> Mientras este documento no esté firmado, la guía conserva su aviso de borrador, su `noindex` y
> el estado interno `license.status: "pending"` en `lib/data/guides.ts`.

## 1. Partes

**Licenciante:** Semilleros de Sentido A.C., RFC [RFC], con domicilio en [domicilio], representada
por [nombre y cargo].

**Licenciatario:** [razón social de Lazox], RFC [RFC], con domicilio en [domicilio], representada
por [nombre y cargo].

## 2. Obra licenciada

La «Guía para conversar en familia» del libro **Inseparables** (texto de Mar Pavón, ilustraciones de
María Girón, Tramuntana Editorial, 2015), en la versión [fecha o número de versión].

El texto aprobado se anexa como **Anexo A** y forma parte de esta licencia.

## 3. Alcance de la licencia

La licencia es **no exclusiva**, **no transferible** y territorialmente limitada a [México], por un
plazo de [tres años] renovable.

**Usos permitidos**

- Publicar la guía en lazox.com, dentro de la ficha del libro y en la sección de guías.
- Entregar la guía en formato digital a quien compre el libro.
- Permitir una impresión para uso familiar desde el sitio.
- Usar fragmentos breves en materiales de la tienda sin precio (páginas de escuelas y SILEE), con
  autorización previa por escrito.

**Usos no permitidos**

- Vender la guía por separado o incluirla en un producto distinto al libro.
- Modificar, resumir, traducir o adaptar el texto sin autorización escrita.
- Sublicenciar, ceder o transferir la licencia a terceros.
- Usarla en publicidad pagada, medios externos o empaques sin autorización escrita.
- Registrar la guía, su nombre o variantes como marca.

## 4. Atribución

El Licenciatario incluirá de forma visible, en la guía digital, en su versión imprimible y en
cualquier reproducción autorizada, el texto literal:

> Guía de Semilleros de Sentido A.C., usada por Lazox bajo licencia.

Formato y ubicación: [tamaño, color y posición acordados].

## 5. Propiedad intelectual

La guía y su contenido son propiedad de Semilleros de Sentido A.C. El libro, su portada, sus
ilustraciones y sus textos son de sus respectivos titulares: Tramuntana Editorial, Mar Pavón y
María Girón.

Esta licencia **no concede** derechos sobre el libro, su portada ni sus imágenes.

## 6. Contraprestación

[Gratuita / monto, forma y periodicidad de pago]. [Regalías, si aplica: porcentaje, base de cálculo
y fecha de pago].

## 7. Confidencialidad y datos personales

[Cláusula si aplica]. El Licenciatario no comparte con el Licenciante datos personales de lectores.

## 8. Vigencia y terminación

- **Inicio:** [fecha].
- **Plazo:** [tres años], con renovación automática salvo aviso con [sesenta] días de anticipación.
- **Terminación anticipada:** por incumplimiento, con [quince] días para subsanar.
- **Efectos de la terminación:** el Licenciatario retira la guía del sitio en [treinta] días. Los
  ejemplares ya entregados a lectores no se recuperan. Puede conservar una copia de archivo para
  efectos probatorios.

## 9. Garantías y límites

- El Licenciante declara ser titular de los derechos de la guía y que su contenido no infringe
  derechos de terceros.
- El Licenciatario responde por el uso que dé a la guía y por el cumplimiento de la atribución.
- [Límite de responsabilidad acordado].

## 10. Ley aplicable

Estas cláusulas se rigen por las leyes de los Estados Unidos Mexicanos. Las partes se someten a los
tribunales de [ciudad], renunciando a cualquier otro fuero.

## 11. Anexos

- **A.** Texto aprobado de la guía.
- **B.** Lineamientos de marca y atribución.
- **C.** Calendario de revisión y contacto responsable.

## 12. Firmas

| Parte              | Nombre y cargo | Firma | Fecha |
| ------------------ | -------------- | ----- | ----- |
| Semilleros de Sentido A.C. | [ ]            | [ ]   | [ ]   |
| [Razón social de Lazox]    | [ ]            | [ ]   | [ ]   |

---

## Qué falta para que esta licencia sea real

1. **Datos de las partes:** razón social, RFC y domicilio de Lazox; representante legal de cada
   parte.
2. **Texto definitivo de la guía:** hoy `sections` está vacío en `lib/data/guides.ts`; sin contenido
   aprobado no hay Anexo A.
3. **Decisión de la contraprestación:** gratuita o con pago. Debe cuadrar con la cuenta del 30 % de
   los dos precios.
4. **Revisión legal:** que un abogado valide el alcance, la terminación y la responsabilidad.
5. **Firma y archivo:** guardar el PDF firmado fuera del repositorio. Nunca commitear el documento
   firmado ni datos personales de los firmantes.

Cuando exista la firma, cambiar en `lib/data/guides.ts`:

```ts
license: {
  attribution: "Guía de Semilleros de Sentido A.C., usada por Lazox bajo licencia.",
  status: "confirmed",
}
```

Y retirar el aviso de licencia pendiente de la guía y de su versión imprimible.
