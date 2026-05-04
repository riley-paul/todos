import { queryOptions } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const qUser = () =>
  queryOptions({
    queryKey: ["me"],
    queryFn: () => actions.users.getMe.orThrow(),
  });

export const qLists = (search?: string) =>
  queryOptions({
    queryKey: ["lists", search],
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

export const qListUsers = (listId: string) =>
  queryOptions({
    queryKey: ["listUsers", listId],
    queryFn: () => actions.listUsers.get.orThrow({ listId }),
  });
