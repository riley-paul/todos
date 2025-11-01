import { MutationCache, QueryClient } from "@tanstack/react-query";
import { handleError } from "./errors";

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
