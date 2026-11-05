/**
 * Mapa central de claves técnicas de metaobjetos.
 *
 * Las claves fueron verificadas en el administrador de Shopify (Datos
 * personalizados → Metaobjetos) el 5 de noviembre de 2026. Si Shopify cambia
 * una definición, actualice aquí y confirme en /revision/catalogo o con
 * `pnpm shopify:check`. No se adivinan claves.
 */

export type MetaobjectFieldKey = string | null;

export interface GuideFieldKeys {
  title: MetaobjectFieldKey;
  slug: MetaobjectFieldKey;
  book: MetaobjectFieldKey;
  shelfCode: MetaobjectFieldKey;
  intro: MetaobjectFieldKey;
  content: MetaobjectFieldKey;
  questions: MetaobjectFieldKey;
  download: MetaobjectFieldKey;
  status: MetaobjectFieldKey;
  credits: MetaobjectFieldKey;
}

export interface RecommendationFieldKeys {
  book: MetaobjectFieldKey;
  location: MetaobjectFieldKey;
  shelf: MetaobjectFieldKey;
  reason: MetaobjectFieldKey;
  status: MetaobjectFieldKey;
  approvedBy: MetaobjectFieldKey;
}

export interface HomepageFieldKeys {
  identifier: MetaobjectFieldKey;
  title: MetaobjectFieldKey;
  message: MetaobjectFieldKey;
  content: MetaobjectFieldKey;
  order: MetaobjectFieldKey;
  status: MetaobjectFieldKey;
  shelfPrefix: MetaobjectFieldKey;
}

export const GUIDE_FIELD_KEYS: GuideFieldKeys = {
  title: "titulo",
  slug: "slug",
  book: "libro_relacionado",
  shelfCode: "codigo_del_estante",
  intro: "texto_introductorio",
  content: "contenido",
  questions: "preguntas",
  download: "archivo_descargable",
  status: "estado_editorial",
  credits: "creditos",
};

export const RECOMMENDATION_FIELD_KEYS: RecommendationFieldKeys = {
  book: "libro_recomendado",
  location: "ubicacion_de_la_recomendacion",
  shelf: "estante_relacionado",
  reason: "motivo_de_la_recomendacion",
  status: "estado_de_aprobacion_editorial",
  approvedBy: "responsable_de_la_aprobacion",
};

export const HOMEPAGE_FIELD_KEYS: HomepageFieldKeys = {
  identifier: "identificador",
  title: "titulo",
  message: "mensaje_principal",
  content: "contenido",
  order: "orden",
  status: "estado_editorial",
  shelfPrefix: "prefijo_editorial_de_estantes",
};

export const METAOBJECT_TYPES = {
  guide: "guia_de_lectura",
  recommendation: "recomendacion_lazox",
  homepage: "contenido_de_portada_lazox",
} as const;

/**
 * Estados que cuentan como recomendación aprobada por Rossy.
 *
 * Vacío a propósito: no hay vocabulario editorial cerrado. Agregue aquí los
 * valores exactos cuando el equipo los defina. Mientras esté vacío, ninguna
 * recomendación se muestra al público.
 */
export const APPROVED_RECOMMENDATION_STATUSES = new Set<string>([]);

export const SHELF_CODE_PATTERN = /^EST-(0[1-9]|10)$/;

export const PILOT_BOOK_HANDLE = "inseparables";

export const GUIDE_ATTRIBUTION =
  "Guía de Semilleros de Sentido A.C., usada por Lazox bajo licencia.";

export function readMetaobjectField(
  fields: Array<{ key: string; value: string | null }>,
  key: MetaobjectFieldKey,
): string | null {
  if (!key) return null;
  const field = fields.find((item) => item.key === key);
  const value = field?.value?.trim();
  return value ? value : null;
}
