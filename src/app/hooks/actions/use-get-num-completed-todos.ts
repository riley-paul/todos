import { and, count, eq } from "@tanstack/db";
import { useLiveSuspenseQuery } from "@tanstack/react-db";
import * as collections from "@/app/lib/collections";

export default function useGetNumCompletedTodos(listId: string): number {
  const { data } = useLiveSuspenseQuery(
    (q) =>
      q
        .from({ todo: collections.todos })
        .where(({ todo }) =>
          and(eq(todo.listId, listId), eq(todo.isCompleted, true)),
        )
        .select(({ todo }) => ({ count: count(todo.id) }))
        .findOne(),
    [listId],
  );

  return data?.count ?? 0;
}
