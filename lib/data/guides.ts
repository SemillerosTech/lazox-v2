import type { Guide } from "@/lib/types";

import { findBookBySlug } from "./books";

function buildGuide(bookSlug: string): Guide | undefined {
  const book = findBookBySlug(bookSlug);
  if (!book) return undefined;

  return {
    slug: book.guideSlug ?? book.slug,
    bookSlug: book.slug,
    title: book.title,
    author: book.author,
    illustrator: book.illustrator,
    ageSuggestion: book.ageSuggestion,
    synopsis: book.synopsis,
    conversationQuestion: book.conversationQuestion,
    conversationRule: book.conversationRule,
    // Preparado para recibir el contenido editorial extenso desde Shopify.
    // Mientras la guía completa no exista, se muestra el contenido aprobado.
    sections: [],
    license: {
      attribution: "Guía de Semilleros de Sentido A.C., usada por Lazox bajo licencia.",
      status: "pending",
    },
  };
}

export const guides: Guide[] = [buildGuide("inseparables")].filter(
  (guide): guide is Guide => guide !== undefined,
);

export function findGuideBySlug(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export function findGuideByBookSlug(bookSlug: string): Guide | undefined {
  return guides.find((guide) => guide.bookSlug === bookSlug);
}
