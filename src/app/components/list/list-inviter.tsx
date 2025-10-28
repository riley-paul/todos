import React from "react";
import { Button } from "@radix-ui/themes";
import { SendIcon } from "lucide-react";
import UserSearch from "./user-search";
import { toast } from "sonner";
import useMutations from "@/app/hooks/use-mutations";

type UserInviterProps = {
  listId: string;
  isUserDisabled: (userId: string) => boolean;
};

const ListUserInviter: React.FC<UserInviterProps> = ({
  listId,
  isUserDisabled,
}) => {
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
            { listId, userId: selectedUserId },
            {
              onSuccess: () => {
                toast.success(`Invited user`);
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

export default ListUserInviter;
