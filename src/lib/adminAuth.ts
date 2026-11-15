import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "ahsan_admin_session";

function getSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    "ahsan-fitness-atlas-fallback-secret-change-me"
  );
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "ahsan2024";
}

function signToken(payload: string): string {
  return crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");
}

export function createAdminCookieValue(): string {
  const issuedAt = Date.now().toString();
  const sig = signToken(issuedAt);
  return `${issuedAt}.${sig}`;
}

export function verifyAdminCookieValue(value: string | undefined): boolean {
  if (!value) return false;
  const parts = value.split(".");
  if (parts.length !== 2) return false;
  const [issuedAt, sig] = parts;
  const expectedSig = signToken(issuedAt);

  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;

  // Session valid for 7 days
  const ageMs = Date.now() - Number(issuedAt);
  return !Number.isNaN(ageMs) && ageMs >= 0 && ageMs < 7 * 24 * 60 * 60 * 1000;
}

export async function isAuthenticatedAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return verifyAdminCookieValue(token);
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;

