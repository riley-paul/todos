import { defineAction } from "astro:actions";
import * as listInputs from "./lists.inputs";
import * as listHandlers from "./lists.handlers";

export const update = defineAction({
  input: listInputs.update,
  handler: listHandlers.update,
});

export const create = defineAction({
  input: listInputs.create,
  handler: listHandlers.create,
});

export const remove = defineAction({
  input: listInputs.remove,
  handler: listHandlers.remove,
});

export const populate = defineAction({
  input: listInputs.populate,
  handler: listHandlers.populate,
});
