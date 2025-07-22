import type { ActionAPIContext } from "astro/actions/runtime/utils.js";
import InvalidationController from "@/lib/server/invalidation-controller";
import { Todo, ListUser, List, User } from "@/db/schema";
import { eq, and, or } from "drizzle-orm";
import actionErrors from "./errors";
import { createDb } from "@/db";
import type { ListUserSelect } from "@/lib/types";

export const invalidateUsers = (userIds: string[]) => {
  InvalidationController.getInstance().invalidateKey(userIds);
};

export const isAuthorized = (context: ActionAPIContext) => {
  const user = context.locals.user;
  if (!user) {
    throw actionErrors.UNAUTHORIZED;
  }
  return user;
};

export const getListUsers = async (
  context: ActionAPIContext,
  listId: string,
) => {
  const db = createDb(context.locals.runtime.env);
  return db
    .select({
      id: ListUser.userId,
      isAdmin: ListUser.isAdmin,
    })
    .from(ListUser)
    .where(and(eq(ListUser.listId, listId), eq(ListUser.isPending, false)));
};

export const getAllUserTodos = async (
  context: ActionAPIContext,
  userId: string,
) => {
  const db = createDb(context.locals.runtime.env);
  return db
    .select({ id: Todo.id })
    .from(Todo)
    .leftJoin(ListUser, eq(ListUser.listId, Todo.listId))
    .where(
      or(
        and(eq(ListUser.userId, userId), eq(ListUser.isPending, false)),
        eq(Todo.userId, userId),
      ),
    )
    .then((ids) => ids.map(({ id }) => id));
};

type GetUserIsListAdminArgs = {
  listId: string;
  userId: string;
};
export const getUserIsListAdmin = async (
  context: ActionAPIContext,
  { listId, userId }: GetUserIsListAdminArgs,
) => {
  const db = createDb(context.locals.runtime.env);
  const [listUser] = await db
    .select({ isAdmin: ListUser.isAdmin })
    .from(ListUser)
    .where(and(eq(ListUser.listId, listId), eq(ListUser.userId, userId)))
    .limit(1);

  if (!listUser) throw actionErrors.NOT_FOUND;
  return listUser.isAdmin;
};

type GetUserIsListMemberArgs = {
  listId: string | null;
  userId: string;
};
export const getUserIsListMember = async (
  context: ActionAPIContext,
  { listId, userId }: GetUserIsListMemberArgs,
) => {
  if (listId === null || listId === "all") return true;
  const db = createDb(context.locals.runtime.env);
  const [listUser] = await db
    .select({ id: ListUser.id })
    .from(ListUser)
    .where(and(eq(ListUser.listId, listId), eq(ListUser.userId, userId)))
    .limit(1);

  if (!listUser) throw actionErrors.NOT_FOUND;
  return !!listUser;
};

type GetListUserArgs = {
  listUserId: string;
};
export const getListUser = async (
  context: ActionAPIContext,
  { listUserId }: GetListUserArgs,
): Promise<ListUserSelect> => {
  const db = createDb(context.locals.runtime.env);
  const [listUser] = await db
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
    .where(eq(ListUser.id, listUserId));
  if (!listUser) throw actionErrors.NOT_FOUND;
  return listUser;
};
