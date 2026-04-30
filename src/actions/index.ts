import * as todos from "@/api/actions/todos.actions";
import * as users from "@/api/actions/users.actions";
import * as lists from "@/api/actions/lists.actions";
import * as listUsers from "@/api/actions/list-users.actions";

import * as todos2 from "./todos2.actions";
import * as lists2 from "./lists2.actions";

export const server = { todos, users, lists, listUsers, lists2, todos2 };
