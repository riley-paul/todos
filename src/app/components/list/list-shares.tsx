import React from "react";
import { Button, Separator, Text, type ButtonProps } from "@radix-ui/themes";
import { ArrowDownIcon, HourglassIcon, LogOutIcon, XIcon } from "lucide-react";
import UserRow from "../ui/user/user-row";
import useManageListUsers from "@/app/hooks/actions/use-manage-list-users";
import type { UserSelectListDetails } from "@/lib/types2";
import { useUser } from "@/app/providers/user-provider";
import useGetListUsers from "@/app/hooks/actions/use-get-list-users";

type ListShareProps = {
  listId: string;
  listUser: UserSelectListDetails;
  isOnlyUser?: boolean;
};

const ListUser: React.FC<ListShareProps> = ({
  listId,
  listUser,
  isOnlyUser,
}) => {
  const currentUser = useUser();
  const { handleRemoveFromList, handleLeaveList } = useManageListUsers(listId);

  const getActionProps = (): ButtonProps => {
    if (listUser.isPending) {
      return {
        color: "amber",
        children: (
          <React.Fragment>
            <XIcon className="size-3" />
            <span>Cancel</span>
          </React.Fragment>
        ),
        onClick: () => handleRemoveFromList(listUser.id),
      };
    }

    if (listUser.id === currentUser?.id) {
      return {
        disabled: isOnlyUser,
        children: (
          <React.Fragment>
            <LogOutIcon className="size-3" />
            <span>Leave</span>
          </React.Fragment>
        ),
        onClick: handleLeaveList,
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
      onClick: () => handleRemoveFromList(listUser.id),
    };
  };

  return (
    <article className="xs:hover:bg-accent-3 rounded-3 -mx-3 flex items-center gap-3 px-3 py-2 transition-colors ease-in">
      <UserRow user={listUser} className="flex-1" isLarge />
      <section className="flex items-center gap-3">
        {listUser.isPending && (
          <HourglassIcon className="text-amber-10 size-3" />
        )}
        <Button size="1" variant="soft" {...getActionProps()} />
      </section>
    </article>
  );
};

const ListShares: React.FC<{ listId: string }> = ({ listId }) => {
  const listUsers = useGetListUsers(listId);

  const pendingListUsers = listUsers.filter(({ isPending }) => isPending);
  const nonPendingListUsers = listUsers.filter(({ isPending }) => !isPending);

  return (
    <article className="-mx-6 flex flex-col gap-1 overflow-x-hidden overflow-y-auto px-6">
      {nonPendingListUsers.map((listShare) => (
        <ListUser
          key={listShare.id}
          listId={listId}
          listUser={listShare}
          isOnlyUser={nonPendingListUsers.length === 1}
        />
      ))}
      {pendingListUsers.length > 0 && (
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
          <Separator size="4" className="h-0.5" />
        </div>
      )}
      {pendingListUsers.map((listUser) => (
        <ListUser key={listUser.id} listId={listId} listUser={listUser} />
      ))}
    </article>
  );
};

export default ListShares;
