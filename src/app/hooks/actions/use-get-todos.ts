import { eq, useLiveSuspenseQuery } from "@tanstack/react-db";
import * as collections from "@/app/lib/collections";
import type { TodoSelectDetails } from "@/lib/types";

export default function useGetTodos(listId: string): TodoSelectDetails[] {
  const { data: todos } = useLiveSuspenseQuery(
    (q) => {
      return q
        .from({ todo: collections.todos })
        .innerJoin({ user: collections.users }, ({ todo, user }) =>
          eq(todo.userId, user.id),
        )
        .innerJoin({ list: collections.lists }, ({ todo, list }) =>
          eq(todo.listId, list.id),
        )
        .where(({ todo }) => eq(todo.listId, listId))
        .distinct()
        .orderBy(({ todo }) => todo.isCompleted, "asc")
        .orderBy(({ todo }) => todo.createdAt, "desc")
        .select(({ todo, user, list }) => ({
          id: todo.id,
          text: todo.text,
          isCompleted: todo.isCompleted,
          listId: todo.listId,
          userId: todo.userId,
          createdAt: todo.createdAt,
          updatedAt: todo.updatedAt,
          author: {
            id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
          },
          list: {
            id: list.id,
            name: list.name,
          },
        }));
    },
    [listId],
  );

  return todos;
}
