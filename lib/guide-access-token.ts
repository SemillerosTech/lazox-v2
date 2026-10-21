import { createHash, timingSafeEqual } from "node:crypto";

export const GUIDE_ACCESS_COOKIE = "lazox_guide_access";
export const GUIDE_ACCESS_MAX_AGE = 60 * 60 * 8;

export function hashGuidePassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export function isValidGuideToken(token: string | undefined): boolean {
  const password = process.env.GUIDE_ACCESS_PASSWORD;
  if (!password || !token) return false;

  const expected = Buffer.from(hashGuidePassword(password));
  const received = Buffer.from(token);

  if (expected.length !== received.length) return false;
  return timingSafeEqual(expected, received);
}
