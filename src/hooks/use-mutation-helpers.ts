import {
  useQueryClient,
  type QueryKey,
  type Updater,
} from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

export default function useMutationHelpers() {
  const queryClient = useQueryClient();
  const toastId = React.useRef<string | number | undefined>();

  const invalidateQueries = (queryKeys: QueryKey[]) => {
    queryKeys.forEach((queryKey) =>
      queryClient.invalidateQueries({ queryKey }),
    );
  };

  const onError = (error: Error) => {
    console.error(error);
    toast.error(error.message ?? "Server Error", { id: toastId.current });
  };

  const onMutateMessage = (message: string) => {
    toastId.current = toast.loading(message);
  };

  const toastSuccess = (message: string) => {
    toast.success(message, { id: toastId.current });
  };

  async function optimisticUpdate<T extends object>(
    queryKey: QueryKey,
    updater: Updater<T, T>,
  ): Promise<{ previous: T | null | undefined }> {
    await queryClient.cancelQueries({ queryKey });
    const previous = queryClient.getQueryData<T>(queryKey);
    queryClient.setQueryData<T>(queryKey, (prev) => {
      if (!prev) return prev;
      if (typeof updater === "function") {
        return updater(prev);
      }
      return updater;
    });
    return { previous };
  }

  function onErrorOptimistic<T extends object>(
    queryKey: QueryKey,
    context: { previous: T | null | undefined } | undefined,
  ) {
    if (context?.previous) {
      queryClient.setQueryData(queryKey, context.previous);
    }
  }

  return {
    toastId,
    toastSuccess,
    invalidateQueries,
    onMutateMessage,
    optimisticUpdate,
    onError,
    onErrorOptimistic,
  };
}
