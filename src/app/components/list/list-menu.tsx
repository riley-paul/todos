import { IconButton } from "@radix-ui/themes";
import React from "react";
import { zListName, type ListSelect } from "@/lib/types";
import {
  Edit2Icon,
  EllipsisIcon,
  ExternalLinkIcon,
  Link2Icon,
  ListXIcon,
  LogOutIcon,
  PinIcon,
  PinOffIcon,
  Share2Icon,
  SquareMinusIcon,
  TrashIcon,
} from "lucide-react";
import ResponsiveMenu from "../ui/menu/responsive-menu";
import useMutations from "@/app/hooks/use-mutations";
import { useAtom } from "jotai";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import { alertSystemAtom } from "../alert-system/alert-system.store";
import type { MenuItem } from "../ui/menu/types";
import ListShareDialog from "./list-share-dialog";

type Props = {
  list: ListSelect;
};

const ListMenu: React.FC<Props> = ({ list }) => {
  const { id, name, otherUsers, isPinned } = list;
  const {
    deleteList,
    leaveList,
    updateList,
    uncheckCompletedTodos,
    deleteCompletedTodos,
  } = useMutations();

  const [, dispatchAlert] = useAtom(alertSystemAtom);
  const [, copyToClipboard] = useCopyToClipboard();
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);

  const isOnlyUser = otherUsers.length === 0;

  const handleRenameList = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "input",
        title: "Rename List",
        message: "Update the name of your list",
        value: name,
        placeholder: "Enter new list name",
        schema: zListName,
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
          leaveList.mutate({ listId: id });
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

  const handleTogglePin = () => {
    updateList.mutate({ id, data: { isPinned: !isPinned } });
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
    },
    {
      type: "item",
      key: "pin",
      text: isPinned ? "Unpin" : "Pin",
      icon: isPinned ? (
        <PinOffIcon className="size-4 opacity-70" />
      ) : (
        <PinIcon className="size-4 opacity-70" />
      ),
      onClick: handleTogglePin,
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
      hide: isOnlyUser,
    },
    {
      type: "item",
      key: "delete-list",
      text: "Delete",
      icon: <TrashIcon className="size-4 opacity-70" />,
      color: "red",
      onClick: handleDeleteList,
    },
  ];

  return (
    <>
      <ListShareDialog
        list={list}
        isOpen={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />
      <ResponsiveMenu menuItems={menuItems}>
        <IconButton size="1" variant="ghost">
          <EllipsisIcon className="size-3 opacity-90" />
        </IconButton>
      </ResponsiveMenu>
    </>
  );
};

export default ListMenu;
