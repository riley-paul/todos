import * as todos from "./todos/todos.actions";
import * as users from "./users/users.actions";
import * as lists from "./lists/lists.actions";
import * as listUsers from "./list-users/list-users.actions";

export const server = {
  todos,
  users,
  lists,
  listUsers,
};
