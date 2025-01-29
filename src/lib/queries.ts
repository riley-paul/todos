import { queryOptions } from "@tanstack/react-query";
import { actions } from "astro:actions";
import type { SelectedList } from "./types";

export const todosQueryOptions = (listId: SelectedList) =>
  queryOptions({
    queryKey: ["todos", listId],
    queryFn: () => actions.todos.get.orThrow({ listId }),
  });

export const userQueryOptions = queryOptions({
  queryKey: ["profile"],
  retry: false,
  queryFn: () => actions.getMe.orThrow(),
});

export const userByEmailQueryOptions = (email: string) =>
  queryOptions({
    queryKey: ["userByEmail", email],
    queryFn: () => actions.checkIfUserEmailExists.orThrow({ email }),
    retry: false,
  });

export const listsQueryOptions = queryOptions({
  queryKey: ["lists"],
  queryFn: () => actions.getLists.orThrow(),
});

export const pendingSharesQueryOptions = queryOptions({
  queryKey: ["pendingShares"],
  queryFn: () => actions.getPendingListShares.orThrow(),
});
