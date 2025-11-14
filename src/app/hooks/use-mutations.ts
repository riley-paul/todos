import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { actions } from "astro:actions";
import { qUser } from "@/app/lib/queries";

export default function useMutations() {
  const queryClient = useQueryClient();

  /* USERS */

  const deleteUser = useMutation({
    mutationFn: actions.users.remove.orThrow,
    onSuccess: () => {
      queryClient.clear();
      window.location.href = "/";
    },
  });

  const updateUserSettings = useMutation({
    mutationFn: actions.users.updateUserSettings.orThrow,
    onSuccess: (data) => {
      queryClient.setQueryData(qUser.queryKey, (prev) => {
        if (!prev) return data;
        return { ...prev, ...data };
      });
      toast.success("Settings updated");
    },
  });

  return {
    deleteUser,
    updateUserSettings,
  };
}
