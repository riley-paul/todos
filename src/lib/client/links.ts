import { linkOptions } from "@tanstack/react-router";

export const goToList = (
  listId: string | null | undefined,
  highlightTodo?: string,
) =>
  linkOptions({
    to: listId ? "/todos/$listId" : "/",
    params: { listId },
    search: highlightTodo ? { highlightedTodoId: highlightTodo } : undefined,
  });
