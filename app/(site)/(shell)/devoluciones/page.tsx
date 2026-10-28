import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Devoluciones y cambios",
  description: "Plazos, condiciones y pasos para devolver o cambiar un libro comprado en Lazox.",
  robots: { index: false, follow: false },
};

const UPDATED_AT = "27 de octubre de 2026";

const SECTIONS: LegalSection[] = [
  {
    heading: "Plazo",
    paragraphs: [
      "Puede pedir un cambio o una devolución dentro de los [treinta] días naturales siguientes a la entrega.",
    ],
  },
  {
    heading: "Condiciones",
    paragraphs: ["Para aceptar la devolución, el libro debe estar:"],
    items: [
      "sin uso, sin marcas, sin dobleces y sin anotaciones;",
      "en su empaque original cuando sea posible;",
      "acompañado del comprobante o del número de pedido.",
    ],
  },
  {
    heading: "Cómo se solicita",
    paragraphs: [
      "Escríbanos por WhatsApp con su número de pedido y una foto del libro. Le confirmamos si aplica y le damos los pasos para enviarlo de vuelta.",
    ],
  },
  {
    heading: "Reembolso",
    paragraphs: [
      "Devolvemos el importe por el mismo método de pago, una vez que recibimos y revisamos el libro. El reembolso tarda [cinco a diez días hábiles] en reflejarse.",
    ],
  },
  {
    heading: "Cambios",
    paragraphs: [
      "Si el libro llegó dañado o no es el que pidió, cubrimos el envío de regreso y le enviamos el correcto sin costo.",
      "Si el cambio es por decisión propia, el envío de regreso corre por cuenta de [cliente].",
    ],
  },
  {
    heading: "Libro dañado en el camino",
    paragraphs: [
      "Mándenos una foto del paquete y del libro el mismo día que lo reciba. Lo resolvemos.",
    ],
  },
  {
    heading: "Qué no se puede devolver",
    paragraphs: ["No aplican devoluciones en:"],
    items: [
      "guías o materiales descargables, una vez abiertos o usados;",
      "productos personalizados;",
      "libros con signos claros de uso.",
    ],
  },
  {
    heading: "Pedidos para escuelas",
    paragraphs: [
      "Los pedidos de ferias, acervos, renta y equipamiento se rigen por la cotización firmada. Escríbanos para revisar el caso.",
    ],
  },
  {
    heading: "Contacto",
    paragraphs: ["Escríbanos por WhatsApp o a [correo de contacto]."],
  },
];

export default function ReturnsPage() {
  return (
    <LegalPage
      title="Devoluciones y cambios"
      breadcrumb="Devoluciones"
      intro="Queremos que el libro llegue bien y que sea el que necesita. Si no es así, aquí está el camino."
      updatedAt={UPDATED_AT}
      sections={SECTIONS}
    />
  );
}
