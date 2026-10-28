import type {
  DemoOrder,
  DemoOrderCustomer,
  DemoOrderLine,
  DemoOrderNotifications,
} from "@/lib/types";

const ORDER_STORAGE_KEY = "lazox:demo-order:v1";

let cachedOrder: DemoOrder | null | undefined;
let hasLoadedOrder = false;

export function createDemoOrderId(): string {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `DEMO-${suffix}`;
}

export function createDemoOrder({
  items,
  subtotal,
  customer,
  paymentMethod = "demo",
  notifications,
}: {
  items: DemoOrderLine[];
  subtotal: number;
  customer: DemoOrderCustomer;
  paymentMethod?: DemoOrder["paymentMethod"];
  notifications?: DemoOrderNotifications;
}): DemoOrder {
  return {
    id: createDemoOrderId(),
    createdAt: new Date().toISOString(),
    items: items.map((item) => ({ ...item })),
    subtotal,
    customer: { ...customer },
    paymentMethod,
    ...(notifications ? { notifications: { ...notifications } } : {}),
  };
}

export function saveDemoOrder(order: DemoOrder): void {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
    cachedOrder = order;
    hasLoadedOrder = true;
  } catch {
    // La confirmación mostrará su estado vacío si no se puede persistir.
  }
}

export function readDemoOrder(): DemoOrder | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(ORDER_STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;

    const order = parsed as Partial<DemoOrder>;
    if (typeof order.id !== "string" || !Array.isArray(order.items)) return null;
    return order as DemoOrder;
  } catch {
    return null;
  }
}

export function subscribeToDemoOrder(): () => void {
  return () => {};
}

export function getDemoOrderSnapshot(): DemoOrder | null | undefined {
  if (!hasLoadedOrder) {
    hasLoadedOrder = true;
    cachedOrder = readDemoOrder();
  }

  return cachedOrder;
}

/** `undefined` representa la carga inicial; `null`, una sesión sin pedido. */
export function getDemoOrderServerSnapshot(): undefined {
  return undefined;
}
