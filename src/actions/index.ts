import * as todos from "./todos";
import * as users from "./users/users.actions";
import * as lists from "./lists/lists.actions";
import * as listShares from "./list-shares";

export const server = {
  todos,
  users,
  lists,
  listShares,
};
