import { isAuthorized } from "@/actions/helpers";
import type { APIRoute } from "astro";
import Ably from "ably";

export const GET: APIRoute = async (c) => {
  const { ABLY_API_KEY } = c.locals.runtime.env;
  if (!ABLY_API_KEY) {
    return new Response("Ably API key not found", { status: 500 });
  }

  const userId = isAuthorized(c).id;
  if (!userId) {
    return new Response("User not found", { status: 404 });
  }

  const ably = new Ably.Rest({ key: ABLY_API_KEY });

  try {
    const tokenDetails = await ably.auth.createTokenRequest({
      clientId: userId,
    });
    return new Response(JSON.stringify(tokenDetails));
  } catch (e) {
    const error = e as Error;
    return new Response(error.message, { status: 500 });
  }
};
