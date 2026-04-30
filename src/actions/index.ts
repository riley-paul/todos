import * as todos from "@/api/actions/todos.actions";
import * as users from "@/api/actions/users.actions";
import * as lists from "@/api/actions/lists.actions";
import * as listUsers from "@/api/actions/list-users.actions";

import * as todos2 from "./todos.actions";
import * as lists2 from "./lists.actions";
import * as listUsers2 from "./list-users.actions";
import * as users2 from "./users.actions";

export const server = {
  todos,
  users,
  lists,
  listUsers,
  lists2,
  todos2,
  users2,
  listUsers2,
};
