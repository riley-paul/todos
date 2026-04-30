import { count, eq, useLiveSuspenseQuery } from "@tanstack/react-db";
import * as collections from "@/app/lib/collections";
import type { ListSelectDetails } from "@/lib/types2";
import { useUser } from "@/app/providers/user-provider";

export default function useGetLists(): ListSelectDetails[] {
  const user = useUser();
  const { data: lists } = useLiveSuspenseQuery((q) => {
    const todoCount = q
      .from({ todo: collections.todos })
      .where(({ todo }) => eq(todo.isCompleted, false))
      .select(({ todo }) => ({
        listId: todo.listId,
        count: count(todo.id),
      }))
      .groupBy(({ todo }) => todo.listId);

    return q
      .from({ list: collections.lists })
      .innerJoin({ listUser: collections.listUsers }, ({ list, listUser }) =>
        eq(list.id, listUser.listId),
      )
      .join({ todoCount }, ({ list, todoCount }) =>
        eq(list.id, todoCount.listId),
      )
      .where(({ listUser }) => eq(listUser.userId, user.id))
      .select(({ list, listUser, todoCount }) => ({
        id: list.id,
        name: list.name,
        show: listUser.show,
        order: listUser.order,
        isPending: listUser.isPending,
        todoCount: todoCount.count,
        createdAt: list.createdAt,
        updatedAt: list.updatedAt,
      }))
      .orderBy(({ listUser }) => listUser.show, "desc")
      .orderBy(({ listUser }) => listUser.order, "asc")
      .orderBy(({ list }) => list.createdAt, "asc");
  });

  const processed = lists.map((list) => ({
    ...list,
    todoCount: list.todoCount ?? 0,
  }));

  return processed;
}
