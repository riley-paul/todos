import { alertSystemAtom } from "@/app/components/alert-system/alert-system.store";
import { z } from "astro/zod";
import { useAtom } from "jotai";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  useAcceptListInviteMutation,
  useInviteUserToListMutation,
  useLeaveListMutation,
  useRemoveUserFromListMutation,
} from "@/app/gql.gen";

export default function useManageListUsers(listId: string) {
  const [, dispatchAlert] = useAtom(alertSystemAtom);
  const navigate = useNavigate();
  const { listId: currentListId } = useParams({ strict: false });

  const [inviteToList] = useInviteUserToListMutation();
  const [acceptInvite] = useAcceptListInviteMutation();
  const [removeFromList] = useRemoveUserFromListMutation();
  const [leaveList] = useLeaveListMutation({
    update: (cache) => {
      const listCacheId = cache.identify({
        __typename: "ListObjectType",
        id: listId,
      });
      cache.evict({ id: listCacheId });
      cache.gc();
    },
  });

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
          inviteToList({ variables: { listId, email } });
          dispatchAlert({ type: "close" });
        },
      },
    });
  };

  const handleRemoveFromList = (listUserId: string) => {
    dispatchAlert({
      type: "open",
      data: {
        type: "delete",
        title: "Remove User",
        message:
          "Are you sure you want to remove this user from the list? They will lose access to this list and all its tasks.",
        handleDelete: async () => {
          removeFromList({ variables: { listUserId } });
          dispatchAlert({ type: "close" });
        },
        confirmButtonProps: {
          children: "Remove",
        },
      },
    });
  };

  const handleAcceptInvite = async () => {
    acceptInvite({ variables: { listId } });
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
          leaveList({ variables: { listId } });
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
