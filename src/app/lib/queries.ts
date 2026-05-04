import { queryOptions } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const getAllLists = (search?: string) =>
  queryOptions({
    queryKey: ["lists", search],
    queryFn: () => actions.lists.getAll.orThrow({ search }),
  });

export const getList = (listId: string) =>
  queryOptions({
    queryKey: ["list", listId],
    queryFn: () => actions.lists.get.orThrow({ listId }),
  });

export const getTodosForList = (listId: string) =>
  queryOptions({
    queryKey: ["todos", listId],
    queryFn: () => actions.todos.getForList.orThrow({ listId }),
  });
