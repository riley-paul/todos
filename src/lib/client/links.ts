import { linkOptions, type LinkOptions } from "@tanstack/react-router";
import type { SelectedList } from "../types";

export const goToList = (
  listId: SelectedList | undefined,
  highlightTodo?: string,
): LinkOptions => {
  if (listId) {
    return linkOptions({
      to: "/todos/$listId",
      params: { listId },
      search: highlightTodo ? { highlightedTodoId: highlightTodo } : undefined,
    });
  }

  return linkOptions({
    to: "/",
    search: highlightTodo ? { highlightedTodoId: highlightTodo } : undefined,
  });
};
