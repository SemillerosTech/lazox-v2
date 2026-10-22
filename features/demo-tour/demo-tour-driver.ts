import { driver } from "driver.js";
import type { Config, DestroyReason, Driver, DriveStep, PopoverDOM } from "driver.js";

import "driver.js/dist/driver.css";
import "./demo-tour.css";

import { DEMO_TOUR_POPOVER_CLASS } from "./demo-tour.config";
import { DEMO_TOUR_STEPS } from "./demo-tour.steps";
import type { DemoTourStep } from "./demo-tour.types";

export interface DemoTourDriverCallbacks {
  onNext: (index: number) => void;
  onPrevious: (index: number) => void;
  onClose: () => void;
  onDone: () => void;
  onHome: () => void;
  onStepChange: (index: number) => void;
  onDestroyed: (reason: DestroyReason) => void;
}

export interface CreateDemoTourDriverOptions {
  startIndex: number;
  callbacks: DemoTourDriverCallbacks;
}

export type DemoTourDriverFactory = (options: CreateDemoTourDriverOptions) => Driver;

function toDriveStep(step: DemoTourStep): DriveStep {
  return {
    ...(step.target ? { element: step.target } : {}),
    disableActiveInteraction: step.disableActiveInteraction,
    data: { demoStepId: step.id },
    popover: {
      title: step.title,
      description: step.description,
      side: step.side,
      align: step.align,
      showButtons: ["previous", "next"],
    },
  };
}

function addCallout(popover: PopoverDOM, step: DemoTourStep) {
  popover.description
    .querySelectorAll(".lazox-demo-tour__callout")
    .forEach((element) => element.remove());

  if (!step.callout) return;

  const callout = document.createElement("div");
  callout.className = `lazox-demo-tour__callout lazox-demo-tour__callout--${step.callout.tone ?? "demo"}`;

  const label = document.createElement("p");
  label.className = "lazox-demo-tour__callout-label";
  label.textContent = step.callout.label;

  const text = document.createElement("p");
  text.className = "lazox-demo-tour__callout-text";
  text.textContent = step.callout.text;

  callout.append(label, text);
  popover.description.append(callout);
}

function addFooterActions(popover: PopoverDOM, index: number, callbacks: DemoTourDriverCallbacks) {
  popover.footer
    .querySelectorAll(".lazox-demo-tour__exit, .lazox-demo-tour__home")
    .forEach((element) => element.remove());

  const exitButton = document.createElement("button");
  exitButton.type = "button";
  exitButton.className = "lazox-demo-tour__exit";
  exitButton.textContent = "Salir";
  exitButton.addEventListener("click", () => callbacks.onClose());
  popover.footer.prepend(exitButton);

  if (index !== DEMO_TOUR_STEPS.length - 1) return;

  const homeButton = document.createElement("button");
  homeButton.type = "button";
  homeButton.className = "lazox-demo-tour__home";
  homeButton.textContent = "Volver al inicio";
  homeButton.addEventListener("click", () => callbacks.onHome());
  popover.footer.append(homeButton);
}

export function createDemoTourDriver({
  startIndex,
  callbacks,
}: CreateDemoTourDriverOptions): Driver {
  const config: Config = {
    steps: DEMO_TOUR_STEPS.map(toDriveStep),
    animate: true,
    duration: 280,
    overlayColor: "#1f1f1f",
    overlayOpacity: 0.64,
    smoothScroll: true,
    allowScroll: true,
    allowClose: true,
    overlayClickBehavior: "none",
    // Bloquea clics y toques en la página y en el área resaltada. Solo el popover
    // (Anterior, Siguiente, Salir) mantiene interacción.
    disableActiveInteraction: true,
    allowKeyboardControl: true,
    stagePadding: 8,
    stageRadius: 18,
    popoverClass: DEMO_TOUR_POPOVER_CLASS,
    popoverOffset: 12,
    showButtons: ["previous", "next"],
    showProgress: true,
    progressText: "{{current}} de {{total}}",
    nextBtnText: "Siguiente",
    prevBtnText: "Anterior",
    doneBtnText: "Finalizar recorrido",
    closeBtnLabel: "Salir",
    waitForElement: 5000,
    skipMissingElement: false,
    onPopoverRender: (popover, options) => {
      const index = options.index ?? 0;
      const step = DEMO_TOUR_STEPS[index];
      if (!step) return;

      addCallout(popover, step);
      addFooterActions(popover, index, callbacks);
    },
    onHighlighted: (_element, _step, options) => {
      if (typeof options.index === "number") {
        callbacks.onStepChange(options.index);
      }
    },
    onNextClick: (_element, _step, options) => {
      callbacks.onNext(options.index ?? 0);
    },
    onPrevClick: (_element, _step, options) => {
      callbacks.onPrevious(options.index ?? 0);
    },
    onCloseClick: () => callbacks.onClose(),
    onDoneClick: () => callbacks.onDone(),
    onDestroyed: (_element, _step, options) => {
      if (options.reason) callbacks.onDestroyed(options.reason);
    },
  };

  const instance = driver(config);
  instance.drive(startIndex);
  return instance;
}
