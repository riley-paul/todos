import { queryOptions } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const todosQueryOptions = (tag?: string) =>
  queryOptions({
    queryKey: ["todos", tag],
    queryFn: () => actions.getTodos.orThrow({ tag }),
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
