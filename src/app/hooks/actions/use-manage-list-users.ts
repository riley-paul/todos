import { alertSystemAtom } from "@/app/components/alert-system/alert-system.store";
import { z } from "astro/zod";
import { actions } from "astro:actions";
import { useAtom } from "jotai";
import * as collections from "@/app/lib/collections";
import { toast } from "sonner";
import { mutationCache, queryClient } from "@/app/lib/query-client";
import { useNavigate, useParams } from "@tanstack/react-router";

const inviteToListMutation = mutationCache.build(queryClient, {
  mutationFn: actions.listUsers.inviteToList.orThrow,
  onSuccess: (_, { email }) => {
    collections.listUsers.utils.refetch();
    toast.success(`Invitation sent to "${email}"`);
  },
});

const removeFromListMutation = mutationCache.build(queryClient, {
  mutationFn: actions.listUsers.removeFromList.orThrow,
  onSuccess: () => {
    collections.listUsers.utils.refetch();
    toast.success("User removed from list");
  },
});

const acceptInviteMutation = mutationCache.build(queryClient, {
  mutationFn: actions.listUsers.acceptInvite.orThrow,
  onSuccess: () => {
    collections.listUsers.utils.refetch();
    collections.todos.utils.refetch();
    toast.success("You have joined the list");
  },
});

const leaveListMutation = mutationCache.build(queryClient, {
  mutationFn: actions.listUsers.leaveList.orThrow,
  onSuccess: () => {
    collections.listUsers.utils.refetch();
    collections.todos.utils.refetch();
    toast.success("You have left the list");
  },
});

export default function useManageListUsers(listId: string) {
  const [, dispatchAlert] = useAtom(alertSystemAtom);
  const navigate = useNavigate();
  const { listId: currentListId } = useParams({ strict: false });

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
          await inviteToListMutation.execute({ listId, email });
          dispatchAlert({ type: "close" });
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
          await removeFromListMutation.execute({
            listId,
            userId: userToRemoveId,
          });
          dispatchAlert({ type: "close" });
        },
        confirmButtonProps: {
          children: "Remove",
        },
      },
    });
  };

  const handleAcceptInvite = async () => {
    await acceptInviteMutation.execute({ listId });
    navigate({ to: "/todos/$listId", params: { listId } });
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
          await leaveListMutation.execute({ listId });
          dispatchAlert({ type: "close" });
          if (currentListId === listId) navigate({ to: "/" });
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
