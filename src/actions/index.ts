import * as todos from "./todos";
import * as users from "./users";
import * as sharedTags from "./shared-tags";

export const server = { ...todos, ...users, ...sharedTags };
