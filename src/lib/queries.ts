import { queryOptions } from "@tanstack/react-query";
import { actions } from "astro:actions";

export type TodoQueryArgs = Parameters<typeof actions.getTodos>[0];

export const todosQueryOptions = (args: TodoQueryArgs) =>
  queryOptions({
    queryKey: ["todos", args],
    queryFn: () => actions.getTodos.orThrow(args),
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
