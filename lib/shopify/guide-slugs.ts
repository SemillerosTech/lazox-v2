import "server-only";

import { GUIDE_FIELD_KEYS, readMetaobjectField } from "./metaobject-fields";
import type { ShopifyMetaobject } from "./types";

/** Un solo segmento de URL; no se corrige ni se reemplaza por el handle. */
export function isGuideSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export function getGuideSlug(metaobject: ShopifyMetaobject): string | null {
  const slug = readMetaobjectField(metaobject.fields, GUIDE_FIELD_KEYS.slug);
  return slug && isGuideSlug(slug) ? slug : null;
}

export interface GuideSlugIssue {
  handle: string;
  slug: string | null;
  reason: "missing" | "invalid" | "duplicate";
}

/** Excluye TODAS las entradas ambiguas, no solo la segunda aparición. */
export function indexGuideSlugs(metaobjects: ShopifyMetaobject[]) {
  const counts = new Map<string, number>();
  for (const metaobject of metaobjects) {
    const slug = getGuideSlug(metaobject);
    if (slug) counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }

  const bySlug = new Map<string, ShopifyMetaobject>();
  const byId = new Map<string, ShopifyMetaobject>();
  const issues: GuideSlugIssue[] = [];

  for (const metaobject of metaobjects) {
    const slug = readMetaobjectField(metaobject.fields, GUIDE_FIELD_KEYS.slug);
    const reason = !slug
      ? "missing"
      : !isGuideSlug(slug)
        ? "invalid"
        : (counts.get(slug) ?? 0) > 1
          ? "duplicate"
          : null;

    if (reason || !slug) {
      issues.push({ handle: metaobject.handle, slug, reason: reason ?? "missing" });
      continue;
    }

    bySlug.set(slug, metaobject);
    byId.set(metaobject.id, metaobject);
  }

  return { bySlug, byId, issues };
}
