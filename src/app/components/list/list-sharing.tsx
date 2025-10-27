import type { ListSelect, ListUserSelect } from "@/lib/types";
import React from "react";
import UserBubbleGroup from "../ui/user-bubble-group";
import {
  Badge,
  Button,
  Dialog,
  IconButton,
  Text,
  type ButtonProps,
} from "@radix-ui/themes";
import { HourglassIcon, SendIcon, Share2Icon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import UserBubble from "../ui/user-bubble";
import UserSearch from "./user-search";
import { toast } from "sonner";
import ResponsiveDialogContent from "../ui/responsive-dialog-content";
import { qListShares } from "@/app/lib/queries";
import useMutations from "@/app/hooks/use-mutations";

type UserInviterProps = {
  list: ListSelect;
  isUserDisabled: (userId: string) => boolean;
};

const UserInviter: React.FC<UserInviterProps> = ({ list, isUserDisabled }) => {
  const [search, setSearch] = React.useState("");
  const [selectedUserId, setSelectedUserId] = React.useState<string>("");

  const { joinList } = useMutations();

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-2">
      <UserSearch
        search={search}
        setSearch={setSearch}
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
        isUserDisabled={isUserDisabled}
      />
      <Button
        size="3"
        disabled={!selectedUserId}
        onClick={() =>
          joinList.mutate(
            { listId: list.id, userId: selectedUserId },
            {
              onSuccess: () => {
                toast.success(`Invited user to ${list.name}!`);
                setSelectedUserId("");
                setSearch("");
              },
            },
          )
        }
      >
        <SendIcon className="size-4" />
        <span>Invite</span>
      </Button>
    </div>
  );
};

type ListShareProps = {
  listShare: ListUserSelect;
  isOnlyUser?: boolean;
};

const ListShare: React.FC<ListShareProps> = ({ listShare }) => {
  // const handleRemoveUser = useRemoveUserAlert({ listId, userId });
  // const handleCancelInvite = useCancelInviteAlert({ listId, userId });

  const getActionProps = (): ButtonProps => {
    if (listShare.isPending) {
      return {
        color: "red",
        children: "Cancel",
        // onClick: handleCancelInvite,
      };
    }

    // if (userId === uid) {
    //   return {
    //     color: "amber",
    //     disabled: isOnlyUser,
    //     children: "Leave",
    //     onClick: handleRemoveUser,
    //   };
    // }

    return {
      color: "red",
      children: "Remove",
      // onClick: handleRemoveUser
    };
  };

  return (
    <article className="hover:bg-accent-3 rounded-3 -mx-3 flex items-center gap-3 px-3 py-2 sm:flex">
      <UserBubble avatarProps={{ size: "2" }} user={listShare.user} />
      <Text size="3" weight="medium" truncate className="flex-1">
        {listShare.user.name}
      </Text>
      <section className="flex items-center gap-3">
        {listShare.isPending && (
          <Badge size="1" className="size-6" variant="outline" color="amber">
            <HourglassIcon className="size-3" />
          </Badge>
        )}
        <Button size="1" variant="soft" {...getActionProps()} />
      </section>
    </article>
  );
};

const ListSharing: React.FC<{ list: ListSelect }> = ({ list }) => {
  const { data: listShares = [] } = useQuery(qListShares(list.id));
  const existingUserIds = new Set(listShares.map(({ userId }) => userId));

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        {list.otherUsers.length === 0 ? (
          <IconButton variant="ghost">
            <Share2Icon className="size-4" />
          </IconButton>
        ) : (
          <Button variant="ghost">
            <UserBubbleGroup users={list.otherUsers} numAvatars={3} />
          </Button>
        )}
      </Dialog.Trigger>
      <ResponsiveDialogContent fullHeightDrawer>
        <header>
          <Dialog.Title>Share List</Dialog.Title>
          <Dialog.Description size="2" color="gray">
            Add other users to your list so they can add and delete todos
          </Dialog.Description>
        </header>
        <UserInviter
          list={list}
          isUserDisabled={(userId) => existingUserIds.has(userId)}
        />
        <article className="-mx-6 flex h-full flex-col gap-1 overflow-x-hidden overflow-y-auto px-6">
          {listShares.map((listShare) => (
            <ListShare
              key={listShare.id}
              listShare={listShare}
              isOnlyUser={listShares.length === 1}
            />
          ))}
        </article>
      </ResponsiveDialogContent>
    </Dialog.Root>
  );
};

export default ListSharing;
