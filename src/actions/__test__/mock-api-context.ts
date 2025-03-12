import type { ActionAPIContext } from "astro:actions";

export default function mockApiContext(userId: string) {
  return { locals: { user: { id: userId } } } as ActionAPIContext;
}
