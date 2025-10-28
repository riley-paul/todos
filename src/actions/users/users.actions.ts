import { defineAction } from "astro:actions";
import * as userInputs from "./users.inputs";
import * as userHandlers from "./users.handlers";

export const getMe = defineAction({
  input: userInputs.getMe,
  handler: userHandlers.getMe,
});

export const remove = defineAction({
  input: userInputs.remove,
  handler: userHandlers.remove,
});

export const updateUserSettings = defineAction({
  input: userInputs.updateUserSettings,
  handler: userHandlers.updateUserSettings,
});
