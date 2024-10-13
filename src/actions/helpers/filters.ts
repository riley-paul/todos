import { or, eq, List, ListShare, Todo, and, isNull } from "astro:db";

/**
 * Filter lists for a given user
 * A user should be able to access lists they have created or that have been shared
 * with them
 *
 * @param userId - The user id
 */
export const filterLists = (userId: string) => {
  return or(eq(List.userId, userId), eq(ListShare.sharedUserId, userId));
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
    eq(Todo.isDeleted, false),
    or(eq(Todo.userId, userId), eq(ListShare.sharedUserId, userId)),
    filterByListId(listId),
  );
};
