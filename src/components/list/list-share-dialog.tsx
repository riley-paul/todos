import type { ListSelect } from "@/lib/types";
import { Button, Dialog } from "@radix-ui/themes";
import React from "react";
import ListShares from "./list-shares";
import { SendIcon } from "lucide-react";
import ResponsiveDialog from "../ui/responsive-dialog";
import UserPicker from "./user-picker";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  list: ListSelect;
};

const ListShareDialog: React.FC<Props> = ({ list, isOpen, onOpenChange }) => {
  const otherUserIdsSet = new Set(list.otherUsers.map((user) => user.id));

  return (
    <ResponsiveDialog
      open={isOpen}
      onOpenChange={onOpenChange}
      title="Share List"
      description="Add other users to your list so they can add and delete todos"
    >
      <section className="flex min-h-64 flex-col gap-4 py-6">
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <UserPicker isUserDisabled={(user) => otherUserIdsSet.has(user.id)} />
          <Button>
            <SendIcon className="size-4" />
            <span>Invite User</span>
          </Button>
        </div>
        <ListShares list={list} />
      </section>
      <footer className="text-right">
        <Dialog.Close>
          <Button variant="soft">Close</Button>
        </Dialog.Close>
      </footer>
    </ResponsiveDialog>
  );
};

export default ListShareDialog;
