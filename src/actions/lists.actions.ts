import { ActionError, defineAction } from "astro:actions";
import { ensureAuthorized } from "@/api/helpers";
import { createDb } from "@/db";
import { env } from "cloudflare:workers";
import { zListSelect, type ListSelect } from "@/lib/types";
import * as tables from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { z } from "astro/zod";
import { LIST_SEPARATOR_ID } from "@/lib/constants";

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

export const create = defineAction({
  input: zListSelect,
  handler: async (input, c): Promise<ListSelect> => {
    const userId = ensureAuthorized(c).id;

    const [list] = await db.insert(tables.List).values(input).returning();

    await db.insert(tables.ListUser).values({
      listId: list.id,
      userId,
      isPending: false,
    });

    return list;
  },
});

export const update = defineAction({
  input: z.object({
    listId: z.string(),
    data: zListSelect.pick({ name: true }).partial(),
  }),
  handler: async (input, c): Promise<ListSelect> => {
    const userId = ensureAuthorized(c).id;

    const listUser = await db.query.ListUser.findFirst({
      where: { listId: input.listId, userId, isPending: false },
    });

    if (!listUser) {
      throw new ActionError({
        code: "FORBIDDEN",
        message: "You do not have access to this list",
      });
    }

    const [list] = await db
      .update(tables.List)
      .set(input.data)
      .where(eq(tables.List.id, input.listId))
      .returning();

    return list;
  },
});

export const remove = defineAction({
  input: z.object({ listId: z.string() }),
  handler: async (input, c): Promise<{ success: boolean }> => {
    const userId = ensureAuthorized(c).id;

    const listUser = await db.query.ListUser.findFirst({
      where: { listId: input.listId, userId, isPending: false },
    });

    if (!listUser) {
      throw new ActionError({
        code: "FORBIDDEN",
        message: "You do not have access to this list",
      });
    }

    await db.delete(tables.List).where(eq(tables.List.id, input.listId));

    return { success: true };
  },
});

export const updateSortShow = defineAction({
  input: z.object({ listIds: z.array(z.string()) }),
  handler: async ({ listIds }, c): Promise<boolean> => {
    const userId = ensureAuthorized(c).id;
    const db = createDb(env);

    const separatorIdx = listIds.indexOf(LIST_SEPARATOR_ID);

    if (listIds.length === 0) return false;

    // Build CASE WHEN expressions dynamically
    const orderCase = sql.join(
      listIds.map((listId, idx) => sql`WHEN ${listId} THEN ${idx}`),
      sql` `,
    );

    const showCase = sql.join(
      listIds.map(
        (listId, idx) =>
          sql`WHEN ${listId} THEN ${
            separatorIdx === -1 || idx < separatorIdx ? 1 : 0
          }`,
      ),
      sql` `,
    );

    await db.run(sql`
     UPDATE ${tables.ListUser}
     SET
       "order" = CASE "listId" ${orderCase} END,
       "show" = CASE "listId" ${showCase} END
     WHERE "userId" = ${userId}
       AND "listId" IN (${sql.join(listIds, sql`, `)});
   `);

    return true;
  },
});
