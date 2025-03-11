import { generateCodeVerifier, generateState } from "arctic";
import { google } from "@/lib/auth";

import type { APIContext } from "astro";

export async function GET(context: APIContext): Promise<Response> {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url: URL = await google.createAuthorizationURL(state, codeVerifier, [
    "email",
    "profile",
  ]);

  context.cookies.set("google_oauth_state", state, {
    path: "/",
    secure: Boolean(import.meta.env.PROD),
    httpOnly: true,
    maxAge: 60 * 10, // 10 min
    sameSite: "lax",
  });

  context.cookies.set("google_oauth_code_verifier", codeVerifier, {
    path: "/",
    secure: Boolean(import.meta.env.PROD),
    httpOnly: true,
    maxAge: 60 * 10, // 10 min
    sameSite: "lax",
  });

  return context.redirect(url.toString());
}
