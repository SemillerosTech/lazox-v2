"use client";

import dynamic from "next/dynamic";

const DemoTourProvider = dynamic(
  () => import("./demo-tour-provider").then((module) => module.DemoTourProvider),
  { ssr: false, loading: () => null },
);

export function DemoTourMount({ enabled }: { enabled: boolean }) {
  return enabled ? <DemoTourProvider /> : null;
}
