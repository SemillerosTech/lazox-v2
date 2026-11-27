import type { CatalogRepository } from "./types";

/** Cuenta los mismos libros que muestra cada estante, desde la fuente activa. */
export async function listShelvesWithBookCounts(repository: CatalogRepository) {
  const shelves = await repository.listShelves();

  return Promise.all(
    shelves.map(async (shelf) => ({
      ...shelf,
      bookCount: (await repository.listBooksByShelf(shelf.code)).length,
    })),
  );
}
