"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Driver } from "driver.js";

import { useCart } from "@/lib/cart/cart-context";
import { addToCart, getCartSnapshot, setCartQuantity } from "@/lib/cart/cart-store";
import { createDemoOrder, saveDemoOrder } from "@/lib/cart/demo-order";
import type { DemoOrderLine } from "@/lib/types";

import { DemoTourButton } from "./demo-tour-button";
import { DemoTourNotice } from "./demo-tour-notice";
import {
  DEMO_TOUR_BOOK_ID,
  DEMO_TOUR_CUSTOMER,
  DEMO_TOUR_ELEMENT_TIMEOUT,
  DEMO_TOUR_NAVIGATION_TIMEOUT,
  DEMO_TOUR_SESSION_KEY,
} from "./demo-tour.config";
import type { DemoTourDriverFactory } from "./demo-tour-driver";
import { waitForElement } from "./demo-tour.navigation";
import { DEMO_TOUR_STEPS } from "./demo-tour.steps";
import type { DemoTourNoticeState, DemoTourStep } from "./demo-tour.types";

type StepHandler = (index: number) => void;

function needsDemoCart(step: DemoTourStep | undefined): boolean {
  if (!step) return false;
  return (
    step.action === "ensure-cart" || step.route === "/carrito" || step.route === "/compra/demo"
  );
}

function persistStep(index: number): void {
  if (typeof window === "undefined") return;

  const step = DEMO_TOUR_STEPS[index];
  if (!step) return;

  try {
    window.sessionStorage.setItem(DEMO_TOUR_SESSION_KEY, JSON.stringify({ stepId: step.id }));
  } catch {
    // El recorrido funciona aunque sessionStorage no esté disponible.
  }
}

function clearPersistedStep(): void {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(DEMO_TOUR_SESSION_KEY);
  } catch {
    // Sin sessionStorage no hay nada que limpiar.
  }
}

/**
 * Controlador del recorrido. Vive dentro de CartProvider y no envuelve la
 * aplicación: solo monta el botón y, cuando corresponde, el popover de Driver.
 */
