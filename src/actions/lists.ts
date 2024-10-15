import { ActionError, defineAction } from "astro:actions";
import {
  and,
  asc,
  db,
  eq,
  isNull,
  List,
  ListShare,
  ne,
  or,
  Todo,
  User,
} from "astro:db";
import { z } from "zod";
import type { ListSelect } from "@/lib/types";
import { v4 as uuid } from "uuid";
import {
  isAuthorized,
  filterTodos,
  invalidateUsers,
  getListUsers,
} from "./helpers";

export const getLists = defineAction({
  handler: async (_, c) => {
    const userId = isAuthorized(c).id;

    const lists: ListSelect[] = await db
      .selectDistinct({
        id: List.id,
        name: List.name,
        author: {
          id: User.id,
          name: User.name,
          email: User.email,
          avatarUrl: User.avatarUrl,
        },
      })
      .from(List)
      .leftJoin(ListShare, eq(ListShare.listId, List.id))
      .innerJoin(User, eq(User.id, List.userId))
      .where(
        and(
          or(ne(ListShare.isPending, true), isNull(ListShare.isPending)),
          or(eq(List.userId, userId), eq(ListShare.sharedUserId, userId)),
        ),
      )
      .orderBy(asc(List.name))
      .then((lists) =>
        Promise.all(
          lists.map(async (list) => ({
            ...list,
            todoCount: await db
              .selectDistinct({ todoId: Todo.id })
              .from(Todo)
              .leftJoin(ListShare, eq(ListShare.listId, Todo.listId))
              .where(filterTodos(userId, list.id))
              .then((rows) => rows.length),
            shares: await db
              .selectDistinct({
                id: ListShare.id,
                user: {
                  id: User.id,
                  name: User.name,
                  email: User.email,
                  avatarUrl: User.avatarUrl,
                },
                isPending: ListShare.isPending,
              })
              .from(ListShare)
              .innerJoin(User, eq(User.id, ListShare.sharedUserId))
              .where(eq(ListShare.listId, list.id))
              .then((shares) =>
                shares.map((share) => ({
                  ...share,
                  list: { id: list.id, name: list.name, author: list.author },
                  isAuthor: share.user.id === userId,
                })),
              ),
            isAuthor: list.author.id === userId,
          })),
        ),
      )
      .then((rows) =>
        rows.map((row) => ({
          ...row,
          otherUsers: [...row.shares, { user: row.author }]
            .filter((share) => share.user.id !== userId)
            .map((share) => share.user),
        })),
      );

    return lists;
  },
});

export const updateList = defineAction({
  input: z.object({
    id: z.string(),
    data: z.object({ name: z.string() }).partial(),
  }),
  handler: async ({ id, data }, c) => {
    const userId = isAuthorized(c).id;
    const users = await getListUsers(id);

    if (!users.includes(userId)) {
      throw new ActionError({
        code: "FORBIDDEN",
        message: "You do not have permission to update this list",
      });
    }

    const result = await db
      .update(List)
      .set(data)
      .where(eq(List.id, id))
      .returning()
      .then((rows) => rows[0]);

    invalidateUsers(users);
    return result;
  },
});

export const createList = defineAction({
  input: z.object({ name: z.string() }),
  handler: async ({ name }, c) => {
    const userId = isAuthorized(c).id;
    const result = await db
      .insert(List)
      .values({ id: uuid(), name, userId })
      .returning()
      .then((rows) => rows[0]);

    const users = await getListUsers(result.id);

    invalidateUsers(users);
    return result;
  },
});

export const deleteList = defineAction({
  input: z.object({ id: z.string() }),
  handler: async ({ id }) => {
    const users = await getListUsers(id);

    await db.delete(Todo).where(eq(Todo.listId, id));
    await db.delete(ListShare).where(eq(ListShare.listId, id));
    await db.delete(List).where(eq(List.id, id));

    invalidateUsers(users);
    return true;
  },
});
