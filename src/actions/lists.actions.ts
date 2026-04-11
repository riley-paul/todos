import { defineAction } from "astro:actions";
import * as listInputs from "@/api/schema/lists";
import * as listFunctions from "@/api/functions/lists";
import { ensureAuthorized } from "@/api/helpers";

export const getAll = defineAction({
  input: listInputs.getAll,
  handler: (input, c) => {
    const userId = ensureAuthorized(c).id;
    return listFunctions.getAll({ ...input, userId });
  },
});

export const search = defineAction({
  input: listInputs.search,
  handler: (input, c) => {
    const userId = ensureAuthorized(c).id;
    return listFunctions.search({ ...input, userId });
  },
});

export const get = defineAction({
  input: listInputs.get,
  handler: (input, c) => {
    const userId = ensureAuthorized(c).id;
    return listFunctions.get({ ...input, userId });
  },
});

export const update = defineAction({
  input: listInputs.update,
  handler: (input, c) => {
    const userId = ensureAuthorized(c).id;
    return listFunctions.update({ ...input, userId });
  },
});

export const create = defineAction({
  input: listInputs.create,
  handler: (input, c) => {
    const userId = ensureAuthorized(c).id;
    return listFunctions.create({ ...input, userId });
  },
});

export const remove = defineAction({
  input: listInputs.remove,
  handler: (input, c) => {
    const userId = ensureAuthorized(c).id;
    return listFunctions.remove({ ...input, userId });
  },
});

export const updateSortShow = defineAction({
  input: listInputs.updateSortShow,
  handler: (input, c) => {
    const userId = ensureAuthorized(c).id;
    return listFunctions.updateSortShow({ ...input, userId });
  },
});
