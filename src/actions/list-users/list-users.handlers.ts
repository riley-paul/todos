import { type ActionHandler } from "astro:actions";
import { createDb } from "@/db";
import { User, List, ListUser } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getListUser, getUserIsListMember, isAuthorized } from "../helpers";
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

  // only list members can add other users
  const isMember = await getUserIsListMember(c, {
    listId: data.listId,
    userId,
  });
  if (!isMember) throw actionErrors.NO_PERMISSION;

  // check if the user is already a member of the list
  const [existingListUser] = await db
    .select()
    .from(ListUser)
    .where(
      and(eq(ListUser.listId, data.listId), eq(ListUser.userId, data.userId)),
    );
  if (existingListUser) throw actionErrors.DUPLICATE;

  // insert the new list user
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

  // ensure current user is a member of the list or the one being removed
  const isMember = await getUserIsListMember(c, {
    listId: data.listId,
    userId,
    checkPending: false,
  });
  if (!isMember) throw actionErrors.NO_PERMISSION;

  await db
    .delete(ListUser)
    .where(
      and(eq(ListUser.listId, data.listId), eq(ListUser.userId, data.userId)),
    );
  return null;
};

const accept: ActionHandler<
  typeof listUserInputs.accept,
  ListUserSelect
> = async ({ id: listUserId }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  // ensure list user exists and is pending and pertains to current user
  const [listUser] = await db
    .select()
    .from(ListUser)
    .where(
      and(
        eq(ListUser.id, listUserId),
        eq(ListUser.userId, userId),
        eq(ListUser.isPending, true),
      ),
    );
  if (!listUser) throw actionErrors.NOT_FOUND;

  // update the list user to accept the invitation
  await db
    .update(ListUser)
    .set({ isPending: false })
    .where(eq(ListUser.id, listUserId));

  return getListUser(c, { listUserId });
};

const getAllForList: ActionHandler<
  typeof listUserInputs.getAllForList,
  ListUserSelect[]
> = async ({ listId }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const isMember = await getUserIsListMember(c, { listId, userId });
  if (!isMember) throw actionErrors.NO_PERMISSION;

  return db
    .select({
      id: ListUser.id,
      userId: ListUser.userId,
      listId: ListUser.listId,
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
  accept,
  getAllForList,
  getAllPending,
};
export default listShareHandlers;
