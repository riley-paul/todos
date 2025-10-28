import type { ListSelect, ListUserSelect } from "@/lib/types";
import React from "react";
import { Button, Separator, Text, type ButtonProps } from "@radix-ui/themes";
import {
  ArrowDownIcon,
  HourglassIcon,
  LogOutIcon,
  SendIcon,
  XIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import UserBubble from "../ui/user-bubble";
import UserSearch from "./user-search";
import { toast } from "sonner";
import { qListShares, qUser } from "@/app/lib/queries";
import useMutations from "@/app/hooks/use-mutations";
import useAlerts from "@/app/hooks/use-alerts";

type UserInviterProps = {
  list: ListSelect;
  isUserDisabled: (userId: string) => boolean;
};

const UserInviter: React.FC<UserInviterProps> = ({ list, isUserDisabled }) => {
  const [search, setSearch] = React.useState("");
  const [selectedUserId, setSelectedUserId] = React.useState<string>("");

  const { createListJoin } = useMutations();

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
          createListJoin.mutate(
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

const ListShare: React.FC<ListShareProps> = ({ listShare, isOnlyUser }) => {
  const { data: currentUser } = useQuery(qUser);
  const { handleCancelInvite, handleRemoveSelf, handleRemoveUser } =
    useAlerts();

  const getActionProps = (): ButtonProps => {
    if (listShare.isPending) {
      return {
        color: "amber",
        children: (
          <React.Fragment>
            <XIcon className="size-3" />
            <span>Cancel</span>
          </React.Fragment>
        ),
        onClick: () =>
          handleCancelInvite({
            listId: listShare.listId,
            userId: listShare.userId,
          }),
      };
    }

    if (listShare.userId === currentUser?.id) {
      return {
        disabled: isOnlyUser,
        children: (
          <React.Fragment>
            <LogOutIcon className="size-3" />
            <span>Leave</span>
          </React.Fragment>
        ),
        onClick: () => handleRemoveSelf({ listId: listShare.listId }),
      };
    }

    return {
      color: "red",
      children: (
        <React.Fragment>
          <XIcon className="size-3" />
          <span>Remove</span>
        </React.Fragment>
      ),
      onClick: () =>
        handleRemoveUser({
          listId: listShare.listId,
          userId: listShare.userId,
        }),
    };
  };

  return (
    <article className="sm:hover:bg-accent-3 rounded-3 -mx-3 flex items-center gap-3 px-3 py-2 sm:flex">
      <UserBubble avatarProps={{ size: "2" }} user={listShare.user} />
      <Text size="3" weight="medium" truncate className="flex-1">
        {listShare.user.name}
      </Text>
      <section className="flex items-center gap-3">
        {listShare.isPending && (
          <HourglassIcon className="text-amber-10 size-3" />
        )}
        <Button size="1" variant="soft" {...getActionProps()} />
      </section>
    </article>
  );
};

const ListSharing: React.FC<{ list: ListSelect }> = ({ list }) => {
  const { data: listShares = [] } = useQuery(qListShares(list.id));
  const existingUserIds = new Set(listShares.map(({ userId }) => userId));

  const pendingListShares = listShares.filter(({ isPending }) => isPending);
  const nonPendingListShares = listShares.filter(({ isPending }) => !isPending);

  return (
    <React.Fragment>
      <UserInviter
        list={list}
        isUserDisabled={(userId) => existingUserIds.has(userId)}
      />
      <article className="-mx-6 flex h-full flex-col gap-1 overflow-x-hidden overflow-y-auto px-6">
        {nonPendingListShares.map((listShare) => (
          <ListShare
            key={listShare.id}
            listShare={listShare}
            isOnlyUser={nonPendingListShares.length === 1}
          />
        ))}
        {pendingListShares.length > 0 && (
          <div className="flex items-center gap-2 py-2">
            <section className="flex items-center gap-1">
              <ArrowDownIcon className="size-3 opacity-70" />
              <Text
                size="1"
                color="gray"
                weight="bold"
                className="text-nowrap uppercase"
              >
                Pending Invites
              </Text>
            </section>
            <Separator size="4" className="h-[2px]" />
          </div>
        )}
        {pendingListShares.map((listShare) => (
          <ListShare key={listShare.id} listShare={listShare} />
        ))}
      </article>
    </React.Fragment>
  );
};

export default ListSharing;
