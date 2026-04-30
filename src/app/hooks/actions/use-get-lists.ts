import { count, eq, useLiveSuspenseQuery } from "@tanstack/react-db";
import * as collections from "@/app/lib/collections";
import type { ListSelectDetails } from "@/lib/types2";
import { useUser } from "@/app/providers/user-provider";
import { useMemo } from "react";

export default function useGetLists(): ListSelectDetails[] {
  const user = useUser();

  const { data: todoCounts } = useLiveSuspenseQuery((q) =>
    q
      .from({ todo: collections.todos })
      .where(({ todo }) => eq(todo.isCompleted, false))
      .select(({ todo }) => ({
        listId: todo.listId,
        count: count(todo.id),
      }))
      .groupBy(({ todo }) => todo.listId),
  );

  const todoCountMap: Record<string, number> = useMemo(() => {
    const map: Record<string, number> = {};
    todoCounts.forEach(({ listId, count }) => {
      map[listId] = count;
    });
    return map;
  }, [todoCounts]);

  const { data: lists } = useLiveSuspenseQuery((q) =>
    q
      .from({ list: collections.lists })
      .innerJoin({ listUser: collections.listUsers }, ({ list, listUser }) =>
        eq(list.id, listUser.listId),
      )
      .distinct()
      .where(({ listUser }) => eq(listUser.userId, user.id))
      .orderBy(({ listUser }) => listUser.show, "desc")
      .orderBy(({ listUser }) => listUser.order, "asc")
      .orderBy(({ list }) => list.createdAt, "asc")
      .select(({ list, listUser }) => ({
        id: list.id,
        name: list.name,
        show: listUser.show,
        order: listUser.order,
        isPending: listUser.isPending,
        createdAt: list.createdAt,
        updatedAt: list.updatedAt,
      })),
  );

  const processed = lists.map((list) => ({
    ...list,
    todoCount: todoCountMap[list.id] ?? 0,
  }));

  return processed;
}
