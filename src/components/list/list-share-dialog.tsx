import type { ListSelect } from "@/lib/types";
import { Button, Dialog } from "@radix-ui/themes";
import React from "react";
import ListShares from "./list-shares";
import { SendIcon } from "lucide-react";
import ResponsiveDialog from "../ui/responsive-dialog";
import UserPicker from "./user-picker";
import useMutations from "@/hooks/use-mutations";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  list: ListSelect;
};

const ListShareDialogContent: React.FC<{ list: ListSelect }> = ({ list }) => {
  const otherUserIdsSet = new Set(list.otherUsers.map((user) => user.id));

  const [search, setSearch] = React.useState("");
  const [selectedUserId, setSelectedUserId] = React.useState<string>("");

  const { joinList } = useMutations();

  return (
    <section className="flex min-h-64 flex-col gap-4 py-6">
      <div className="grid grid-cols-[1fr_auto] items-center gap-2">
        <UserPicker
          search={search}
          setSearch={setSearch}
          selectedUserId={selectedUserId}
          setSelectedUserId={setSelectedUserId}
          isUserDisabled={(user) => otherUserIdsSet.has(user.id)}
        />
        <Button
          disabled={!selectedUserId}
          onClick={() =>
            joinList.mutate(
              { listId: list.id, userId: selectedUserId },
              {
                onSuccess: () => {
                  toast.success(`Added user to ${list.name}!`);
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
      <ListShares list={list} />
    </section>
  );
};

const ListShareDialog: React.FC<Props> = ({ list, isOpen, onOpenChange }) => {
  return (
    <ResponsiveDialog
      open={isOpen}
      onOpenChange={onOpenChange}
      title="Share List"
      description="Add other users to your list so they can add and delete todos"
    >
      <ListShareDialogContent list={list} />
      <footer className="text-right">
        <Dialog.Close>
          <Button variant="soft">Close</Button>
        </Dialog.Close>
      </footer>
    </ResponsiveDialog>
  );
};

export default ListShareDialog;
