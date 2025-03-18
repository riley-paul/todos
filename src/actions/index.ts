import * as todos from "./todos/todos.actions";
import * as users from "./users/users.actions";
import * as lists from "./lists/lists.actions";
import * as listShares from "./list-shares/list-shares.actions";
import * as ably from "./ably/ably.actions";

export const server = {
  todos,
  users,
  lists,
  listShares,
  ably,
};
