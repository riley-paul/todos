import { ActionError, defineAction } from "astro:actions";
import * as listInputs from "@/api/inputs/lists.input";
import * as listFunctions from "@/api/functions/lists";
import { ensureAuthorized } from "@/api/helpers";
import { z } from "astro/zod";
import { createDb } from "@/db";
import { env } from "cloudflare:workers";

import * as tables from "@/db/schema";
import { eq } from "drizzle-orm";
import type { ListSelectShallow } from "@/lib/types";

export const getAll = defineAction({
  input: z.any(),
  handler: (input, c) => {
    const userId = ensureAuthorized(c).id;
    return listFunctions.getAll({ ...input, userId });
  },
});

export const search = defineAction({
  input: listInputs.search,
  handler: (input, c) => {
    const userId = ensureAuthorized(c).id;
    return listFunctions.search({ ...input, userId });
  },
});

export const get = defineAction({
  input: listInputs.get,
  handler: (input, c) => {
    const userId = ensureAuthorized(c).id;
    return listFunctions.get({ ...input, userId });
  },
});

export const update = defineAction({
  input: listInputs.update,
  handler: (input, c) => {
    const userId = ensureAuthorized(c).id;
    return listFunctions.update({ ...input, userId });
  },
});

export const create = defineAction({
  input: listInputs.create,
  handler: (input, c) => {
    const userId = ensureAuthorized(c).id;
    return listFunctions.create({ ...input, userId });
  },
});

export const remove = defineAction({
  input: listInputs.remove,
  handler: (input, c) => {
    const userId = ensureAuthorized(c).id;
    return listFunctions.remove({ ...input, userId });
  },
});

export const updateSortShow = defineAction({
  input: listInputs.updateSortShow,
  handler: (input, c) => {
    const userId = ensureAuthorized(c).id;
    return listFunctions.updateSortShow({ ...input, userId });
  },
});

export const leave = defineAction({
  input: z.object({ listId: z.string() }),
  handler: async ({ listId }, c) => {
    const db = createDb(env);
    const userId = ensureAuthorized(c).id;

    const listUser = await db.query.ListUser.findFirst({
      where: { listId, userId },
    });

    if (!listUser) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "You are not a member of this list",
      });
    }

    const numListUsers = await db.$count(
      tables.ListUser,
      eq(tables.ListUser.listId, listId),
    );

    await db.transaction(async (tx) => {
      await tx
        .delete(tables.ListUser)
        .where(eq(tables.ListUser.id, listUser.id));

      if (numListUsers <= 1)
        await tx.delete(tables.List).where(eq(tables.List.id, listId));
    });

    return true;
  },
});

export const acceptInvite = defineAction({
  input: z.object({ listId: z.string() }),
  handler: async ({ listId }, c): Promise<ListSelectShallow> => {
    const db = createDb(env);
    const userId = ensureAuthorized(c).id;

    const listUser = await db.query.ListUser.findFirst({
      where: { listId, userId },
    });

    if (!listUser) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "You are not a member of this list",
      });
    }

    if (!listUser.isPending) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "You are already a member of this list",
      });
    }

    await db
      .update(tables.ListUser)
      .set({ isPending: false })
      .where(eq(tables.ListUser.id, listUser.id));

    const list = await db.query.List.findFirst({
      where: { id: { eq: listId } },
      columns: {
        id: true,
        name: true,
      },
    });

    if (!list) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "List not found",
      });
    }

    return { ...list, isPending: false };
  },
});
