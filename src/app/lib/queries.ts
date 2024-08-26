import { queryOptions } from "@tanstack/react-query";
import { api } from "./client";
import { actions } from "astro:actions";

export const todosQueryOptions = (tag?: string) =>
  queryOptions({
    queryKey: ["todos", tag],
    queryFn: () => actions.getTodos({ tag }).then((res) => res.data),
  });

export const hashtagQueryOptions = queryOptions({
  queryKey: ["hashtags"],
  queryFn: async () => {
    const res = await api.todos.hashtags.$get();
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  },
});

export const userQueryOptions = queryOptions({
  queryKey: ["profile"],
  retry: false,
  queryFn: () => actions.getMe().then((res) => res.data),
});
