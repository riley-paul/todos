import { handleError } from "./errors";
import { QueryClient, MutationCache } from "@tanstack/query-core";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
  mutationCache: new MutationCache({
    // onSuccess: () => {
    //   queryClient.invalidateQueries();
    // },
    onError: (error) => {
      handleError(error);
    },
  }),
});

export default queryClient;
