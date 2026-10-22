import type { DemoOrderCustomer } from "@/lib/types";

export const DEMO_TOUR_SESSION_KEY = "lazox:demo-tour:v1";
export const DEMO_TOUR_POPOVER_CLASS = "lazox-demo-tour";
export const DEMO_TOUR_BOOK_ID = "inseparables";
export const DEMO_TOUR_ELEMENT_TIMEOUT = 6000;
export const DEMO_TOUR_NAVIGATION_TIMEOUT = 10000;

/**
 * Cliente ficticio que solo existe en la orden de demostración.
 * Usa el dominio reservado .invalid para que nunca sea un correo real.
 */
export const DEMO_TOUR_CUSTOMER: DemoOrderCustomer = {
  name: "Familia LAZOX (demostración)",
  email: "demo@lazox.invalid",
  phone: "",
  address: "Calle de la demostración 1",
  city: "Ciudad de México",
  state: "Ciudad de México",
  postalCode: "01000",
};
