export type DemoTourStepId =
  | "home-hero"
  | "home-shelves"
  | "shelves-grid"
  | "shelf-est-03"
  | "inseparables-card"
  | "product-info"
  | "product-question"
  | "product-guide"
  | "guide-content"
  | "product-whatsapp"
  | "product-add-cart"
  | "cart-summary"
  | "checkout-methods"
  | "order-confirmation"
  | "unboxing"
  | "tour-complete";

export type DemoTourAction = "advance" | "ensure-cart" | "complete-demo-order" | "finish";

export type DemoTourSide = "top" | "right" | "bottom" | "left";
export type DemoTourAlign = "start" | "center" | "end";

export interface DemoTourCallout {
  label: string;
  text: string;
  tone?: "demo" | "message" | "warning";
}

export interface DemoTourStep {
  id: DemoTourStepId;
  route: string;
  target?: string;
  title: string;
  description: string;
  side?: DemoTourSide;
  align?: DemoTourAlign;
  action: DemoTourAction;
  disableActiveInteraction?: boolean;
  callout?: DemoTourCallout;
}

export interface DemoTourNoticeState {
  kind: "access" | "error";
  title: string;
  description: string;
  canSkipGuide?: boolean;
  canRetry?: boolean;
}