export function DemoTourProvider() {
  const router = useRouter();
  const pathname = usePathname();
  const { items, subtotal, clear } = useCart();

  const [isRunning, setIsRunning] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [startNonce, setStartNonce] = useState(0);
  const [notice, setNotice] = useState<DemoTourNoticeState | null>(null);

  const pathnameRef = useRef(pathname);
  const isRunningRef = useRef(false);
  const isStartingRef = useRef(false);
  const activeIndexRef = useRef(0);
  const driverRef = useRef<Driver | null>(null);
  const driverFactoryRef = useRef<DemoTourDriverFactory | null>(null);
  const effectTokenRef = useRef(0);
  const expectedRouteRef = useRef<string | null>(null);
  const navTimerRef = useRef<number | null>(null);

  const nextHandlerRef = useRef<StepHandler>(() => {});
  const previousHandlerRef = useRef<StepHandler>(() => {});
  const closeHandlerRef = useRef<() => void>(() => {});
  const doneHandlerRef = useRef<() => void>(() => {});
  const homeHandlerRef = useRef<() => void>(() => {});
  const stepChangeHandlerRef = useRef<StepHandler>(() => {});
  const destroyedHandlerRef = useRef<(reason: string) => void>(() => {});

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  const clearNavigationTimeout = useCallback(() => {
    if (navTimerRef.current === null) return;
    window.clearTimeout(navTimerRef.current);
    navTimerRef.current = null;
  }, []);

  const destroyDriver = useCallback(() => {
    const current = driverRef.current;
    driverRef.current = null;
    if (!current) return;

    try {
      current.destroy();
    } catch {
      // Si Driver ya se destruyó, no hay nada más que hacer.
    }
  }, []);

  const resetTourState = useCallback(() => {
    isRunningRef.current = false;
    setIsRunning(false);
    setNotice(null);
    setActiveIndex(0);
    activeIndexRef.current = 0;
    expectedRouteRef.current = null;
    clearPersistedStep();
    clearNavigationTimeout();
  }, [clearNavigationTimeout]);

  const stopTour = useCallback(() => {
    isStartingRef.current = false;
    setIsStarting(false);
    resetTourState();
    destroyDriver();
  }, [destroyDriver, resetTourState]);

  const pauseWithNotice = useCallback(
    (nextNotice: DemoTourNoticeState) => {
      isRunningRef.current = false;
      setIsRunning(false);
      setNotice(nextNotice);
      destroyDriver();
    },
    [destroyDriver],
  );

  const beginNavigation = useCallback(
    (route: string) => {
      expectedRouteRef.current = route;
      clearNavigationTimeout();

      navTimerRef.current = window.setTimeout(() => {
        navTimerRef.current = null;
        if (!isRunningRef.current || expectedRouteRef.current !== route) return;

        expectedRouteRef.current = null;
        pauseWithNotice({
          kind: "error",
          title: "No pudimos continuar el recorrido",
          description:
            "La página tardó más de lo esperado. Puede reintentar el paso o salir del recorrido.",
          canRetry: true,
        });
      }, DEMO_TOUR_NAVIGATION_TIMEOUT);
    },
    [clearNavigationTimeout, pauseWithNotice],
  );

  const ensureDemoCart = useCallback(() => {
    const snapshot = getCartSnapshot();
    const line = snapshot.items.find((item) => item.bookId === DEMO_TOUR_BOOK_ID);

    if (!line) {
      addToCart(DEMO_TOUR_BOOK_ID, 1);
      return;
    }

    if (line.quantity !== 1) {
      setCartQuantity(DEMO_TOUR_BOOK_ID, 1);
    }
  }, []);

  const goToStep = useCallback(
    (index: number) => {
      if (!isRunningRef.current) return;

      const step = DEMO_TOUR_STEPS[index];
      if (!step) {
        stopTour();
        return;
      }

      activeIndexRef.current = index;
      setActiveIndex(index);
      persistStep(index);
      setNotice(null);

      if (needsDemoCart(step)) {
        ensureDemoCart();
      }

      if (pathnameRef.current === step.route) {
        expectedRouteRef.current = null;
        clearNavigationTimeout();

        if (driverRef.current) {
          driverRef.current.moveTo(index);
        } else {
          setStartNonce((value) => value + 1);
        }
        return;
      }

      destroyDriver();
      beginNavigation(step.route);
      router.push(step.route);
    },
    [beginNavigation, clearNavigationTimeout, destroyDriver, ensureDemoCart, router, stopTour],
  );

  const startTour = useCallback(async () => {
    if (isStartingRef.current || isRunningRef.current) return;

    isStartingRef.current = true;
    setIsStarting(true);
    resetTourState();

    try {
      const driverModule = await import("./demo-tour-driver");
      driverFactoryRef.current = driverModule.createDemoTourDriver;

      activeIndexRef.current = 0;
      setActiveIndex(0);
      persistStep(0);
      isRunningRef.current = true;
      setIsRunning(true);

      if (pathnameRef.current === "/") {
        setStartNonce((value) => value + 1);
        return;
      }

      beginNavigation("/");
      router.push("/");
    } catch {
      isRunningRef.current = false;
      setIsRunning(false);
      setNotice({
        kind: "error",
        title: "No pudimos cargar el recorrido",
        description:
          "Revise su conexión e intente de nuevo. El resto del sitio puede seguir usándose normalmente.",
        canRetry: true,
      });
    } finally {
      isStartingRef.current = false;
      setIsStarting(false);
    }
  }, [beginNavigation, resetTourState, router]);

  const handleNext = useCallback(
    (index: number) => {
      if (!isRunningRef.current) return;

      const current = DEMO_TOUR_STEPS[index];
      if (!current) return;

      if (current.action === "finish" || index === DEMO_TOUR_STEPS.length - 1) {
        stopTour();
        return;
      }

      if (current.action === "ensure-cart") {
        ensureDemoCart();
      }

      if (current.action === "complete-demo-order") {
        const orderLines: DemoOrderLine[] = items.map((item) => ({
          bookSlug: item.book.slug,
          title: item.book.title,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          priceOption: item.priceOption,
        }));

        if (orderLines.length === 0) {
          pauseWithNotice({
            kind: "error",
            title: "No encontramos el libro en el carrito",
            description:
              "Para continuar con la demostración, vuelva a agregar Inseparables al carrito.",
            canRetry: true,
          });
          return;
        }

        const order = createDemoOrder({
          items: orderLines,
          subtotal,
          customer: DEMO_TOUR_CUSTOMER,
        });

        saveDemoOrder(order);
        clear();
        goToStep(index + 1);
        return;
      }

      const nextIndex = index + 1;
      const next = DEMO_TOUR_STEPS[nextIndex];
      if (needsDemoCart(next)) {
        ensureDemoCart();
      }

      if (next && next.route === pathnameRef.current && driverRef.current) {
        driverRef.current.moveNext();
        return;
      }

      goToStep(nextIndex);
    },
    [clear, ensureDemoCart, goToStep, items, pauseWithNotice, stopTour, subtotal],
  );

  const handlePrevious = useCallback(
    (index: number) => {
      if (!isRunningRef.current || index <= 0) return;

      const previousIndex = index - 1;
      const previous = DEMO_TOUR_STEPS[previousIndex];
      if (needsDemoCart(previous)) {
        ensureDemoCart();
      }

      if (previous && previous.route === pathnameRef.current && driverRef.current) {
        driverRef.current.movePrevious();
        return;
      }

      goToStep(previousIndex);
    },
    [ensureDemoCart, goToStep],
  );

  const handleStepChange = useCallback((index: number) => {
    const step = DEMO_TOUR_STEPS[index];
    if (!step) return;

    activeIndexRef.current = index;
    setActiveIndex(index);
    persistStep(index);
  }, []);

  const handleDestroyed = useCallback(
    (reason: string) => {
      if (!isRunningRef.current) return;
      if (reason !== "close" && reason !== "escape" && reason !== "overlay" && reason !== "done") {
        return;
      }

      driverRef.current = null;
      resetTourState();
    },
    [resetTourState],
  );

  const handleHome = useCallback(() => {
    stopTour();
    router.push("/");
  }, [router, stopTour]);

  const retryTour = useCallback(() => {
    setNotice(null);

    if (!driverFactoryRef.current) {
      void startTour();
      return;
    }

    const step = DEMO_TOUR_STEPS[activeIndexRef.current];
    if (!step) {
      void startTour();
      return;
    }

    isRunningRef.current = true;
    setIsRunning(true);

    if (pathnameRef.current === step.route) {
      expectedRouteRef.current = null;
      clearNavigationTimeout();
      setStartNonce((value) => value + 1);
      return;
    }

    beginNavigation(step.route);
    router.push(step.route);
  }, [beginNavigation, clearNavigationTimeout, router, startTour]);

  useEffect(() => {
    nextHandlerRef.current = handleNext;
    previousHandlerRef.current = handlePrevious;
    closeHandlerRef.current = stopTour;
    doneHandlerRef.current = stopTour;
    homeHandlerRef.current = handleHome;
    stepChangeHandlerRef.current = handleStepChange;
    destroyedHandlerRef.current = handleDestroyed;
  });

  useEffect(() => {
    if (!isRunning || !driverFactoryRef.current) return;

    const step = DEMO_TOUR_STEPS[activeIndexRef.current];
    if (!step) {
      stopTour();
      return;
    }

    if (pathname !== step.route) {
      if (expectedRouteRef.current === step.route) return;

      pauseWithNotice({
        kind: "error",
        title: "El recorrido se interrumpió",
        description:
          "La página cambió antes de completar este paso. Puede reintentarlo o salir del recorrido.",
        canRetry: true,
      });
      return;
    }

    expectedRouteRef.current = null;
    clearNavigationTimeout();
    setNotice(null);

    let cancelled = false;
    const token = effectTokenRef.current + 1;
    effectTokenRef.current = token;
    const controller = new AbortController();

    void waitForElement(step.target, {
      timeout: DEMO_TOUR_ELEMENT_TIMEOUT,
      signal: controller.signal,
    }).then((element) => {
      if (cancelled || token !== effectTokenRef.current) return;

      if (step.target && !element) {
        pauseWithNotice({
          kind: "error",
          title: "No encontramos esta sección",
          description:
            "La página todavía no muestra el elemento de este paso. Puede reintentarlo o salir del recorrido.",
          canRetry: true,
        });
        return;
      }

      const factory = driverFactoryRef.current;
      if (!factory) return;

      driverRef.current = factory({
        startIndex: activeIndexRef.current,
        callbacks: {
          onNext: (index) => nextHandlerRef.current(index),
          onPrevious: (index) => previousHandlerRef.current(index),
          onClose: () => closeHandlerRef.current(),
          onDone: () => doneHandlerRef.current(),
          onHome: () => homeHandlerRef.current(),
          onStepChange: (index) => stepChangeHandlerRef.current(index),
          onDestroyed: (reason) => destroyedHandlerRef.current(reason),
        },
      });
    });

    return () => {
      cancelled = true;
      controller.abort();
      destroyDriver();
    };
  }, [
    clearNavigationTimeout,
    destroyDriver,
    isRunning,
    pathname,
    pauseWithNotice,
    startNonce,
    stopTour,
  ]);

  if (!isRunning && !notice) {
    return <DemoTourButton onClick={() => void startTour()} loading={isStarting} />;
  }

  if (!notice) return null;

  return (
    <DemoTourNotice
      notice={notice}
      stepNumber={activeIndex + 1}
      totalSteps={DEMO_TOUR_STEPS.length}
      onExit={stopTour}
      onRetry={retryTour}
    />
  );
}
