import * as todos from "./todos";
import * as users from "./users";
import * as hashtags from "./hashtags";
import * as lists from "./lists";

export const server = { ...todos, ...users, ...hashtags, ...lists };
