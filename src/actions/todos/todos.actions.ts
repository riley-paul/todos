import { defineAction } from "astro:actions";
import todoInputs from "./todos.inputs";
import todoHanders from "./todos.handlers";

export const get = defineAction({
  input: todoInputs.get,
  handler: todoHanders.get,
});

export const create = defineAction({
  input: todoInputs.create,
  handler: todoHanders.create,
});

export const update = defineAction({
  input: todoInputs.update,
  handler: todoHanders.update,
});

export const remove = defineAction({
  input: todoInputs.remove,
  handler: todoHanders.remove,
});

export const removeCompleted = defineAction({
  input: todoInputs.removeCompleted,
  handler: todoHanders.removeCompleted,
});

export const uncheckCompleted = defineAction({
  input: todoInputs.uncheckCompleted,
  handler: todoHanders.uncheckCompleted,
});
