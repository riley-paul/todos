import { alertSystemAtom } from "@/app/components/alert-system/alert-system.store";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "@tanstack/react-router";
import { actions } from "astro:actions";
import { useAtom } from "jotai";
import { toast } from "sonner";

export default function useLeaveList() {
  const [, dispatchAlert] = useAtom(alertSystemAtom);

  const router = useRouter();
  const { listId: currentList } = useParams({ strict: false });

  const leaveListMutation = useMutation({
    mutationFn: actions.lists.leave.orThrow,
    onSuccess: (_, { listId }) => {
      toast.success("You have left the list");
      router.invalidate();
      if (listId === currentList) router.navigate({ to: "/" });
    },
  });

  const handleLeaveList = (listId: string) => {
    dispatchAlert({
      type: "open",
      data: {
        type: "delete",
        title: "Leave List",
        message: `Are you sure you want to leave this list? If you are the only member, the list will be deleted.`,
        handleDelete: () => {
          leaveListMutation.mutate({ listId });
          dispatchAlert({ type: "close" });
        },
      },
    });
  };

  return { handleLeaveList };
}
