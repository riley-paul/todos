import { ensureAuthorized } from "@/api/helpers";
import { createDb } from "@/db";
import type { UserSelect } from "@/lib/types2";
import { defineAction } from "astro:actions";
import { env } from "cloudflare:workers";

const db = createDb(env);

export const populate = defineAction({
  handler: async (c): Promise<UserSelect[]> => {
    const userId = ensureAuthorized(c).id;

    return db.query.User.findMany();
  },
});
