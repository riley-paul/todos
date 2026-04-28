import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { actions } from "astro:actions";
import { toast } from "sonner";

export default function useAcceptListInvite() {
  const router = useRouter();

  const acceptInvite = useMutation({
    mutationFn: actions.lists.acceptInvite.orThrow,
    onSuccess: ({ name }, { listId }) => {
      router.navigate({ to: "/todos/$listId", params: { listId } });
      toast.success(`You have joined the list "${name}"`);
    },
  });

  const handleAcceptListInvite = (listId: string) => {
    acceptInvite.mutate({ listId });
  };

  return { handleAcceptListInvite };
}
