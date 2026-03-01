import { defineAction } from "astro:actions";
import * as todoInputs from "./todos.inputs";
import * as todoHanders from "./todos.handlers";

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

export const populate = defineAction({
  input: todoInputs.populate,
  handler: todoHanders.populate,
});
