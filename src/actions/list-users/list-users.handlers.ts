import { type ActionAPIContext, type ActionHandler } from "astro:actions";
import { createDb } from "@/db";
import { User, List, ListUser } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import {
  ensureListMember,
  invalidateListUsers,
  ensureAuthorized,
} from "../helpers";
import actionErrors from "../errors";
import * as listUserInputs from "./list-users.inputs";
import type { ListUserSelect } from "@/lib/types";

export const getListUser = async (
  context: ActionAPIContext,
  { listUserId }: { listUserId: string },
): Promise<ListUserSelect> => {
  const db = createDb(context.locals.runtime.env);
  const [listUser] = await db
    .select({
      id: ListUser.id,
      userId: ListUser.userId,
      listId: ListUser.listId,
      isPending: ListUser.isPending,
      list: {
        id: List.id,
        name: List.name,
        isPending: ListUser.isPending,
      },
      user: {
        id: User.id,
        name: User.name,
        email: User.email,
        avatarUrl: User.avatarUrl,
      },
    })
    .from(ListUser)
    .innerJoin(List, eq(List.id, ListUser.listId))
    .innerJoin(User, eq(User.id, ListUser.userId))
    .where(eq(ListUser.id, listUserId));
  if (!listUser) throw actionErrors.NOT_FOUND;
  return listUser;
};

export const create: ActionHandler<
  typeof listUserInputs.create,
  ListUserSelect
> = async ({ email, listId }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

  // only list members can add other users
  await ensureListMember(c, { listId, userId });

  // check if user with email exists
  const [user] = await db.select().from(User).where(eq(User.email, email));
  if (!user) throw actionErrors.USER_NOT_FOUND;

  // check if the user is already a member of the list
  const [existingListUser] = await db
    .select()
    .from(ListUser)
    .where(and(eq(ListUser.listId, listId), eq(ListUser.userId, user.id)));
  if (existingListUser) throw actionErrors.DUPLICATE;

  // insert the new list user
  const [{ listUserId }] = await db
    .insert(ListUser)
    .values({ listId, userId: user.id })
    .returning({ listUserId: ListUser.id });

  await invalidateListUsers(c, listId);
  return getListUser(c, { listUserId });
};

export const remove: ActionHandler<typeof listUserInputs.remove, null> = async (
  input,
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

  const data = { userId, ...input };

  // ensure current user is a member of the list or the one being removed
  await ensureListMember(c, {
    listId: data.listId,
    userId,
    checkPending: false,
  });

  await db
    .delete(ListUser)
    .where(
      and(eq(ListUser.listId, data.listId), eq(ListUser.userId, data.userId)),
    );

  await invalidateListUsers(c, data.listId);
  return null;
};

export const accept: ActionHandler<
  typeof listUserInputs.accept,
  ListUserSelect
> = async ({ listId }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

  // ensure list user exists and is pending and pertains to current user
  const [listUser] = await db
    .select()
    .from(ListUser)
    .where(
      and(
        eq(ListUser.listId, listId),
        eq(ListUser.userId, userId),
        eq(ListUser.isPending, true),
      ),
    );
  if (!listUser) throw actionErrors.NOT_FOUND;

  // update the list user to accept the invitation
  const [updated] = await db
    .update(ListUser)
    .set({ isPending: false })
    .where(
      and(
        eq(ListUser.listId, listId),
        eq(ListUser.userId, userId),
        eq(ListUser.isPending, true),
      ),
    )
    .returning();

  await invalidateListUsers(c, updated.listId);
  return getListUser(c, { listUserId: updated.id });
};

export const getAllForList: ActionHandler<
  typeof listUserInputs.getAllForList,
  ListUserSelect[]
> = async ({ listId }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

  await ensureListMember(c, { listId, userId });

  return db
    .select({
      id: ListUser.id,
      userId: ListUser.userId,
      listId: ListUser.listId,
      isPending: ListUser.isPending,
      list: {
        id: List.id,
        name: List.name,
        isPending: ListUser.isPending,
      },
      user: {
        id: User.id,
        name: User.name,
        email: User.email,
        avatarUrl: User.avatarUrl,
      },
    })
    .from(ListUser)
    .innerJoin(List, eq(List.id, ListUser.listId))
    .innerJoin(User, eq(User.id, ListUser.userId))
    .where(eq(ListUser.listId, listId));
};
