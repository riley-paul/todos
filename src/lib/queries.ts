import { queryOptions } from "@tanstack/react-query";
import api from "./client";

export const getTodosQP = queryOptions({
  queryKey: ["todos"],
  queryFn: async () => {
    const res = await api.todos.$get();
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  },
});
