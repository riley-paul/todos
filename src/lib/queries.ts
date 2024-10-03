import { queryOptions } from "@tanstack/react-query";
import { actions } from "astro:actions";

export type TodoQueryArgs = Parameters<typeof actions.getTodos>[0];

export const todosQueryOptions = (args: TodoQueryArgs) =>
  queryOptions({
    queryKey: ["todos", args],
    queryFn: () => actions.getTodos.orThrow(args),
  });

export const hashtagQueryOptions = queryOptions({
  queryKey: ["hashtags"],
  queryFn: () => actions.getHashtags.orThrow(),
});

export const userQueryOptions = queryOptions({
  queryKey: ["profile"],
  retry: false,
  queryFn: () => actions.getMe.orThrow(),
});

export const sharedTagsQueryOptions = queryOptions({
  queryKey: ["sharedTags"],
  queryFn: () => actions.getSharedTags.orThrow(),
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

export const listSharesQueryOptions = (listId: string) =>
  queryOptions({
    queryKey: ["listShares", listId],
    queryFn: () => actions.getListShares.orThrow({ listId }),
  });

export const listQueryOptions = (listId: string) =>
  queryOptions({
    queryKey: ["list", listId],
    queryFn: () => actions.getList.orThrow({ id: listId }),
  });
