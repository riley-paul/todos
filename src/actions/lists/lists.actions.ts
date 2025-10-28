import { defineAction } from "astro:actions";
import * as listInputs from "./lists.inputs";
import * as listHandlers from "./lists.handlers";

export const getAll = defineAction({
  input: listInputs.getAll,
  handler: listHandlers.getAll,
});

export const search = defineAction({
  input: listInputs.search,
  handler: listHandlers.search,
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

export const updateSortShow = defineAction({
  input: listInputs.updateSortShow,
  handler: listHandlers.updateSortShow,
});
