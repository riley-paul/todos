import { type ActionHandler } from "astro:actions";
import { createDb } from "@/db";
import { User, List, ListUser } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getListUser, getUserIsListAdmin, isAuthorized } from "../helpers";
import actionErrors from "../errors";
import type listUserInputs from "./list-users.inputs";
import type { ListUserSelect } from "@/lib/types";

const create: ActionHandler<
  typeof listUserInputs.create,
  ListUserSelect
> = async (input, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const data = { userId, ...input };

  const isAdmin = await getUserIsListAdmin(c, {
    listId: data.listId,
    userId,
  });
  if (!isAdmin) throw actionErrors.NO_PERMISSION;

  const [existingListUser] = await db
    .select()
    .from(ListUser)
    .where(
      and(eq(ListUser.listId, data.listId), eq(ListUser.userId, data.userId)),
    );
  if (existingListUser) throw actionErrors.DUPLICATE;

  const [{ listUserId }] = await db
    .insert(ListUser)
    .values(data)
    .returning({ listUserId: ListUser.id });

  return getListUser(c, { listUserId });
};

const remove: ActionHandler<typeof listUserInputs.remove, null> = async (
  input,
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const data = { userId, ...input };

  const isAdmin = await getUserIsListAdmin(c, {
    listId: data.listId,
    userId,
  });

  if (!isAdmin && data.userId !== userId) throw actionErrors.NO_PERMISSION;

  const [result] = await db
    .delete(ListUser)
    .where(
      and(eq(ListUser.listId, data.listId), eq(ListUser.userId, data.userId)),
    )
    .returning();

  if (!result) throw actionErrors.NOT_FOUND;
  return null;
};

const update: ActionHandler<
  typeof listUserInputs.update,
  ListUserSelect
> = async (input, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const data = { userId, ...input };

  const isAdmin = await getUserIsListAdmin(c, {
    listId: data.listId,
    userId,
  });

  // only admins can make other users admins
  if (!isAdmin && data.isAdmin === true) throw actionErrors.NO_PERMISSION;

  // users can only update their own pending status
  if (data.userId !== userId && data.isPending === false)
    throw actionErrors.NO_PERMISSION;

  const [listUser] = await db
    .update(ListUser)
    .set({
      isAdmin: data.isAdmin,
      isPending: data.isPending,
    })
    .where(
      and(eq(ListUser.listId, data.listId), eq(ListUser.userId, data.userId)),
    )
    .returning();

  if (!listUser) throw actionErrors.NOT_FOUND;

  return getListUser(c, { listUserId: listUser.id });
};

const getAllForList: ActionHandler<
  typeof listUserInputs.getAllForList,
  ListUserSelect[]
> = async ({ listId }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  await getUserIsListAdmin(c, { listId, userId });

  return db
    .select({
      id: ListUser.id,
      userId: ListUser.userId,
      listId: ListUser.listId,
      isAdmin: ListUser.isAdmin,
      isPending: ListUser.isPending,
      list: {
        id: List.id,
        name: List.name,
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

const getAllPending: ActionHandler<
  typeof listUserInputs.getAllPending,
  ListUserSelect[]
> = async (_, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  return db
    .select({
      id: ListUser.id,
      userId: ListUser.userId,
      listId: ListUser.listId,
      isAdmin: ListUser.isAdmin,
      isPending: ListUser.isPending,
      list: {
        id: List.id,
        name: List.name,
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
    .where(and(eq(ListUser.userId, userId), eq(ListUser.isPending, true)));
};

const listShareHandlers = {
  create,
  remove,
  update,
  getAllForList,
  getAllPending,
};
export default listShareHandlers;
