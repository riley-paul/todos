import { defineAction } from "astro:actions";
import listInputs from "./lists.inputs";
import listHandlers from "./lists.handlers";

export const getAll = defineAction({
  input: listInputs.getAll,
  handler: listHandlers.getAll,
});

export const get = defineAction({
  input: listInputs.get,
  handler: listHandlers.get,
});

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
