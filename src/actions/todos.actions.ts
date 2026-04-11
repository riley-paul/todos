import { defineAction } from "astro:actions";
import * as todoInputs from "@/api/schema/todos.input";
import * as todoFunctions from "@/api/functions/todos";
import { ensureAuthorized } from "@/api/helpers";

export const getAll = defineAction({
  input: todoInputs.getAll,
  handler: (input, c) => {
    const userId = ensureAuthorized(c).id;
    return todoFunctions.getAll({ ...input, userId });
  },
});

export const search = defineAction({
  input: todoInputs.search,
  handler: (input, c) => {
    const userId = ensureAuthorized(c).id;
    return todoFunctions.search({ ...input, userId });
  },
});

export const create = defineAction({
  input: todoInputs.create,
  handler: (input, c) => {
    const userId = ensureAuthorized(c).id;
    return todoFunctions.create({ ...input, userId });
  },
});

export const update = defineAction({
  input: todoInputs.update,
  handler: (input, c) => {
    const userId = ensureAuthorized(c).id;
    return todoFunctions.update({ ...input, userId });
  },
});

export const remove = defineAction({
  input: todoInputs.remove,
  handler: (input, c) => {
    const userId = ensureAuthorized(c).id;
    return todoFunctions.remove({ ...input, userId });
  },
});

export const removeCompleted = defineAction({
  input: todoInputs.removeCompleted,
  handler: (input, c) => {
    const userId = ensureAuthorized(c).id;
    return todoFunctions.removeCompleted({ ...input, userId });
  },
});

export const uncheckCompleted = defineAction({
  input: todoInputs.uncheckCompleted,
  handler: (input, c) => {
    const userId = ensureAuthorized(c).id;
    return todoFunctions.uncheckCompleted({ ...input, userId });
  },
});
