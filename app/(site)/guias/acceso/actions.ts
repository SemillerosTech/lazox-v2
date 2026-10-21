"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  GUIDE_ACCESS_COOKIE,
  GUIDE_ACCESS_MAX_AGE,
  hashGuidePassword,
  safeGuideRedirect,
} from "@/lib/guide-access";

export async function unlockGuide(
  _previousState: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  const configuredPassword = process.env.GUIDE_ACCESS_PASSWORD;

  if (!configuredPassword) {
    return {
      error: "El acceso privado todavía no está configurado. Falta GUIDE_ACCESS_PASSWORD.",
    };
  }

  const submitted = String(formData.get("password") ?? "");
  if (submitted !== configuredPassword) {
    return { error: "La contraseña no es correcta. Intente de nuevo." };
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: GUIDE_ACCESS_COOKIE,
    value: hashGuidePassword(configuredPassword),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/guias",
    maxAge: GUIDE_ACCESS_MAX_AGE,
  });

  redirect(safeGuideRedirect(String(formData.get("next") ?? "")));
}
