import type { ActionHandler } from "astro:actions";
import * as input from "./lists.inputs";
import type { ListSelect } from "@/lib/types";

export const list: ActionHandler<
  typeof input.list,
  ListSelect[]
> = async () => {};

export const update: ActionHandler<
  typeof input.update,
  ListSelect
> = async () => {};
