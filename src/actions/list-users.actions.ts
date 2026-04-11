import { defineAction } from "astro:actions";
import * as listUserInputs from "@/api/schema/list-users.input";
import * as listUserFunctions from "@/api/functions/list-users";
import { ensureAuthorized } from "@/api/helpers";

export const create = defineAction({
  input: listUserInputs.create,
  handler: (input, c) => {
    const userId = ensureAuthorized(c).id;
    return listUserFunctions.create({ ...input, userId });
  },
});

export const remove = defineAction({
  input: listUserInputs.remove,
  handler: (input, c) => {
    const userId = ensureAuthorized(c).id;
    return listUserFunctions.remove({ ...input, userId });
  },
});

export const accept = defineAction({
  input: listUserInputs.accept,
  handler: (input, c) => {
    const userId = ensureAuthorized(c).id;
    return listUserFunctions.accept({ ...input, userId });
  },
});

export const getAllForList = defineAction({
  input: listUserInputs.getAllForList,
  handler: (input, c) => {
    const userId = ensureAuthorized(c).id;
    return listUserFunctions.getAllForList({ ...input, userId });
  },
});
