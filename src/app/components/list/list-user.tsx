import React from "react";
import { IconButton, Text, Tooltip } from "@radix-ui/themes";
import type { ListUserSelect } from "@/lib/types";
import useMutations from "@/app/hooks/use-mutations";
import UserBubble from "../ui/user-bubble";
import { XIcon } from "lucide-react";
import { useAtom } from "jotai";
import { alertSystemAtom } from "../alert-system/alert-system.store";

type Props = {
  listUser: ListUserSelect;
};

const ListUser: React.FC<Props> = ({ listUser }) => {
  const { leaveList } = useMutations();
  const [, dispatchAlert] = useAtom(alertSystemAtom);

  const handleDelete = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "delete",
        title: "Remove User",
        message: `Are you sure you want to remove ${listUser.user.name} from this list? This action cannot be undone.`,
        handleDelete: () => {
          leaveList.mutate({
            listId: listUser.listId,
            userId: listUser.userId,
          });
          dispatchAlert({ type: "close" });
        },
      },
    });
  };

  return (
    <div className="flex items-center gap-3 px-3 py-2 transition-colors hover:bg-gray-4">
      <div className="relative">
        <UserBubble user={listUser.user} avatarProps={{ size: "2" }} />
        {listUser.isPending && (
          <Tooltip side="left" content="Pending Invitation">
            <div className="shadow absolute -right-0.5 -top-0.5 size-3 rounded-full bg-yellow-9" />
          </Tooltip>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-0.5 text-left">
        <Text size="2" weight="medium">
          {listUser.user.name}
        </Text>
        <Text size="2" color="gray">
          {listUser.user.email}
        </Text>
      </div>

      <IconButton
        variant="soft"
        size="1"
        radius="full"
        color="red"
        onClick={handleDelete}
      >
        <XIcon className="size-4" />
      </IconButton>
    </div>
  );
};

export default ListUser;
