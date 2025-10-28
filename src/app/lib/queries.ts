import { queryOptions } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const qTodos = (listId: string) =>
  queryOptions({
    queryKey: ["todos", listId],
    queryFn: () => actions.todos.getAll.orThrow({ listId }),
  });

export const qTodoSearch = (search: string) =>
  queryOptions({
    queryKey: ["todoSearch", search],
    queryFn: () => actions.todos.search.orThrow({ search }),
  });

export const qUser = queryOptions({
  queryKey: ["profile"],
  retry: false,
  queryFn: actions.users.getMe.orThrow,
});

export const qLists = queryOptions({
  queryKey: ["lists"],
  queryFn: actions.lists.getAll.orThrow,
});

export const qListSearch = (search: string) =>
  queryOptions({
    queryKey: ["listSearch", search],
    queryFn: () => actions.lists.search.orThrow({ search }),
  });

export const qList = (listId: string) =>
  queryOptions({
    queryKey: ["list", listId],
    queryFn: () => actions.lists.get.orThrow({ listId }),
  });

export const qListShares = (listId: string) =>
  queryOptions({
    queryKey: ["listShares", listId],
    queryFn: () => actions.listUsers.getAllForList.orThrow({ listId }),
  });
