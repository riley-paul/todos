import { defineAction } from "astro:actions";
import listShareInputs from "./list-shares.inputs";
import listShareHandlers from "./list-shares.handlers";

export const create = defineAction({
  input: listShareInputs.create,
  handler: listShareHandlers.create,
});

export const remove = defineAction({
  input: listShareInputs.remove,
  handler: listShareHandlers.remove,
});

export const leave = defineAction({
  input: listShareInputs.leave,
  handler: listShareHandlers.leave,
});

export const accept = defineAction({
  input: listShareInputs.accept,
  handler: listShareHandlers.accept,
});

export const getAllPending = defineAction({
  input: listShareInputs.getAllPending,
  handler: listShareHandlers.getAllPending,
});
