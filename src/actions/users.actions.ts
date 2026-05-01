import { ensureAuthorized } from "@/api/helpers";
import { createDb } from "@/db";
import { zUserSettings, type UserSelect, type UserSettings } from "@/lib/types";
import { ActionError, defineAction } from "astro:actions";
import * as tables from "@/db/schema";
import { and, count, eq, inArray, ne } from "drizzle-orm";

export const populate = defineAction({
  handler: async (_, c): Promise<UserSelect[]> => {
    const db = createDb(c.locals.env);
    const userId = ensureAuthorized(c).id;

    const userListIds = await db.query.ListUser.findMany({
      where: { userId },
      columns: { listId: true },
    }).then((uls) => uls.map((ul) => ul.listId));

    const otherUsers = await db
      .selectDistinct({
        id: tables.User.id,
        email: tables.User.email,
        name: tables.User.name,
        avatarUrl: tables.User.avatarUrl,
      })
      .from(tables.User)
      .innerJoin(tables.ListUser, eq(tables.User.id, tables.ListUser.userId))
      .where(
        and(
          inArray(tables.ListUser.listId, userListIds),
          ne(tables.User.id, userId),
        ),
      );

    const currentUser = await db.query.User.findFirst({
      where: { id: userId },
      columns: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        settingGroupCompleted: true,
      },
    });

    if (!currentUser)
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "User not found",
      });

    return [currentUser, ...otherUsers];
  },
});

export const update = defineAction({
  input: zUserSettings,
  handler: async (input, c): Promise<UserSettings> => {
    const db = createDb(c.locals.env);
    const userId = ensureAuthorized(c).id;

    const [settings] = await db
      .update(tables.User)
      .set(input)
      .where(eq(tables.User.id, userId))
      .returning({
        settingGroupCompleted: tables.User.settingGroupCompleted,
      });

    return settings;
  },
});

export const remove = defineAction({
  handler: async (_, c) => {
    const db = createDb(c.locals.env);
    const userId = ensureAuthorized(c).id;

    const userListIds = await db.query.ListUser.findMany({
      where: { userId },
      columns: { listId: true },
    }).then((uls) => uls.map((ul) => ul.listId));

    const listMemberCounts = await db
      .select({
        listId: tables.ListUser.listId,
        memberCount: count(tables.ListUser.userId),
      })
      .from(tables.ListUser)
      .where(inArray(tables.ListUser.listId, userListIds))
      .groupBy(tables.ListUser.listId);

    const listsWithSingleMember = listMemberCounts
      .filter((l) => l.memberCount <= 1)
      .map((l) => l.listId);

    await db
      .delete(tables.List)
      .where(inArray(tables.List.id, listsWithSingleMember));

    await db.delete(tables.User).where(eq(tables.User.id, userId));
    return true;
  },
});
