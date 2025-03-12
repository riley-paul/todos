import { defineAction } from "astro:actions";
import * as handlers from "./list-shares.handlers";
import * as inputs from "./list-shares.inputs";

export const create = defineAction({
  input: inputs.create,
  handler: handlers.create,
});

export const remove = defineAction({
  input: inputs.remove,
  handler: handlers.remove,
});

export const leave = defineAction({
  input: inputs.leave,
  handler: handlers.leave,
});

export const accept = defineAction({
  input: inputs.accept,
  handler: handlers.accept,
});

export const getAllPending = defineAction({
  input: inputs.getAllPending,
  handler: handlers.getAllPending,
});
