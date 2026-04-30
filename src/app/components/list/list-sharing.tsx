import React from "react";
import { Avatar, Button, Dialog, IconButton } from "@radix-ui/themes";
import ListShares from "./list-shares";
import { PlusIcon, Share2Icon } from "lucide-react";
import ResponsiveDialogContent from "../ui/responsive-dialog-content";
import UserBubbleGroup from "@/app/components/ui/user/user-bubble-group";
import type { ListSelectDetails } from "@/lib/types2";
import useGetListUsers from "@/app/hooks/actions/use-get-list-users";
import useInviteToList from "@/app/hooks/actions/use-invite-to-list";

const ListSharing: React.FC<{ list: ListSelectDetails }> = ({ list }) => {
  const listUsers = useGetListUsers(list.id);
  const handleInviteToList = useInviteToList(list.id);

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        {listUsers.length === 0 ? (
          <IconButton variant="ghost">
            <Share2Icon className="size-4" />
          </IconButton>
        ) : (
          <Button variant="ghost">
            <UserBubbleGroup users={listUsers} numAvatars={3} />
          </Button>
        )}
      </Dialog.Trigger>
      <ResponsiveDialogContent fullHeightDrawer desktopDrawer>
        <header>
          <Dialog.Title>Users</Dialog.Title>
          <Dialog.Description size="2" color="gray">
            Manage users with access to this list. Users with access can view
            and edit todos and share the list with others.
          </Dialog.Description>
        </header>
        <article className="relative flex-1">
          <ListShares listId={list.id} />
        </article>
        <footer className="flex">
          <Button
            size="3"
            variant="ghost"
            className="flex flex-1 justify-start gap-3 text-left"
            onClick={handleInviteToList}
          >
            <Avatar
              src=""
              fallback={<PlusIcon className="size-5" />}
              size="2"
              radius="full"
            />
            <span>Invite User</span>
          </Button>
        </footer>
      </ResponsiveDialogContent>
    </Dialog.Root>
  );
};

export default ListSharing;
