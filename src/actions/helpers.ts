import type { ActionAPIContext } from "astro/actions/runtime/utils.js";
import { Todo, ListUser, List, User } from "@/db/schema";
import { eq, and, or, not } from "drizzle-orm";
import actionErrors from "./errors";
import { createDb } from "@/db";
import type { ListUserSelect } from "@/lib/types";

export const isAuthorized = (context: ActionAPIContext) => {
  const user = context.locals.user;
  if (!user) {
    throw actionErrors.UNAUTHORIZED;
  }
  return user;
};

const invalidateUserChannel = async (
  context: ActionAPIContext,
  userId: string,
) => {
  const channelName = `user:${userId}`;
  const eventName = "invalidate";

  const authHeader = "Basic " + btoa(context.locals.runtime.env.ABLY_API_KEY);
  const url = new URL(`https://rest.ably.io/channels/${channelName}/messages`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([{ name: eventName }]),
  });

  if (response.ok) {
    console.log("Publishing invalidate for userId:", userId);
    return Promise.resolve();
  }
  const errorText = await response.text();
  console.error("Failed to publish invalidate message:", errorText);
  return Promise.reject(
    new Error(`Failed to publish invalidate message: ${errorText}`),
  );
};

export const invalidateListUsers = async (
  context: ActionAPIContext,
  listId: string,
) => {
  console.log("Invalidating list users for listId:", listId);
  const db = createDb(context.locals.runtime.env);
  const userId = isAuthorized(context).id;

  const listUserIds = await db
    .select({ id: ListUser.userId })
    .from(ListUser)
    .where(and(eq(ListUser.listId, listId), not(eq(ListUser.userId, userId))))
    .then((rows) => rows.map(({ id }) => id));

  console.log("List user IDs to invalidate:", listUserIds);

  return Promise.all(
    listUserIds.map((id) => {
      return invalidateUserChannel(context, id);
    }),
  );
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
