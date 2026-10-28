import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Envíos",
  description:
    "Cómo llega su pedido de Lazox, cuánto tarda y qué pasa si algo sale mal en el camino.",
  robots: { index: false, follow: false },
};

const UPDATED_AT = "27 de octubre de 2026";

const SECTIONS: LegalSection[] = [
  {
    heading: "Dónde entregamos",
    paragraphs: [
      "Enviamos a [todo México]. Si necesita un envío fuera del país, escríbanos por WhatsApp y lo revisamos juntos.",
    ],
  },
  {
    heading: "Cuánto cuesta",
    paragraphs: [
      "El costo del envío se calcula con su código postal y se muestra antes de confirmar la compra.",
      "[Envío sin costo a partir de $[monto]]. [Costo fijo de $[monto] en el resto de los casos].",
    ],
  },
  {
    heading: "Cuánto tarda",
    paragraphs: [
      "Preparamos su pedido en [uno a tres días hábiles]. El tiempo de tránsito depende de la paquetería y del destino: [dos a siete días hábiles] dentro de México.",
      "Los pedidos para escuelas pueden requerir más tiempo; se acuerda en la cotización.",
    ],
  },
  {
    heading: "Quién lo lleva",
    paragraphs: [
      "Trabajamos con [paquetería]. Si su zona requiere otra, se lo avisamos antes de enviar.",
    ],
  },
  {
    heading: "Cómo sigue su pedido",
    paragraphs: [
      "Le enviamos el número de guía a [correo o WhatsApp] cuando el paquete sale de nuestro almacén.",
    ],
  },
  {
    heading: "Cómo empacamos",
    paragraphs: [
      "Los libros viajan protegidos. Los pedidos de un solo libro pueden llegar en sobre acolchado; los pedidos mayores, en caja.",
    ],
  },
  {
    heading: "Pedidos para escuelas",
    paragraphs: [
      "Ferias, acervos, renta y equipamiento se cotizan aparte. Escríbanos por WhatsApp desde la página Para escuelas.",
    ],
  },
  {
    heading: "Si no hay nadie en el domicilio",
    paragraphs: [
      "[La paquetería intenta la entrega hasta [número] veces y deja un aviso para reprogramar.]",
    ],
  },
  {
    heading: "Si la dirección estaba incompleta",
    paragraphs: [
      "Si el paquete regresa por una dirección incorrecta o incompleta, nos pondremos en contacto para reenviarlo. El segundo envío corre por cuenta de [cliente o Lazox].",
    ],
  },
  {
    heading: "Si el paquete no llega",
    paragraphs: [
      "Escríbanos con su número de pedido. Abrimos la investigación con la paquetería y le respondemos en [plazo].",
    ],
  },
];

export default function ShippingPage() {
  return (
    <LegalPage
      title="Envíos"
      intro="Cómo llega su pedido, cuánto tarda y qué pasa si algo sale mal en el camino."
      updatedAt={UPDATED_AT}
      sections={SECTIONS}
    />
  );
}
