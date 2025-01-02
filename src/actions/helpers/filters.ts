import { or, eq, ListShare, Todo, and, isNull, ne } from "astro:db";

const filterByListId = (listId: string | undefined | null, userId: string) => {
  if (typeof listId === "string" && listId !== "all") {
    return eq(Todo.listId, listId);
  }
  if (listId === null) {
    return and(isNull(Todo.listId), eq(Todo.userId, userId));
  }
  return;
};

export const filterByListShare = (userId: string) =>
  or(
    // User is the author of the list
    eq(ListShare.userId, userId),

    // User is shared on the list
    // and the share is not pending
    and(
      eq(ListShare.sharedUserId, userId),
      or(ne(ListShare.isPending, true), isNull(ListShare.isPending)),
    ),
  );

export const filterTodos = (
  userId: string,
  listId: string | undefined | null,
) => {
  if (listId === null) {
    return and(isNull(Todo.listId), eq(Todo.userId, userId));
  }

  if (listId === "all") {
    return or(
      filterByListShare(userId),
      and(isNull(Todo.listId), eq(Todo.userId, userId)),
    );
  }

  return and(filterByListShare(userId), filterByListId(listId, userId));
};
