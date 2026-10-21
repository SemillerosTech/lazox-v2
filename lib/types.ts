export type Currency = "MXN";

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
  price: BookPrice;
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
}

export interface CartLineItem extends CartItem {
  book: Book;
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
}

export interface DemoOrder {
  id: string;
  createdAt: string;
  items: DemoOrderLine[];
  subtotal: number;
  customer: DemoOrderCustomer;
  paymentMethod: "demo";
}
