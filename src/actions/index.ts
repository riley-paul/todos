import * as todos from "./todos";
import * as users from "@/features/auth/actions";
import * as lists from "@/features/lists/actions";
import * as listShares from "./list-shares";

export const server = {
  ...todos,
  ...users,
  ...lists,
  ...listShares,
};
