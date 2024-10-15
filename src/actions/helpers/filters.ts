import { or, eq, ListShare, Todo, and, isNull, ne } from "astro:db";

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
    or(
      eq(Todo.userId, userId),
      and(
        eq(ListShare.sharedUserId, userId),
        or(ne(ListShare.isPending, true), isNull(ListShare.isPending)),
      ),
    ),
    filterByListId(listId),
  );
};
