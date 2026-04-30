import { createDb } from "@/db";
import type { UserSelect } from "@/lib/types2";
import { defineAction } from "astro:actions";
import { env } from "cloudflare:workers";

const db = createDb(env);

export const populate = defineAction({
  handler: async (c): Promise<UserSelect[]> => {
    return db.query.User.findMany({
      columns: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
      },
    });
  },
});
