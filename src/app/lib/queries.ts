import { queryOptions } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const todosQueryOptions = (tag?: string) =>
  queryOptions({
    queryKey: ["todos", tag],
    queryFn: () => actions.getTodos({ tag }).then((res) => res.data),
  });

export const hashtagQueryOptions = queryOptions({
  queryKey: ["hashtags"],
  queryFn: () => actions.getHashtags().then((res) => res.data),
});

export const userQueryOptions = queryOptions({
  queryKey: ["profile"],
  retry: false,
  queryFn: () => actions.getMe().then((res) => res.data),
});
