import type { ListSelect } from "@/lib/types";
import React from "react";
import ResponsiveMenu from "../ui/menu/responsive-menu";
import { IconButton, Text } from "@radix-ui/themes";
import { EllipsisIcon, PinIcon } from "lucide-react";
import type { MenuItem } from "../ui/menu/types";
import { goToList } from "@/lib/client/links";
import UserBubbleGroup from "../ui/user-bubble-group";

type Props = {
  lists: ListSelect[];
};

const ListMenuItemContent: React.FC<{ list: ListSelect }> = ({
  list: { name, otherUsers, isPinned, todoCount },
}) => (
  <div className="flex w-full flex-1 items-center justify-between gap-2">
    <section className="flex items-center gap-2">
      <Text truncate className="max-w-[70vw]">
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

const ListsMenu: React.FC<Props> = ({ lists }) => {
  const listMenuItems: MenuItem[] = lists.map((list) => ({
    type: "link",
    key: list.id,
    text: <ListMenuItemContent list={list} />,
    linkOptions: goToList(list.id),
  }));

  return (
    <ResponsiveMenu
      menuItems={listMenuItems}
      dropdownProps={{ className: "min-w-40" }}
    >
      <IconButton variant="soft" size="1" className="m-0 size-[26px] p-0">
        <EllipsisIcon className="size-4" />
      </IconButton>
    </ResponsiveMenu>
  );
};

export default ListsMenu;
