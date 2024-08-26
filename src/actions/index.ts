import * as todos from "./todos";
import * as users from "./users";

export const server = { ...todos, ...users };
