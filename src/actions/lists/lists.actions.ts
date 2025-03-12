import { defineAction } from "astro:actions";
import * as inputs from "./lists.inputs";
import * as handlers from "./lists.handlers";

export const list = defineAction({
  input: inputs.list,
  handler: handlers.list,
});

export const update = defineAction({
  input: inputs.update,
  handler: handlers.update,
});
