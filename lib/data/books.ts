import type { Book } from "@/lib/types";

export const books: Book[] = [
  {
    id: "inseparables",
    slug: "inseparables",
    title: "Inseparables",
    author: "Mar Pavón",
    illustrator: "María Girón",
    publisher: "Tramuntana Editorial",
    year: 2015,
    isbn: "978-84-943046-0-6",
    pages: 48,
    coverImage: "/images/portada-inseparables.jpg",
    price: { amount: 43500, currency: "MXN" },
    priceMode: "single",
    availability: "available",
    ageSuggestion: "Hacia los 7 años en adelante, y por toda la familia",
    shelfCode: "EST-03",
    synopsis:
      "Dos zapatillas que iban juntas a todas partes, hasta que un día algo las separa. Una de ellas cuenta el viaje: el camino lejos de casa, la espera, las manos desconocidas. Un cuento sobre lo que la guerra les quita a los más pequeños, y sobre lo que todavía puede llegar cuando ya casi nadie lo esperaba.",
    forWhom:
      "teme perder lo que ama, o ya perdió algo y le cuesta creer que después de eso algo bueno pueda volver. Aquí encuentra una historia donde lo perdido no es el final del camino.",
    conversationQuestion: "¿Hay algo o alguien que no te gustaría perder nunca?",
    conversationRule:
      "Aquí no hay respuestas correctas. Si lo que diga te sorprende, la mejor respuesta son dos palabras: «cuéntame más».",
    status: "provisional",
    guideSlug: "inseparables",
  },
];

export function findBookBySlug(slug: string): Book | undefined {
  return books.find((book) => book.slug === slug);
}
