export function waitForElement(
  selector: string | undefined,
  { timeout, signal }: { timeout: number; signal?: AbortSignal },
): Promise<Element | null> {
  if (!selector || typeof document === "undefined") {
    return Promise.resolve(null);
  }

  if (signal?.aborted) {
    return Promise.resolve(null);
  }

  const existing = document.querySelector(selector);
  if (existing) {
    return Promise.resolve(existing);
  }

  return new Promise((resolve) => {
    let settled = false;

    function finish(element: Element | null) {
      if (settled) return;
      settled = true;
      observer.disconnect();
      window.clearTimeout(timer);
      signal?.removeEventListener("abort", handleAbort);
      resolve(element);
    }

    const handleAbort = () => finish(null);

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) finish(element);
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
    signal?.addEventListener("abort", handleAbort, { once: true });
    const timer = window.setTimeout(() => finish(null), timeout);

    // Cierra la ventana entre la primera consulta y el observer.
    const appeared = document.querySelector(selector);
    if (appeared) {
      finish(appeared);
    } else if (signal?.aborted) {
      finish(null);
    }
  });
}
