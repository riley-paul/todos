import * as todos from "@/api/actions/todos.actions";
import * as users from "@/api/actions/users.actions";
import * as lists from "@/api/actions/lists.actions";
import * as listUsers from "@/api/actions/list-users.actions";

export const server = { todos, users, lists, listUsers };
