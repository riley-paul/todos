import { MutationCache, QueryClient } from "@tanstack/query-core";
import { toast } from "sonner";

export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
  mutationCache: new MutationCache({
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error(error);
      toast.error("An error occurred", { description: error.message });
    },
  }),
});
