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
  if (typeof listId === "string") {
    return eq(Todo.listId, listId);
  }
  if (listId === null) {
    return isNull(Todo.listId);
  }
  return;
};

/**
 * Filters todos for a given user and list
 * A user should be access todos they have created, or that belong to a list that
 * has been shared with them
 *
 * @param userId - The user id
 * @param listId - The list id
 * - If the listId is undefined, the filter will return all todos for the user
 * - If the listId is null, the filter will return all todos that do not belong to a list
 * - If the listId is a string, the filter will return all todos that belong to the list
 */
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
