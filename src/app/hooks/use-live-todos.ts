import {
  and,
  createCollection,
  eq,
  liveQueryCollectionOptions,
  useLiveSuspenseQuery,
} from "@tanstack/react-db";
import {
  listCollection,
  todoCollection,
  userCollection,
} from "@/app/lib/collections";

export const liveTodoCollection = createCollection(
  liveQueryCollectionOptions({
    query: (q) =>
      q
        .from({ todo: todoCollection })
        .innerJoin({ user: userCollection }, ({ user, todo }) =>
          eq(todo.userId, user.id),
        )
        .innerJoin({ list: listCollection }, ({ list, todo }) =>
          eq(todo.listId, list.id),
        )
        .select(({ todo, user, list }) => ({
          id: todo.id,
          text: todo.text,
          isCompleted: todo.isCompleted,
          createdAt: todo.createdAt,
          userId: todo.userId,
          listId: todo.listId,
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
        })),
  }),
);

export const useLiveTodos = (listId?: string) => {
  const { data: todos } = useLiveSuspenseQuery(
    (q) =>
      q
        .from({ todo: liveTodoCollection })
        .where(({ todo }) => eq(todo.listId, listId))
        .orderBy(({ todo }) => todo.createdAt, "desc"),
    [listId],
  );

  const { data: completedTodos } = useLiveSuspenseQuery(
    (q) =>
      q
        .from({ todo: liveTodoCollection })
        .where(({ todo }) =>
          and(eq(todo.isCompleted, true), eq(todo.listId, listId)),
        )
        .orderBy(({ todo }) => todo.createdAt, "desc"),
    [listId],
  );

  const { data: notCompletedTodos } = useLiveSuspenseQuery(
    (q) =>
      q
        .from({ todo: liveTodoCollection })
        .where(({ todo }) =>
          and(eq(todo.isCompleted, false), eq(todo.listId, listId)),
        )
        .orderBy(({ todo }) => todo.createdAt, "desc"),
    [listId],
  );

  return { todos, completedTodos, notCompletedTodos };
};
