import { queryOptions } from "@tanstack/react-query";
import { api } from "./client";

export const todosQueryOptions = queryOptions({
  queryKey: ["todos"],
  queryFn: async () => {
    const res = await api.todos.$get();
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  },
});

export const listsQueryOptions = queryOptions({
  queryKey: ["lists"],
  queryFn: async () => {
    const res = await api.lists.$get();
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  },
});

export const userQueryOptions = queryOptions({
  queryKey: ["profile"],
  queryFn: async () => {
    const res = await api.auth.me.$get();
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  },
});
