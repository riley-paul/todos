import type { APIRoute } from "astro";
import Ably, { type TokenParams } from "ably";

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const ably = new Ably.Rest(locals.runtime.env.ABLY_API_KEY);
  const tokenParams: TokenParams = { clientId: locals.user.id };
  const tokenRequest = await ably.auth.createTokenRequest(tokenParams);

  return new Response(JSON.stringify(tokenRequest), {
    headers: { "Content-Type": "application/json" },
  });
};
