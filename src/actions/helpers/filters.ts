import { or, eq, List, ListShare, Todo, and, isNull, ne } from "astro:db";

export const filterLists = (userId: string) => {
  return and(
    or(
      eq(List.userId, userId),
      or(isNull(ListShare.id), ne(ListShare.isPending, true)),
    ),
    or(eq(List.userId, userId), eq(ListShare.sharedUserId, userId)),
  );
};

const filterByListId = (listId: string | undefined | null) => {
  if (typeof listId === "string" && listId !== "all") {
    return eq(Todo.listId, listId);
  }
  if (listId === null) {
    return isNull(Todo.listId);
  }
  return;
};

export const filterTodos = (
  userId: string,
  listId: string | undefined | null,
) => {
  return and(
    or(eq(Todo.userId, userId), eq(ListShare.sharedUserId, userId)),
    filterByListId(listId),
  );
};
