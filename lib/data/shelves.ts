import type { Shelf } from "@/lib/types";

/**
 * Los códigos EST-XX son estables y no dependen del nombre editorial.
 * El orden de este arreglo es el orden de presentación en /estantes.
 */
export const shelves: Shelf[] = [
  {
    code: "EST-10",
    slug: "est-10",
    name: "solo quiere reírse",
    order: 1,
    bookSlugs: [],
  },
  {
    code: "EST-09",
    slug: "est-09",
    name: "todavía no lee, pero ya lee",
    order: 2,
    bookSlugs: [],
  },
  {
    code: "EST-06",
    slug: "est-06",
    name: "está empezando de nuevo",
    order: 3,
    bookSlugs: [],
  },
  {
    code: "EST-04",
    slug: "est-04",
    name: "tiene miedo de algo",
    order: 4,
    bookSlugs: [],
  },
  {
    code: "EST-08",
    slug: "est-08",
    name: "pregunta cosas grandes",
    order: 5,
    bookSlugs: [],
  },
  {
    code: "EST-03",
    slug: "est-03",
    name: "teme perder lo que ama",
    order: 6,
    bookSlugs: ["inseparables"],
  },
  {
    code: "EST-02",
    slug: "est-02",
    name: "cree que no puede",
    order: 7,
    bookSlugs: [],
  },
  {
    code: "EST-05",
    slug: "est-05",
    name: "se siente distinto a todos",
    order: 8,
    bookSlugs: [],
  },
  {
    code: "EST-07",
    slug: "est-07",
    name: "vio algo que no le pareció justo",
    order: 9,
    bookSlugs: [],
  },
  {
    code: "EST-01",
    slug: "est-01",
    name: "siente que solo sabe romper",
    order: 10,
    bookSlugs: [],
  },
];

export function findShelfBySlug(slug: string): Shelf | undefined {
  return shelves.find((shelf) => shelf.slug === slug);
}
