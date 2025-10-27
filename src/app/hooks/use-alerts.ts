import { alertSystemAtom } from "@/app/components/alert-system/alert-system.store";
import { zListName } from "@/lib/types";
import { useAtom } from "jotai";
import { toast } from "sonner";
import useMutations from "./use-mutations";

export default function useAlerts() {
  const [, dispatchAlert] = useAtom(alertSystemAtom);
  const { createList, removeSelfFromList, removeUserFromList } = useMutations();

  const handleCreateList = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "input",
        title: "Create New List",
        message: "Enter a name for your new list",
        value: "",
        placeholder: "List name",
        schema: zListName,
        handleSubmit: (name: string) => {
          createList.mutate({ name });
          dispatchAlert({ type: "close" });
          toast.success(`List "${name}" created`);
        },
      },
    });
  };

  const handleCancelInvite = (data: { listId: string; userId: string }) => {
    dispatchAlert({
      type: "open",
      data: {
        type: "delete",
        title: "Cancel Invitation",
        message:
          "Are you sure you want to cancel this invitation? User will no longer be able to join this list.",
        handleDelete: () => {
          removeUserFromList.mutate(data);
          dispatchAlert({ type: "close" });
          toast.success("Invitation cancelled");
        },
        confirmButtonProps: {
          children: "Cancel",
          color: "amber",
        },
      },
    });
  };

  const handleRemoveUser = (data: { listId: string; userId: string }) => {
    dispatchAlert({
      type: "open",
      data: {
        type: "delete",
        title: "Remove User",
        message:
          "Are you sure you want to remove this user from the list? They will no longer have access to it.",
        handleDelete: () => {
          removeUserFromList.mutate(data);
          dispatchAlert({ type: "close" });
          toast.success("User removed from list");
        },
        confirmButtonProps: { children: "Remove" },
      },
    });
  };

  const handleRemoveSelf = (data: { listId: string }) => {
    dispatchAlert({
      type: "open",
      data: {
        type: "delete",
        title: "Leave List",
        message:
          "Are you sure you want to leave this list? You will no longer have access to it.",
        handleDelete: () => {
          removeSelfFromList.mutate(data);
          dispatchAlert({ type: "close" });
          toast.success("You have left the list");
        },
        confirmButtonProps: { children: "Leave" },
      },
    });
  };

  return {
    handleCreateList,
    handleCancelInvite,
    handleRemoveSelf,
    handleRemoveUser,
  };
}
