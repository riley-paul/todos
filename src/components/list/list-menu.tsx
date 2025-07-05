import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { useAtom } from "jotai";
import React from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import { alertSystemAtom } from "@/components/alert-system/alert-system.store";
import useMutations from "@/hooks/use-mutations";
import type { ListSelect } from "@/lib/types";
import { z } from "zod/v4";
import {
  Edit2Icon,
  EllipsisIcon,
  ExternalLinkIcon,
  Link2Icon,
  ListXIcon,
  LogOutIcon,
  Share2Icon,
  SquareMinusIcon,
  TrashIcon,
} from "lucide-react";
import ListShareDialog from "./list-share-dialog";
import type { MenuItem } from "../ui/menu/types";
import MenuDropdown from "../ui/menu/menu-dropdown";

type Props = {
  list: ListSelect;
};

const ListMenu: React.FC<Props> = ({ list }) => {
  const { id, name, isAuthor } = list;
  const {
    deleteList,
    leaveListShare,
    updateList,
    uncheckCompletedTodos,
    deleteCompletedTodos,
  } = useMutations();

  const [, dispatchAlert] = useAtom(alertSystemAtom);
  const [, copyToClipboard] = useCopyToClipboard();
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);

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

  const menuItems: MenuItem[] = [
    {
      type: "item",
      key: "rename",
      text: "Rename",
      icon: <Edit2Icon className="size-4 opacity-70" />,
      onClick: handleRenameList,
    },
    {
      type: "item",
      key: "share",
      text: "Share",
      icon: <Share2Icon className="size-4 opacity-70" />,
      onClick: () => setShareDialogOpen(true),
      hide: !list.isAuthor,
    },
    {
      type: "separator",
    },
    {
      type: "item",
      key: "copy-link",
      text: "Copy Link",
      icon: <Link2Icon className="size-4 opacity-70" />,
      onClick: handleCopyLink,
    },
    {
      type: "item",
      key: "open-in-new-tab",
      text: "Open in New Tab",
      icon: <ExternalLinkIcon className="size-4 opacity-70" />,
      onClick: handleOpenInNewTab,
    },
    {
      type: "separator",
    },
    {
      type: "item",
      key: "uncheck-all",
      text: "Uncheck all",
      icon: <SquareMinusIcon className="size-4 opacity-70" />,
      onClick: () => uncheckCompletedTodos.mutate({ listId: id }),
    },
    {
      type: "item",
      key: "delete-completed",
      text: "Delete completed",
      icon: <ListXIcon className="size-4 opacity-70" />,
      onClick: () => deleteCompletedTodos.mutate({ listId: id }),
    },
    {
      type: "separator",
    },
    {
      type: "item",
      key: "leave-list",
      text: "Leave",
      icon: <LogOutIcon className="size-4 opacity-70" />,
      color: "amber",
      onClick: handleLeaveList,
      hide: isAuthor,
    },
    {
      type: "item",
      key: "delete-list",
      text: "Delete",
      icon: <TrashIcon className="size-4 opacity-70" />,
      color: "red",
      onClick: handleDeleteList,
      hide: !isAuthor,
    },
  ];

  return (
    <>
      <ListShareDialog
        list={list}
        isOpen={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger>
          <IconButton size="1" variant="ghost">
            <EllipsisIcon className="size-3 opacity-90" />
          </IconButton>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content className="min-w-32">
          <MenuDropdown menuItems={menuItems} />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
};

export default ListMenu;
