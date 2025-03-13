import { eq } from "drizzle-orm";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { User, UserSession } from "@/db/schema";
import type { UserSelect, UserSessionInfo } from "../types";
import type { APIContext } from "astro";
import { createDb } from "@/db";

export const SESSION_COOKIE_NAME = "session";

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(
  context: APIContext,
  token: string,
  userId: string,
): Promise<UserSessionInfo> {
  const db = createDb(context.locals.runtime.env);
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: UserSessionInfo = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };
  await db.insert(UserSession).values(session);
  return session;
}

export async function validateSessionToken(
  context: APIContext,
  token: string,
): Promise<SessionValidationResult> {
  const db = createDb(context.locals.runtime.env);
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const [result] = await db
    .select({ user: User, session: UserSession })
    .from(UserSession)
    .innerJoin(User, eq(UserSession.userId, User.id))
    .where(eq(UserSession.id, sessionId));

  if (!result) return { session: null, user: null };

  const { user, session } = result;

  // Session is expired
  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(UserSession).where(eq(UserSession.id, session.id));
    return { session: null, user: null };
  }

  // Refresh session if it's within 15 days of expiring
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await db
      .update(UserSession)
      .set({ expiresAt: session.expiresAt })
      .where(eq(UserSession.id, session.id));
  }

  return { session, user };
}

export async function invalidateSession(
  context: APIContext,
  sessionId: string,
): Promise<void> {
  const db = createDb(context.locals.runtime.env);
  await db.delete(UserSession).where(eq(UserSession.id, sessionId));
}

export async function invalidateAllSessions(
  context: APIContext,
  userId: string,
): Promise<void> {
  const db = createDb(context.locals.runtime.env);
  await db.delete(UserSession).where(eq(UserSession.userId, userId));
}

export function setSessionTokenCookie(
  context: APIContext,
  token: string,
  expiresAt: Date,
): void {
  const secure = context.locals.runtime.env.NODE_ENV === "production";
  context.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    path: "/",
    secure,
    sameSite: "lax",
    expires: expiresAt,
  });
}

export function deleteSessionTokenCookie(context: APIContext): void {
  const secure = context.locals.runtime.env.NODE_ENV === "production";
  context.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    secure,
    sameSite: "lax",
    maxAge: 0,
  });
}

export type SessionValidationResult =
  | { session: UserSessionInfo; user: UserSelect }
  | { session: null; user: null };
