import type { ActionAPIContext } from "astro/actions/runtime/utils.js";
import { Todo, ListUser, List, User } from "@/db/schema";
import { eq, and, or } from "drizzle-orm";
import actionErrors from "./errors";
import { createDb } from "@/db";
import type { ListUserSelect } from "@/lib/types";
import { Realtime } from "ably";

export const isAuthorized = (context: ActionAPIContext) => {
  const user = context.locals.user;
  if (!user) {
    throw actionErrors.UNAUTHORIZED;
  }
  return user;
};

export const invalidateListUsers = (
  context: ActionAPIContext,
  listId: string,
) => {
  const ably = new Realtime({ key: context.locals.runtime.env.ABLY_API_KEY });
  const currentUserId = isAuthorized(context).id;
  const channel = ably.channels.get(`list:${listId}`);
  return channel.publish("invalidate", { actionTakenBy: currentUserId });
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

type GetUserIsListMemberArgs = {
  listId: string | null;
  userId: string;
  checkPending?: boolean;
};
export const getUserIsListMember = async (
  context: ActionAPIContext,
  { listId, userId, checkPending = true }: GetUserIsListMemberArgs,
) => {
  if (listId === null || listId === "all") return true;
  const db = createDb(context.locals.runtime.env);
  const [listUser] = await db
    .select({ id: ListUser.id })
    .from(ListUser)
    .where(
      and(
        eq(ListUser.listId, listId),
        eq(ListUser.userId, userId),
        checkPending ? eq(ListUser.isPending, false) : undefined,
      ),
    )
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
