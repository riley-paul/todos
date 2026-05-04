import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actions } from "astro:actions";
import { qMe } from "../lib/queries";

export default function useMutations() {
  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: actions.users.update.orThrow,
    onSuccess: (data) => {
      queryClient.setQueryData(qMe().queryKey, (prev) => {
        if (!prev) return prev;
        return { ...prev, ...data };
      });
    },
  });

  return {
    updateUserMutation,
  };
}
