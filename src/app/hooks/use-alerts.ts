import { alertSystemAtom } from "@/app/components/alert-system/alert-system.store";
import { zListName } from "@/lib/types";
import { useAtom } from "jotai";
import { toast } from "sonner";
import useMutations from "./use-mutations";
import { z } from "astro/zod";
import * as collections from "@/app/lib/collections";
import type { ListSelect } from "@/lib/types2";
import { useUser } from "../providers/user-provider";

export default function useAlerts() {
  const currentUser = useUser();
  const [, dispatchAlert] = useAtom(alertSystemAtom);
  const { removeUserFromList, inviteUserToList } = useMutations();

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
          const list: ListSelect = {
            id: crypto.randomUUID(),
            name,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          collections.fns.insertList({ list, userId: currentUser.id });
          dispatchAlert({ type: "close" });
        },
      },
    });
  };

  const handleCancelInvite = (data: {
    listId: string;
    userToRemoveId: string;
  }) => {
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

  const handleRemoveUser = (data: {
    listId: string;
    userToRemoveId: string;
  }) => {
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

  return {
    handleCreateList,
    handleCancelInvite,
    handleRemoveUser,
  };
}
