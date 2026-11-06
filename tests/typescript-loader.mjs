// Solo para Node --test: usa el TypeScript ya instalado y el alias de tsconfig.
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = new URL("../", import.meta.url);

export async function resolve(specifier, context, nextResolve) {
  if (specifier === "next/headers") return nextResolve("next/headers.js", context);
  const url = specifier.startsWith("@/")
    ? new URL(specifier.slice(2), root)
    : specifier.startsWith(".") && context.parentURL
      ? new URL(specifier, context.parentURL)
      : null;

  if (url?.protocol === "file:" && existsSync(fileURLToPath(url) + ".ts")) {
    return nextResolve(url.href + ".ts", context);
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (!url.endsWith(".ts")) return nextLoad(url, context);
  const source = await readFile(new URL(url), "utf8");
  return {
    format: "module",
    shortCircuit: true,
    source: ts.transpileModule(source, {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    }).outputText,
  };
}
