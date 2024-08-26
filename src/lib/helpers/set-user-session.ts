import type { APIContext } from "astro";
import { lucia } from "../../api/lib/lucia";

export default async function setUserSession(
  context: APIContext,
  userId: string,
) {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}
