import { queryOptions } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const qTodos = (listId: string) =>
  queryOptions({
    queryKey: ["todos", listId],
    queryFn: () => actions.todos.get.orThrow({ listId }),
  });

export const qUser = queryOptions({
  queryKey: ["profile"],
  retry: false,
  queryFn: actions.users.getMe.orThrow,
});

export const qUsers = (search: string) =>
  queryOptions({
    queryKey: ["users", search],
    queryFn: () => actions.users.get.orThrow({ search }),
    enabled: !!search,
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

export const qListShares = (listId: string) =>
  queryOptions({
    queryKey: ["listShares", listId],
    queryFn: () => actions.listUsers.getAllForList.orThrow({ listId }),
  });
