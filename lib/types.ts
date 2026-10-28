export type Currency = "MXN";

export type PriceOption = "normal" | "economic";

export type BookAvailability = "available" | "out_of_stock";

export interface BookPrice {
  /** Precio en centavos para evitar errores de punto flotante. */
  amount: number;
  currency: Currency;
}

export interface Book {
  id: string;
  slug: string;
  title: string;
  author: string;
  illustrator?: string;
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
  shelfCode: string;
  synopsis: string;
  forWhom: string;
  conversationQuestion: string;
  conversationRule: string;
  coverImage?: string;
  status: "published" | "provisional";
  guideSlug?: string;
}

export interface Shelf {
  code: string;
  slug: string;
  name: string;
  order: number;
  line?: string;
  bookSlugs: string[];
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
  conversationQuestion: string;
  conversationRule: string;
  sections: GuideSection[];
  license: {
    attribution: string;
    status: "pending" | "confirmed";
  };
}

export interface EditorialRecommendation {
  shelfCode: string;
  bookSlug: string;
  status: "provisional" | "confirmed";
  note: string;
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
