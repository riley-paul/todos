import { createDb } from "@/db";
import type { ListUserSelect } from "@/lib/types2";
import { defineAction } from "astro:actions";
import { env } from "cloudflare:workers";

const db = createDb(env);

export const populate = defineAction({
  handler: async (_, c): Promise<ListUserSelect[]> => {
    return db.query.ListUser.findMany();
  },
});
