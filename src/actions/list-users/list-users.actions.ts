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

export const accept = defineAction({
  input: listUserInputs.accept,
  handler: listShareHandlers.accept,
});

export const getAllForList = defineAction({
  input: listUserInputs.getAllForList,
  handler: listShareHandlers.getAllForList,
});
