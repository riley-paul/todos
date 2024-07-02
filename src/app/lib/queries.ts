import { queryOptions } from "@tanstack/react-query";
import { api } from "./client";

export const todosQueryOptions = (listId?: string) =>
  queryOptions({
    queryKey: ["todos", listId],
    queryFn: async () => {
      const res = await api.todos.$get({ query: { listId } });
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
