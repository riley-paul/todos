import { defineAction } from "astro:actions";
import listUserInputs from "./list-users.inputs";
import listShareHandlers from "./list-users.handlers";

export const create = defineAction({
  input: listUserInputs.create,
  handler: listShareHandlers.create,
});

export const remove = defineAction({
  input: listUserInputs.remove,
  handler: listShareHandlers.remove,
});

export const leave = defineAction({
  input: listUserInputs.leave,
  handler: listShareHandlers.leave,
});

export const accept = defineAction({
  input: listUserInputs.accept,
  handler: listShareHandlers.accept,
});

export const getAllPending = defineAction({
  input: listUserInputs.getAllPending,
  handler: listShareHandlers.getAllPending,
});
