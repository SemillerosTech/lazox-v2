import type { DemoTourStep } from "./demo-tour.types";

/**
 * Guion del recorrido. Los textos son los aprobados para la demostración
 * ejecutiva y deben conservarse literalmente.
 */
export const DEMO_TOUR_STEPS: DemoTourStep[] = [
  {
    id: "home-hero",
    route: "/",
    target: '[data-tour="home-hero"]',
    title: "Bienvenido a LAZOX",
    description:
      "Le mostraremos cómo una familia puede encontrar un libro, conocer su guía, hacer una pregunta y completar una compra. Utilizaremos Inseparables como ejemplo.",
    side: "bottom",
    align: "center",
    action: "advance",
  },
  {
    id: "home-shelves",
    route: "/",
    target: '[data-tour="home-shelves"]',
    title: "Una forma distinta de encontrar libros",
    description:
      "En LAZOX los libros se organizan por lo que le está pasando al niño o la niña, no solamente por edad o editorial.",
    side: "top",
    align: "center",
    action: "advance",
  },
  {
    id: "shelves-grid",
    route: "/estantes",
    target: '[data-tour="shelves-grid"]',
    title: "Diez maneras de comenzar",
    description:
      "Cada estante reúne libros para distintas situaciones. Los primeros también invitan a leer simplemente por diversión.",
    side: "top",
    align: "start",
    action: "advance",
  },
  {
    id: "shelf-est-03",
    route: "/estantes",
    target: '[data-tour="shelf-est-03"]',
    title: "Un estante para Inseparables",
    description:
      "Vamos a visitar «teme perder lo que ama». Aquí comenzaremos nuestro ejemplo de compra.",
    side: "bottom",
    align: "start",
    action: "advance",
  },
  {
    id: "inseparables-card",
    route: "/estantes/est-03",
    target: '[data-tour="inseparables-card"]',
    title: "Un libro recomendado por la casa",
    description:
      "Inseparables es nuestra selección provisional para este estante. Cada recomendación será elegida por una persona, nunca automáticamente por una máquina.",
    side: "bottom",
    align: "center",
    action: "advance",
  },
  {
    id: "product-info",
    route: "/libros/inseparables",
    target: '[data-tour="product-info"]',
    title: "Conozcamos Inseparables",
    description:
      "Aquí encontrará la historia, sus autores, la edad sugerida y la información necesaria para decidir si quiere llevarlo a casa.",
    side: "bottom",
    align: "center",
    action: "advance",
  },
  {
    id: "product-question",
    route: "/libros/inseparables",
    target: '[data-tour="product-question"]',
    title: "Cada libro trae una conversación",
    description:
      "Además de leer, las familias reciben una pregunta para conversar después. Es una de las características que distinguen a LAZOX.",
    side: "top",
    align: "center",
    action: "advance",
  },
  {
    id: "product-guide",
    route: "/libros/inseparables",
    target: '[data-tour="product-guide"]',
    title: "Una guía para acompañar la lectura",
    description:
      "Cada libro tendrá su propia guía. Es gratuita, no requiere registro y se puede consultar antes de comprar.",
    side: "left",
    align: "center",
    action: "advance",
  },
  {
    id: "guide-content",
    route: "/guias/inseparables",
    target: '[data-tour="guide-content"]',
    title: "La conversación puede empezar aquí",
    description:
      "Esta es la página de la guía de Inseparables. Por ahora utiliza el contenido disponible de la tarjeta de Rossy; la guía definitiva ocupará esta misma dirección.",
    side: "bottom",
    align: "start",
    action: "advance",
  },
  {
    id: "product-whatsapp",
    route: "/libros/inseparables",
    target: '[data-tour="product-whatsapp"]',
    title: "Una persona puede orientarle",
    description:
      "Si tiene preguntas sobre el libro, puede escribirnos por WhatsApp. Las recomendaciones siempre las hace una persona de LAZOX.",
    side: "bottom",
    align: "center",
    action: "advance",
    disableActiveInteraction: true,
    callout: {
      label: "Mensaje preparado",
      text: "«Hola, quiero preguntar por el libro Inseparables.»",
      tone: "message",
    },
  },
  {
    id: "product-add-cart",
    route: "/libros/inseparables",
    target: '[data-tour="product-add-cart"]',
    title: "Llevemos Inseparables a casa",
    description:
      "Ahora agregaremos el libro al carrito para conocer cómo funcionará el proceso de compra.",
    side: "bottom",
    align: "center",
    action: "ensure-cart",
    disableActiveInteraction: true,
  },
  {
    id: "cart-summary",
    route: "/carrito",
    target: '[data-tour="cart-summary"]',
    title: "Aquí revisamos la compra",
    description:
      "La familia puede comprobar el libro elegido, la cantidad y el subtotal antes de continuar.",
    side: "left",
    align: "center",
    action: "advance",
  },
  {
    id: "checkout-methods",
    route: "/compra/demo",
    target: '[data-tour="checkout-methods"]',
    title: "Así se completará la compra",
    description:
      "El pago definitivo se gestionará mediante Shopify. Contemplamos tarjetas, billeteras digitales, OXXO y transferencia bancaria manual.",
    side: "top",
    align: "center",
    action: "complete-demo-order",
    callout: {
      label: "Demostración",
      text: "Esta es una demostración. No se realizará ningún cargo.",
      tone: "demo",
    },
  },
  {
    id: "order-confirmation",
    route: "/pedido/confirmacion-demo",
    target: '[data-tour="order-confirmation"]',
    title: "Su pedido está confirmado",
    description:
      "En el sistema definitivo, la familia recibirá la confirmación de su compra y el acceso a la guía del libro. También podrá solicitar su factura.",
    side: "bottom",
    align: "center",
    action: "advance",
  },
  {
    id: "unboxing",
    route: "/pedido/caja-demo",
    target: '[data-tour="unboxing"]',
    title: "Lo que llegará a casa",
    description:
      "El libro llegará acompañado de su tarjeta, el espacio para el buen vecino y la tarjeta «lo que dijo», para que la conversación continúe después de abrir la caja.",
    side: "top",
    align: "center",
    action: "advance",
  },
  {
    id: "tour-complete",
    route: "/pedido/caja-demo",
    title: "Este es el primer recorrido de LAZOX",
    description:
      "Acabamos de recorrer Inseparables desde el descubrimiento hasta la caja. Una vez aprobado este modelo, podremos utilizar la misma estructura para incorporar los demás libros.",
    action: "finish",
  },
];
