import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: "Qué datos personales recaba Lazox, para qué los usa y cómo ejercer sus derechos.",
  robots: { index: false, follow: false },
};

const UPDATED_AT = "27 de octubre de 2026";

const SECTIONS: LegalSection[] = [
  {
    heading: "Quién es el responsable",
    paragraphs: [
      "[Razón social], con domicilio en [domicilio fiscal], es responsable del tratamiento de sus datos personales.",
      "Correo para asuntos de privacidad: [correo de privacidad].",
    ],
  },
  {
    heading: "Qué datos recabamos",
    paragraphs: ["Cuando compra o nos escribe, podemos recabar:"],
    items: [
      "datos de identificación y contacto: nombre, correo electrónico y teléfono;",
      "datos de envío: calle, número, colonia, ciudad, estado, código postal y referencias;",
      "datos de facturación: RFC, razón social, régimen fiscal y dirección fiscal;",
      "datos de la compra: libros, cantidades, importe y método de pago. No guardamos el número completo de su tarjeta; el cobro lo procesa [proveedor de pagos].",
    ],
  },
  {
    heading: "Qué pasa hoy, mientras el sitio es una demostración",
    paragraphs: [
      "En esta versión de demostración no se envía ningún dato a un servidor. El carrito se guarda en su propio navegador y el resumen del pedido se borra al cerrar la pestaña.",
    ],
  },
  {
    heading: "Para qué usamos sus datos",
    paragraphs: ["Estas son las finalidades necesarias para la compra:"],
    items: [
      "procesar, cobrar y enviar su pedido;",
      "emitir su factura cuando la solicite;",
      "responder dudas, aclaraciones y devoluciones;",
      "cumplir obligaciones fiscales, mercantiles y de consumo.",
    ],
  },
  {
    heading: "Finalidades secundarias",
    paragraphs: [
      "Si en el futuro enviamos novedades, recomendaciones o invitaciones, lo haremos solo si usted lo autoriza. Puede negarse desde el momento en que le pidamos el dato o escribiendo a [correo de privacidad].",
      "Negarse a estas finalidades no afecta su compra ni el acceso a la guía del libro.",
    ],
  },
  {
    heading: "Datos sensibles",
    paragraphs: ["No recabamos datos personales sensibles."],
  },
  {
    heading: "Menores de edad",
    paragraphs: [
      "El sitio está dirigido a personas adultas. Si un menor de edad compra, debe hacerlo con su madre, padre o tutor.",
    ],
  },
  {
    heading: "Con quién compartimos",
    paragraphs: [
      "Solo con quienes nos ayudan a cumplir el pedido: [paquetería] para la entrega, [proveedor de pagos] para el cobro y [proveedor de facturación] para la factura. No vendemos ni rentamos sus datos.",
      "Podemos entregar datos cuando lo requiera una autoridad competente.",
    ],
  },
  {
    heading: "Cuánto tiempo los conservamos",
    paragraphs: [
      "Conservamos los datos del pedido durante [cinco años] o el plazo que exija la ley fiscal y mercantil. Después los eliminamos o los anonimizamos.",
    ],
  },
  {
    heading: "Sus derechos ARCO",
    paragraphs: [
      "Puede solicitar acceso, rectificación, cancelación u oposición, así como revocar su consentimiento, escribiendo a [correo de privacidad].",
      "Responderemos en un plazo máximo de [veinte días hábiles].",
    ],
  },
  {
    heading: "Cookies y tecnologías de medición",
    paragraphs: [
      "Hoy el sitio no usa cookies de analítica ni rastreadores publicitarios. Si los agregamos, actualizaremos este aviso y pediremos su consentimiento antes de activarlos.",
    ],
  },
  {
    heading: "Cambios a este aviso",
    paragraphs: [
      "Podemos actualizar este aviso. La versión vigente es la que está publicada en esta página, con su fecha de actualización.",
    ],
  },
  {
    heading: "Autoridad",
    paragraphs: [
      "Si considera que no atendimos su solicitud, puede acudir al Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI).",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Aviso de privacidad"
      breadcrumb="Privacidad"
      intro="Este aviso explica qué datos personales recabamos, para qué los usamos y cómo puede ejercer sus derechos."
      updatedAt={UPDATED_AT}
      sections={SECTIONS}
    />
  );
}
