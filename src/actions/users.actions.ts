import { defineAction } from "astro:actions";
import * as userInputs from "@/api/schema/users";
import * as userFunctions from "@/api/functions/users";
import { ensureAuthorized } from "@/api/helpers";

export const getMe = defineAction({
  input: userInputs.getMe,
  handler: (input, c) => {
    const userId = ensureAuthorized(c).id;
    return userFunctions.getMe({ ...input, userId });
  },
});

export const remove = defineAction({
  input: userInputs.remove,
  handler: (input, c) => {
    const userId = ensureAuthorized(c).id;
    return userFunctions.remove({ ...input, userId });
  },
});

export const updateUserSettings = defineAction({
  input: userInputs.updateUserSettings,
  handler: (input, c) => {
    const userId = ensureAuthorized(c).id;
    return userFunctions.updateUserSettings({ ...input, userId });
  },
});
