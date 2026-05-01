import type { ListSelectDetails } from "@/lib/types";
import { count, eq, useLiveSuspenseQuery } from "@tanstack/react-db";
import * as collections from "@/app/lib/collections";
import { useUser } from "@/app/providers/user-provider";

export default function useGetList(
  listId: string,
): ListSelectDetails | undefined {
  const user = useUser();

  const { data: todoCount } = useLiveSuspenseQuery(
    (q) =>
      q
        .from({ todo: collections.todos })
        .where(({ todo }) => eq(todo.isCompleted, false))
        .where(({ todo }) => eq(todo.listId, listId))
        .select(({ todo }) => ({ count: count(todo.id) }))
        .findOne(),
    [listId],
  );

  const { data: list } = useLiveSuspenseQuery(
    (q) =>
      q
        .from({ list: collections.lists })
        .innerJoin({ listUser: collections.listUsers }, ({ listUser, list }) =>
          eq(listUser.listId, list.id),
        )
        .where(({ listUser }) => eq(listUser.userId, user.id))
        .select(({ list, listUser }) => ({
          id: list.id,
          name: list.name,
          show: listUser.show,
          order: listUser.order,
          isPending: listUser.isPending,
          createdAt: list.createdAt,
          updatedAt: list.updatedAt,
        }))
        .where(({ list }) => eq(list.id, listId))
        .findOne(),
    [listId],
  );

  if (!list) return undefined;
  return { ...list, todoCount: todoCount?.count ?? 0 };
}
