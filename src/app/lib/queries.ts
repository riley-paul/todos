import { queryOptions } from "@tanstack/react-query";
import { api } from "./client";

export const todosQueryOptions = (tag?: string) =>
  queryOptions({
    queryKey: ["todos", tag],
    queryFn: async () => {
      const res = await api.todos.$get({ query: { tag } });
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    },
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
  queryFn: async () => {
    const res = await api.auth.me.$get();
    if (!res.ok) return null;
    return await res.json();
  },
});
