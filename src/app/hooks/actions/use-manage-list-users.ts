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
          try {
            await actions.listUsers2.inviteToList.orThrow({ listId, email });
            await collections.listUsers.utils.refetch();
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : "An error occurred while sending the invitation",
            );
            return;
          }
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
        handleDelete: () => {
          actions.listUsers2.removeFromList.orThrow({
            listId,
            userId: userToRemoveId,
          });
          collections.listUsers.utils.refetch();
          dispatchAlert({ type: "close" });
          toast.success("User removed from list");
        },
        confirmButtonProps: {
          children: "Remove",
        },
      },
    });
  };

  return {
    handleInviteToList,
    handleRemoveFromList,
  };
}
