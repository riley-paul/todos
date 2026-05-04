import { queryOptions } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const qUser = () =>
  queryOptions({
    queryKey: ["me"],
    queryFn: () => actions.users.getMe.orThrow(),
  });

export const qLists = () =>
  queryOptions({
    queryKey: ["lists"],
    queryFn: () => actions.lists.getAll.orThrow({}),
  });

export const qListsSearch = (search: string) =>
  queryOptions({
    queryKey: ["listsSearch", search],
    queryFn: () => actions.lists.getAll.orThrow({ search }),
  });

export const qList = (listId: string) =>
  queryOptions({
    queryKey: ["list", listId],
    queryFn: () => actions.lists.get.orThrow({ listId }),
  });

export const qTodos = (listId: string) =>
  queryOptions({
    queryKey: ["todos", listId],
    queryFn: () => actions.todos.getForList.orThrow({ listId }),
  });

export const qTodosSearch = (search: string) =>
  queryOptions({
    queryKey: ["todosSearch", search],
    queryFn: () => actions.todos.getAll.orThrow({ search }),
  });

export const qListUsers = (listId: string) =>
  queryOptions({
    queryKey: ["listUsers", listId],
    queryFn: () => actions.listUsers.get.orThrow({ listId }),
  });
