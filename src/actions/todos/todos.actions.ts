import { defineAction } from "astro:actions";
import * as inputs from "./todos.inputs";
import * as handlers from "./todos.handlers";

export const get = defineAction({
  input: inputs.get,
  handler: handlers.get,
});

export const create = defineAction({
  input: inputs.create,
  handler: handlers.create,
});

export const update = defineAction({
  input: inputs.update,
  handler: handlers.update,
});

export const remove = defineAction({
  input: inputs.remove,
  handler: handlers.remove,
});

export const removeCompleted = defineAction({
  input: inputs.removeCompleted,
  handler: handlers.removeCompleted,
});
