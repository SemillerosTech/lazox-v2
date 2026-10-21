import type { EditorialRecommendation } from "@/lib/types";

export const editorialRecommendations: EditorialRecommendation[] = [
  {
    shelfCode: "EST-03",
    bookSlug: "inseparables",
    status: "provisional",
    note: "La selección todavía está pendiente de aprobación definitiva por Rossy.",
  },
];

export const neighborBook = {
  title: "Libro vecino",
  status: "pending",
  note: "Pendiente de definición editorial.",
} as const;

export function findRecommendation(shelfCode: string): EditorialRecommendation | undefined {
  return editorialRecommendations.find((item) => item.shelfCode === shelfCode);
}
