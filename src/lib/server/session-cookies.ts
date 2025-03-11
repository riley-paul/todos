import type { APIContext } from "astro";
import { SESSION_COOKIE_NAME } from "./lucia";
import type { Context } from "hono";
import type { AppBindings } from "@/server/lib/types";
import { setCookie } from "hono/cookie";
import env from "@/envs";

export function setSessionTokenCookie(
  context: APIContext,
  token: string,
  expiresAt: Date,
): void {
  context.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    path: "/",
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
  });
}

export function deleteSessionTokenCookie(context: APIContext): void {
  context.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });
}

export function setHonoSessionTokenCookie(
  context: Context<AppBindings>,
  token: string,
  expiresAt: Date,
): void {
  setCookie(context, SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    path: "/",
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
  });
}

export function deleteHonoSessionTokenCookie(
  context: Context<AppBindings>,
): void {
  setCookie(context, SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });
}
