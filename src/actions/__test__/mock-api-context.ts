import type { ActionAPIContext } from "astro:actions";
import env from "@/envs-runtime";

export default function mockApiContext(userId: string) {
  return {
    locals: { user: { id: userId }, runtime: { env } },
  } as ActionAPIContext;
}
