import { cn } from "@/lib/client/utils";
import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { useAtom } from "jotai";
import React from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import { alertSystemAtom } from "./alert-system/alert-system.store";
import useMutations from "@/hooks/use-mutations";
import type { ListSelect } from "@/lib/types";
import { z } from "zod/v4";

type Props = {
  list: ListSelect;
};

const ListMenu: React.FC<Props> = ({ list: { id, name, isAuthor } }) => {
  const { deleteList, leaveListShare, updateList } = useMutations();

  const [, dispatchAlert] = useAtom(alertSystemAtom);
  const [, copyToClipboard] = useCopyToClipboard();

  const handleRenameList = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "input",
        title: "Rename List",
        message: "Update the name of your list",
        value: name,
        placeholder: "Enter new list name",
        schema: z.string().min(1).max(100),
        handleSubmit: (name: string) => {
          updateList.mutate({ id, data: { name } });
          dispatchAlert({ type: "close" });
          toast.success("List renamed successfully");
        },
      },
    });
  };

  const handleDeleteList = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "delete",
        title: "Delete List",
        message: `Are you sure you want to delete this list? This action cannot be undone.`,
        handleDelete: () => {
          deleteList.mutate({ id });
          dispatchAlert({ type: "close" });
        },
      },
    });
  };

  const handleLeaveList = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "delete",
        title: "Leave List",
        message: `Are you sure you want to leave this list? This action cannot be undone. You will have to be re-invited to access it again.`,
        handleDelete: () => {
          leaveListShare.mutate({ listId: id });
          dispatchAlert({ type: "close" });
        },
        confirmButtonProps: {
          children: "Leave",
          color: "amber",
        },
      },
    });
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/todos/${id}`;
    copyToClipboard(link);
    toast.success("Link copied to clipboard", { description: link });
  };

  const handleOpenInNewTab = () => {
    const link = `${window.location.origin}/todos/${id}`;
    window.open(link, "_blank");
  };

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger>
        <IconButton size="1" variant="ghost">
          <i className="fa-solid fa-ellipsis text-accent-10" />
        </IconButton>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className="min-w-32">
        <DropdownMenu.Item onClick={handleRenameList}>
          <i className="fas fa-edit opacity-70" />
          <span>Rename</span>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={handleCopyLink}>
          <i className="fas fa-link opacity-70" />
          <span>Copy link</span>
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={handleOpenInNewTab}>
          <i className="fas fa-arrow-up-right-from-square opacity-70" />
          <span>Open in new tab</span>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item
          onClick={isAuthor ? handleDeleteList : handleLeaveList}
          color={isAuthor ? "red" : "amber"}
        >
          <i
            className={cn(
              "fas opacity-70",
              isAuthor ? "fa-trash" : "fa-arrow-right-from-bracket",
            )}
          />
          <span>{isAuthor ? "Delete" : "Leave"}</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default ListMenu;
