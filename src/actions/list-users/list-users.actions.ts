import { defineAction } from "astro:actions";
import * as listUserInputs from "./list-users.inputs";
import * as listUserHandlers from "./list-users.handlers";

export const create = defineAction({
  input: listUserInputs.create,
  handler: listUserHandlers.create,
});

export const remove = defineAction({
  input: listUserInputs.remove,
  handler: listUserHandlers.remove,
});

export const accept = defineAction({
  input: listUserInputs.accept,
  handler: listUserHandlers.accept,
});

export const getAllForList = defineAction({
  input: listUserInputs.getAllForList,
  handler: listUserHandlers.getAllForList,
});

export const populate = defineAction({
  input: listUserInputs.populate,
  handler: listUserHandlers.populate,
});
