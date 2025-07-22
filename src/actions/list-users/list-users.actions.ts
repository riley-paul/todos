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
  input: listUserInputs.update,
  handler: listShareHandlers.update,
});

export const accept = defineAction({
  input: listUserInputs.getAllForList,
  handler: listShareHandlers.getAllForList,
});

export const getAllPending = defineAction({
  input: listUserInputs.getAllPending,
  handler: listShareHandlers.getAllPending,
});

export const getAllForList = defineAction({
  input: listUserInputs.getAllForList,
  handler: listShareHandlers.getAllForList,
});
