import * as todos from "./todos";
import * as users from "./users";
import * as hashtags from "./hashtags";

export const server = { ...todos, ...users, ...hashtags };
