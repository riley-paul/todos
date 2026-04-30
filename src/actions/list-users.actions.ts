import { ensureAuthorized } from "@/api/helpers";
import { createDb } from "@/db";
import type { ListUserSelect } from "@/lib/types2";
import { defineAction } from "astro:actions";
import { env } from "cloudflare:workers";

const db = createDb(env);

export const populate = defineAction({
  handler: async (_, c): Promise<ListUserSelect[]> => {
    const userId = ensureAuthorized(c).id;

    return db.query.ListUser.findMany();
  },
});
