import { alertSystemAtom } from "@/app/components/alert-system/alert-system.store";
import { z } from "astro/zod";
import { actions } from "astro:actions";
import { useAtom } from "jotai";
import * as collections from "@/app/lib/collections";
import { toast } from "sonner";

export default function useManageListUsers(listId: string) {
  const [, dispatchAlert] = useAtom(alertSystemAtom);

  const handleInviteToList = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "input",
        title: "Invite User",
        message: "Enter the email address of the user you want to invite",
        value: "",
        placeholder: "User email",
        schema: z.email("Please enter a valid email address"),
        handleSubmit: async (email: string) => {
          await actions.listUsers.inviteToList.orThrow({ listId, email });
          await collections.listUsers.utils.refetch();
          dispatchAlert({ type: "close" });
          toast.success(`Invitation sent to "${email}"`);
        },
      },
    });
  };

  const handleRemoveFromList = (userToRemoveId: string) => {
    dispatchAlert({
      type: "open",
      data: {
        type: "delete",
        title: "Remove User",
        message:
          "Are you sure you want to remove this user from the list? They will lose access to this list and all its tasks.",
        handleDelete: async () => {
          await actions.listUsers.removeFromList.orThrow({
            listId,
            userId: userToRemoveId,
          });
          await collections.listUsers.utils.refetch();
          dispatchAlert({ type: "close" });
          toast.success("User removed from list");
        },
        confirmButtonProps: {
          children: "Remove",
        },
      },
    });
  };

  const handleAcceptInvite = async () => {
    await actions.listUsers.acceptInvite.orThrow({ listId });
    await collections.listUsers.utils.refetch();
    toast.success("You have joined the list");
  };

  const handleLeaveList = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "delete",
        title: "Leave List",
        message:
          "Are you sure you want to leave this list? You will lose access to this list and all its tasks.",
        handleDelete: async () => {
          await actions.listUsers.leaveList.orThrow({ listId });
          await collections.listUsers.utils.refetch();
          dispatchAlert({ type: "close" });
          toast.success("You have left the list");
        },
        confirmButtonProps: {
          children: "Leave",
          color: "red",
        },
      },
    });
  };

  return {
    handleInviteToList,
    handleRemoveFromList,
    handleAcceptInvite,
    handleLeaveList,
  };
}
