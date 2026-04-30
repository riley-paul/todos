import { ActionError, defineAction } from "astro:actions";
import { ensureAuthorized } from "../api/helpers";
import { createDb } from "@/db";
import { env } from "cloudflare:workers";
import { zTodoSelect, type ListSelect, type TodoSelect } from "@/lib/types2";
import * as tables from "@/db/schema";

const db = createDb(env);

export const populate = defineAction({
  handler: async (_, c): Promise<ListSelect[]> => {
    const userId = ensureAuthorized(c).id;

    return await db.query.List.findMany({
      with: { listUser: true },
      where: { listUser: { userId } },
    });
  },
});
