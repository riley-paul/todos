import type { ActionAPIContext } from "astro:actions";

export default function createApiContext(userId: string) {
  return { locals: { user: { id: userId } } } as ActionAPIContext;
}
