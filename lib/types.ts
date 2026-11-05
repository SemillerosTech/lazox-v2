/** Código ISO de la moneda que entrega Shopify (MXN en esta tienda). */
export type Currency = string;

export type PriceOption = "normal" | "economic";

export type BookAvailability = "available" | "out_of_stock";

export interface BookPrice {
  /** Precio en centavos para evitar errores de punto flotante. */
  amount: number;
  currency: Currency;
}

export interface BookNeighbor {
  title: string;
  slug: string;
  reason?: string;
}

export interface Book {
  /** Identificador estable de la aplicación. Hoy coincide con el slug. */
  id: string;
  slug: string;
  title: string;
  author: string;
  illustrator?: string;
  translator?: string;
  publisher?: string;
  year?: number;
  isbn?: string;
  pages?: number;
  format?: string;
  binding?: string;
  price: BookPrice;
  priceMode?: "single" | "libre";
  /** Fecha de impresión o reimpresión del lote, en formato ISO. */
  printedAt?: string;
  availability?: BookAvailability;
  ageSuggestion: string;
  shelfCode?: string;
  synopsis: string;
  /** HTML enriquecido y ya saneado, cuando la fuente lo entrega. */
  descriptionHtml?: string;
  forWhom?: string;
  conversationQuestion: string;
  conversationRule?: string;
  coverImage?: string;
  coverImageAlt?: string;
  status: "published" | "provisional";
  guideSlug?: string;
  sku?: string;
  shopifyProductId?: string;
  /** ID de la variante de Shopify. Nunca se usa el ID del producto como merchandiseId. */
  variantId?: string;
  variantTitle?: string;
  weightGrams?: number | null;
  inventoryQuantity?: number | null;
  priceCondition?: string;
  bookStatus?: string;
  colophonOrigin?: string;
  neighborBook?: BookNeighbor;
  neighborShelfCodes?: string[];
}

export interface Shelf {
  code: string;
  slug: string;
  name: string;
  order: number;
  line?: string;
  descriptionHtml?: string;
  bookSlugs: string[];
  shopifyCollectionId?: string;
}

export interface GuideSection {
  heading?: string;
  paragraphs: string[];
}

export interface Guide {
  slug: string;
  bookSlug: string;
  title: string;
  author: string;
  illustrator?: string;
  ageSuggestion: string;
  synopsis: string;
  /** HTML enriquecido y ya saneado, cuando la fuente lo entrega. */
  descriptionHtml?: string;
  introHtml?: string;
  contentHtml?: string;
  questionsHtml?: string;
  downloadUrl?: string;
  credits?: string;
  conversationQuestion: string;
  conversationRule?: string;
  sections: GuideSection[];
  license: {
    attribution: string;
    status: "pending" | "confirmed";
  };
  status?: string;
}

export interface EditorialRecommendation {
  shelfCode: string;
  bookSlug: string;
  status: "provisional" | "confirmed";
  note: string;
  location?: string;
  approvedBy?: string;
}

export interface HomepageContent {
  id: string;
  title?: string;
  message?: string;
  contentHtml?: string;
  order?: number;
  editorialStatus?: string;
  /** Prefijo editorial que acompaña a los estantes. */
  shelfPrefix: string;
}

export interface CartItem {
  bookId: string;
  quantity: number;
  priceOption?: PriceOption;
}

export interface CartLineItem extends CartItem {
  book: Book;
  priceOption: PriceOption;
  unitPrice: number;
  lineTotal: number;
}

export interface DemoOrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface DemoOrderLine {
  bookSlug: string;
  title: string;
  quantity: number;
  unitPrice: number;
  priceOption?: PriceOption;
}

export interface DemoOrderNotifications {
  whatsapp: boolean;
  email: boolean;
}

export interface DemoOrder {
  id: string;
  createdAt: string;
  items: DemoOrderLine[];
  subtotal: number;
  customer: DemoOrderCustomer;
  paymentMethod: "demo" | "card" | "wallet" | "oxxo" | "transfer";
  notifications?: DemoOrderNotifications;
  referralSource?: string;
}
