"use client";

import { WhatsAppInquiry } from "@/components/whatsapp-inquiry";

export function WhatsAppDock() {
  return (
    <div className="fixed bottom-4 right-4 z-40 lg:hidden">
      <WhatsAppInquiry
        label="WhatsApp"
        showSampleReply={false}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-green px-5 py-3 text-sm font-extrabold text-primary-foreground shadow-xl transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        panelClassName="absolute bottom-full right-0 mb-3 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-border bg-background p-4 text-left shadow-2xl"
      />
    </div>
  );
}
