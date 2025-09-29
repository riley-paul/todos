import { type ActionAPIContext, type ActionHandler } from "astro:actions";
import type { ListSelect, SelectedList } from "@/lib/types";
import {
  ensureListMember,
  invalidateListUsers,
  ensureAuthorized,
  filterTodos,
} from "../helpers";
import { createDb } from "@/db";
import { List, ListUser, Todo, User } from "@/db/schema";
import { and, asc, count, desc, eq, not } from "drizzle-orm";
import actionErrors from "../errors";
import type listInputs from "./lists.inputs";

async function getList(
  c: ActionAPIContext,
  listId: undefined,
): Promise<ListSelect[]>;
async function getList(
  c: ActionAPIContext,
  listId: SelectedList,
): Promise<ListSelect>;
async function getList(c: ActionAPIContext, listId?: SelectedList) {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

  if (listId === null) {
    const [{ todoCount }] = await db
      .select({ todoCount: count() })
      .from(Todo)
      .where(
        and(
          filterTodos({ listId: null, userId, userLists: [] }),
          eq(Todo.isCompleted, false),
        ),
      );

    return {
      id: "inbox",
      name: "Inbox",
      isPending: false,
      isPinned: false,
      otherUsers: [],
      todoCount,
    };
  }

  if (listId === "all") {
    const userLists = await db
      .select({ listId: ListUser.listId })
      .from(ListUser)
      .where(and(eq(ListUser.userId, userId), eq(ListUser.isPending, false)))
      .then((data) => data.map(({ listId }) => listId));

    const [{ todoCount }] = await db
      .select({ todoCount: count() })
      .from(Todo)
      .where(
        and(
          filterTodos({ listId: "all", userId, userLists }),
          eq(Todo.isCompleted, false),
        ),
      );

    return {
      id: "all",
      name: "All",
      isPending: false,
      isPinned: false,
      otherUsers: [],
      todoCount,
    };
  }

  const lists = await db
    .selectDistinct({
      id: List.id,
      name: List.name,
      isPinned: List.isPinned,
      isPending: ListUser.isPending,
    })
    .from(List)
    .innerJoin(ListUser, eq(ListUser.listId, List.id))
    .orderBy(desc(List.isPinned), asc(List.name))
    .where(
      and(
        eq(ListUser.userId, userId),
        listId ? eq(List.id, listId) : undefined,
      ),
    )
    .then((lists) =>
      Promise.all(
        lists.map(async (list) => {
          const otherUsers = await db
            .selectDistinct({
              id: User.id,
              name: User.name,
              email: User.email,
              avatarUrl: User.avatarUrl,
            })
            .from(ListUser)
            .innerJoin(User, eq(User.id, ListUser.userId))
            .where(
              and(
                eq(ListUser.listId, list.id),
                eq(ListUser.isPending, false),
                not(eq(ListUser.userId, userId)),
              ),
            );

          const todoCount = await db
            .select({ count: count() })
            .from(Todo)
            .where(and(eq(Todo.listId, list.id), eq(Todo.isCompleted, false)))
            .then(([{ count }]) => count);

          return {
            ...list,
            todoCount,
            otherUsers,
          };
        }),
      ),
    );

  const [list] = lists;
  return listId ? list : lists;
}

const getAll: ActionHandler<typeof listInputs.getAll, ListSelect[]> = async (
  _,
  c,
) => {
  return getList(c, undefined);
};

const get: ActionHandler<typeof listInputs.get, ListSelect> = async (
  { id },
  c,
) => {
  return getList(c, id);
};

const update: ActionHandler<typeof listInputs.update, ListSelect> = async (
  { id: listId, data },
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

  await ensureListMember(c, { listId, userId });

  const [list] = await db
    .update(List)
    .set(data)
    .where(eq(List.id, listId))
    .returning({ id: List.id, name: List.name, isPinned: List.isPinned });

  if (!list) throw actionErrors.NOT_FOUND;
  await invalidateListUsers(c, listId);
  return getList(c, listId);
};

const create: ActionHandler<typeof listInputs.create, ListSelect> = async (
  { name },
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

  const [list] = await db
    .insert(List)
    .values({ name })
    .returning({ id: List.id });

  await db.insert(ListUser).values({
    listId: list.id,
    userId,
    isPending: false,
  });

  await invalidateListUsers(c, list.id);
  return getList(c, list.id);
};

const remove: ActionHandler<typeof listInputs.remove, null> = async (
  { id: listId },
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

  await ensureListMember(c, { listId, userId });

  const [result] = await db.delete(List).where(eq(List.id, listId)).returning();
  if (!result) throw actionErrors.NOT_FOUND;

  await invalidateListUsers(c, listId);
  return null;
};

const listHandlers = { getAll, get, update, create, remove };
export default listHandlers;
