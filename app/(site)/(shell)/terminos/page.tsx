import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description:
    "Cómo funciona la tienda Lazox: precios, compras, envíos, devoluciones y uso del sitio.",
  robots: { index: false, follow: false },
};

const UPDATED_AT = "27 de octubre de 2026";

const SECTIONS: LegalSection[] = [
  {
    heading: "Quién está detrás de Lazox",
    paragraphs: [
      "Lazox es una tienda de libros, estantes y guías para leer en familia. El sitio es operado por [razón social], con RFC [RFC] y domicilio en [domicilio fiscal].",
      "Para cualquier aclaración puede escribirnos por WhatsApp o a [correo de contacto].",
    ],
  },
  {
    heading: "Qué ofrece este sitio",
    paragraphs: [
      "Vendemos libros y materiales editoriales. Cada libro puede venir acompañado de una guía para conversarlo en casa.",
      "Los estantes agrupan libros por lo que un niño o una niña está viviendo. Los estantes que todavía no tienen una selección aprobada muestran un aviso, sin recomendaciones inventadas.",
    ],
  },
  {
    heading: "Precios y moneda",
    paragraphs: [
      "Todos los precios están en pesos mexicanos (MXN) e incluyen [los impuestos aplicables].",
      "El precio que vale es el que aparece en la ficha del libro al momento de confirmar la compra.",
      "No manejamos descuentos, promociones, precios tachados ni pagos en meses.",
    ],
  },
  {
    heading: "Compras y pagos",
    paragraphs: [
      "Hoy este sitio es una demostración: puede recorrerlo, agregar libros al carrito y llegar hasta el final, pero no se realiza ningún cargo ni se genera un pedido real.",
      "Cuando la tienda abra, las formas de pago serán [tarjeta, transferencia y efectivo en tiendas de conveniencia]. El cobro se procesa con [proveedor de pagos]; Lazox no guarda el número completo de su tarjeta.",
    ],
  },
  {
    heading: "Envíos",
    paragraphs: [
      "Las condiciones de entrega están en la página Envíos, que forma parte de estos términos.",
    ],
  },
  {
    heading: "Devoluciones y cambios",
    paragraphs: [
      "Los plazos y condiciones están en la página Devoluciones, que forma parte de estos términos.",
    ],
  },
  {
    heading: "Guías y contenido editorial",
    paragraphs: [
      "Las guías se publican con la atribución literal: “Guía de Semilleros de Sentido A.C., usada por Lazox bajo licencia.”",
      "El texto de las guías no puede copiarse, reproducirse ni distribuirse sin autorización escrita.",
    ],
  },
  {
    heading: "Propiedad intelectual",
    paragraphs: [
      "La marca Lazox, los textos de este sitio y sus composiciones gráficas son de [razón social].",
      "Los libros, sus portadas, ilustraciones y textos son de sus autores y editoriales. Inseparables es de Tramuntana Editorial; el texto es de Mar Pavón y las ilustraciones de María Girón.",
    ],
  },
  {
    heading: "Uso del sitio",
    paragraphs: ["Al usar este sitio usted se compromete a no:"],
    items: [
      "usarlo para fines ilícitos o para dañar a otras personas;",
      "alterar precios, el carrito o la información de inventario;",
      "copiar de forma masiva el contenido del sitio;",
      "introducir código malicioso o intentar acceder a áreas que no le corresponden.",
    ],
  },
  {
    heading: "Responsabilidad",
    paragraphs: [
      "Hacemos lo posible por que la información de cada libro sea correcta. Si encuentra un error en un título, un precio o la disponibilidad, escríbanos y lo corregimos.",
      "[Alcance de la responsabilidad, según la revisión del abogado].",
    ],
  },
  {
    heading: "Cambios a estos términos",
    paragraphs: [
      "Podemos actualizar estos términos. La versión vigente es la que está publicada en esta página, con su fecha de actualización.",
    ],
  },
  {
    heading: "Ley aplicable",
    paragraphs: [
      "Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Para cualquier controversia, las partes se someten a los tribunales de [ciudad], renunciando a cualquier otro fuero.",
    ],
  },
  {
    heading: "Contacto",
    paragraphs: ["Escríbanos por WhatsApp o a [correo de contacto]."],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Términos y condiciones"
      breadcrumb="Términos"
      intro="Estas condiciones explican cómo funciona la tienda: qué vendemos, cómo se paga, cómo se envía y qué puede esperar de nosotros."
      updatedAt={UPDATED_AT}
      sections={SECTIONS}
    />
  );
}
