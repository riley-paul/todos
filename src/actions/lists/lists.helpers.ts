import type { ListSelect } from "@/lib/types";
import db from "@/db";
import { User, List, ListShare, Todo } from "@/db/schema";
import { eq, or, asc, count } from "drizzle-orm";
import { filterByListShare, filterTodos } from "../helpers";

export const getLists = async (userId: string): Promise<ListSelect[]> =>
  db
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
    .where(or(eq(List.userId, userId), filterByListShare(userId)))
    .orderBy(asc(List.name))
    .then((lists) =>
      Promise.all(
        lists.map(async (list) => ({
          ...list,
          todoCount: await db
            .select({ count: count() })
            .from(Todo)
            .leftJoin(ListShare, eq(ListShare.listId, Todo.listId))
            .where(filterTodos(userId, list.id))
            .then((rows) => rows[0].count),
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
