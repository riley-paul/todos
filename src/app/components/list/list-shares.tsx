import type { ListUserSelect } from "@/lib/types";
import React from "react";
import { Button, Separator, Text, type ButtonProps } from "@radix-ui/themes";
import { ArrowDownIcon, HourglassIcon, LogOutIcon, XIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import UserBubble from "../ui/user-bubble";
import { qUser } from "@/app/lib/queries";
import useAlerts from "@/app/hooks/use-alerts";

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

const ListShares: React.FC<{ listShares: ListUserSelect[] }> = ({
  listShares,
}) => {
  const pendingListShares = listShares.filter(({ isPending }) => isPending);
  const nonPendingListShares = listShares.filter(({ isPending }) => !isPending);

  return (
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
  );
};

export default ListShares;
