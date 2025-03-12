import * as inputs from "./users.inputs";
import * as handlers from "./users.handlers";
import { defineAction } from "astro:actions";

export const getMe = defineAction({
  input: inputs.getMe,
  handler: handlers.getMe,
});

export const remove = defineAction({
  input: inputs.remove,
  handler: handlers.remove,
});

export const checkIfEmailExists = defineAction({
  input: inputs.checkIfEmailExists,
  handler: handlers.checkIfEmailExists,
});
