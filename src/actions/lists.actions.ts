import {
  ActionError,
  defineAction,
  type ActionAPIContext,
} from "astro:actions";
import { ensureAuthorized } from "@/api/helpers";
import { createDb } from "@/db";
import { zListSelect, type ListSelectDetails } from "@/lib/types";
import * as tables from "@/db/schema";
import { and, asc, desc, eq, like, or, sql } from "drizzle-orm";
import { z } from "astro/zod";
import { LIST_SEPARATOR_ID } from "@/lib/constants";
import { getListOtherUsers, getListTodoCount } from "@/api/dataloaders";

const getLists = async (
  c: ActionAPIContext,
  filters: Partial<{
    listId: string;
    search: string;
  }> = {},
): Promise<ListSelectDetails[]> => {
  const db = createDb(c.locals.env);
  const userId = ensureAuthorized(c).id;

  const { listId, search } = filters;

  const searchTerm = `%${search}%`;
  const searchQuery = or(like(tables.List.name, searchTerm));

  const lists = await db
    .selectDistinct({
      id: tables.List.id,
      name: tables.List.name,
      isPending: tables.ListUser.isPending,
      show: tables.ListUser.show,
      order: tables.ListUser.order,
    })
    .from(tables.List)
    .innerJoin(tables.ListUser, eq(tables.ListUser.listId, tables.List.id))
    .orderBy(
      desc(tables.ListUser.show),
      asc(tables.ListUser.order),
      asc(tables.List.createdAt),
    )
    .where(
      and(
        eq(tables.ListUser.userId, userId),
        listId ? eq(tables.List.id, listId) : undefined,
        search ? searchQuery : undefined,
      ),
    );

  const listIds = lists.map((l) => l.id);
  const todoCounts = await getListTodoCount(c, listIds);
  const otherUsersByList = await getListOtherUsers(c, listIds);

  return lists.map((list) => ({
    ...list,
    otherUsers: otherUsersByList[list.id] || [],
    todoCount: todoCounts[list.id] || 0,
  }));
};

export const getAll = defineAction({
  input: z.object({ search: z.string().optional() }),
  handler: async ({ search }, c): Promise<ListSelectDetails[]> => {
    return getLists(c, { search });
  },
});

export const get = defineAction({
  input: z.object({ listId: z.string() }),
  handler: async ({ listId }, c): Promise<ListSelectDetails> => {
    const [list] = await getLists(c, { listId });
    if (!list) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "List not found or you do not have access to it",
      });
    }
    return list;
  },
});

export const create = defineAction({
  input: z.object({ name: z.string() }),
  handler: async (input, c): Promise<ListSelectDetails> => {
    const db = createDb(c.locals.env);
    const userId = ensureAuthorized(c).id;

    const created = await db.transaction(async (tx) => {
      const [list] = await tx.insert(tables.List).values(input).returning();
      await tx
        .insert(tables.ListUser)
        .values({
          listId: list.id,
          userId,
          isPending: false,
        })
        .returning();
      return list;
    });

    const [result] = await getLists(c, { listId: created.id });
    return result;
  },
});

export const update = defineAction({
  input: z.object({
    listId: z.string(),
    data: zListSelect.pick({ name: true }).partial(),
  }),
  handler: async (input, c): Promise<ListSelectDetails> => {
    const db = createDb(c.locals.env);
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

    const [updated] = await db
      .update(tables.List)
      .set(input.data)
      .where(eq(tables.List.id, input.listId))
      .returning();

    const [result] = await getLists(c, { listId: updated.id });
    return result;
  },
});

export const remove = defineAction({
  input: z.object({ listId: z.string() }),
  handler: async (input, c): Promise<string> => {
    const db = createDb(c.locals.env);
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

    const [deleted] = await db
      .delete(tables.List)
      .where(eq(tables.List.id, input.listId))
      .returning();

    return deleted.id;
  },
});

export const updateSortShow = defineAction({
  input: z.object({ listIds: z.array(z.string()) }),
  handler: async ({ listIds }, c): Promise<ListSelectDetails[]> => {
    const db = createDb(c.locals.env);
    const userId = ensureAuthorized(c).id;

    const separatorIdx = listIds.indexOf(LIST_SEPARATOR_ID);

    if (listIds.length === 0) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "List IDs are required",
      });
    }

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

    return getLists(c, {});
  },
});
