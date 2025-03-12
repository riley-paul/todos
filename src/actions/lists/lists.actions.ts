import { defineAction } from "astro:actions";
import * as inputs from "./lists.inputs";
import * as handlers from "./lists.handlers";

export const getAll = defineAction({
  input: inputs.getAll,
  handler: handlers.getAll,
});

export const update = defineAction({
  input: inputs.update,
  handler: handlers.update,
});

export const create = defineAction({
  input: inputs.create,
  handler: handlers.create,
});

export const remove = defineAction({
  input: inputs.remove,
  handler: handlers.remove,
});
