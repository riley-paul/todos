import { defineAction } from "astro:actions";
import userInputs from "./users.inputs";
import userHandlers from "./users.handlers";

export const getMe = defineAction({
  input: userInputs.getMe,
  handler: userHandlers.getMe,
});

export const remove = defineAction({
  input: userInputs.remove,
  handler: userHandlers.remove,
});

export const get = defineAction({
  input: userInputs.get,
  handler: userHandlers.get,
});

export const updateUserSettings = defineAction({
  input: userInputs.updateUserSettings,
  handler: userHandlers.updateUserSettings,
});
