import { queryOptions } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const getAllLists = queryOptions({
  queryKey: ["lists"],
  queryFn: () => actions.lists.getAll.orThrow({}),
});
