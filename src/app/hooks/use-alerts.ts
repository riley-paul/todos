import { alertSystemAtom } from "@/app/components/alert-system/alert-system.store";
import { zListName } from "@/lib/types";
import { useAtom } from "jotai";
import { toast } from "sonner";
import useMutations from "./use-mutations";
import { z } from "astro/zod";

export default function useAlerts() {
  const [, dispatchAlert] = useAtom(alertSystemAtom);
  const {
    createList,
    removeSelfFromList,
    removeUserFromList,
    inviteUserToList,
  } = useMutations();

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
          createList.mutate(
            { name },
            {
              onSuccess: () => {
                dispatchAlert({ type: "close" });
                toast.success(`List "${name}" created`);
              },
            },
          );
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
          removeUserFromList.mutate(data, {
            onSuccess: () => {
              dispatchAlert({ type: "close" });
              toast.success("Invitation cancelled");
            },
          });
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
          removeUserFromList.mutate(data, {
            onSuccess: () => {
              dispatchAlert({ type: "close" });
              toast.success("User removed from list");
            },
          });
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
          removeSelfFromList.mutate(data, {
            onSuccess: () => {
              dispatchAlert({ type: "close" });
              toast.success("You have left the list");
            },
          });
        },
        confirmButtonProps: { children: "Leave" },
      },
    });
  };

  const handleInviteUser = (data: { listId: string }) => {
    const { listId } = data;
    dispatchAlert({
      type: "open",
      data: {
        type: "input",
        title: "Invite User",
        message: "Enter the email address of the user you want to invite",
        value: "",
        placeholder: "User email",
        schema: z.string().email("Please enter a valid email address"),
        handleSubmit: (email: string) => {
          inviteUserToList.mutate(
            { listId, email },
            {
              onSuccess: () => {
                dispatchAlert({ type: "close" });
                toast.success(`Invitation sent to "${email}"`);
              },
            },
          );
        },
      },
    });
  };

  return {
    handleCreateList,
    handleCancelInvite,
    handleRemoveSelf,
    handleRemoveUser,
    handleInviteUser,
  };
}
