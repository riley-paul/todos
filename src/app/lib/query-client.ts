import { MutationCache, QueryClient } from "@tanstack/query-core";
import { toast } from "sonner";

export const mutationCache = new MutationCache({
  onError: (error) => {
    console.error(error);
    toast.error("An error occurred", { description: error.message });
  },
});

export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
  mutationCache,
});
