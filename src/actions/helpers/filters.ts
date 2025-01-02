import { or, eq, ListShare, Todo, and, isNull, ne } from "astro:db";

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

export const filterTodos = (userId: string, listId: string | null) => {
  const INBOX = and(isNull(Todo.listId), eq(Todo.userId, userId));

  if (listId === null) {
    return INBOX;
  }

  if (listId === "all") {
    return or(filterByListShare(userId), INBOX, eq(Todo.userId, userId));
  }

  return and(
    or(
      // List is shared with the user
      filterByListShare(userId),
      // User owns the list
      eq(Todo.userId, userId),
    ),
    eq(Todo.listId, listId),
  );
};
