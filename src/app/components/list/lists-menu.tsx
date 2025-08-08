import type { ListSelect, SelectedList } from "@/lib/types";
import React from "react";
import ResponsiveMenu from "../ui/menu/responsive-menu";
import { Button, IconButton, Text } from "@radix-ui/themes";
import { ChevronDownIcon, EllipsisIcon, PinIcon } from "lucide-react";
import type { MenuItem } from "../ui/menu/types";
import { goToList } from "@/lib/client/links";
import UserBubbleGroup from "../ui/user-bubble-group";
import { useParams } from "@tanstack/react-router";
import ListMenu from "./list-menu";

type Props = {
  lists: ListSelect[];
};

const ListMenuItemContent: React.FC<{ list: ListSelect }> = ({
  list: { id, name, otherUsers, isPinned, todoCount },
}) => {
  const { listId: currentListId } = useParams({ strict: false });
  const isActive = currentListId === id;

  return (
    <div className="flex w-full flex-1 items-center justify-between gap-6">
      <section className="flex items-center gap-2">
        <Text
          truncate
          className="max-w-[70vw]"
          weight={isActive ? "bold" : "regular"}
        >
          {name}
        </Text>
        <Text className="font-mono opacity-70">{todoCount}</Text>
      </section>
      <section className="flex items-center gap-2">
        {otherUsers && <UserBubbleGroup users={otherUsers} numAvatars={3} />}
        {isPinned && <PinIcon className="size-4 text-amber-9" />}
      </section>
    </div>
  );
};

const ListsMenu: React.FC<Props> = ({ lists }) => {
  const { listId: currentListId } = useParams({ strict: false });

  const indexOfLastPinned = lists.findIndex(({ isPinned }) => !isPinned);
  const listMenuItems: MenuItem[] = lists.map((list) => ({
    type: "link",
    key: list.id,
    text: <ListMenuItemContent list={list} />,
    linkOptions: goToList(list.id),
  }));
  if (indexOfLastPinned > 0) {
    listMenuItems.splice(indexOfLastPinned, 0, {
      type: "separator",
    });
  }

  const getListName = (listId: SelectedList | undefined) => {
    if (!listId) return "Inbox";
    if (listId === "all") return "All";
    return lists.find((list) => list.id === listId)?.name || "Unknown List";
  };

  const currentList = lists.find((list) => list.id === currentListId);

  return (
    <div className="flex items-center gap-3">
      <ResponsiveMenu menuItems={listMenuItems}>
        <Button variant="ghost" size="2">
          <span>{getListName(currentListId)}</span>
          <ChevronDownIcon className="size-4 opacity-90" />
        </Button>
      </ResponsiveMenu>
      {currentList && (
        <ListMenu
          trigger={
            <IconButton size="2" variant="ghost">
              <EllipsisIcon className="size-4 opacity-90" />
            </IconButton>
          }
          list={currentList}
        />
      )}
    </div>
  );
};

export default ListsMenu;
