import { IconButton } from "@radix-ui/themes";
import React from "react";
import type { ListSelect } from "@/lib/types";
import { EllipsisIcon } from "lucide-react";
import useListMenuItems from "./use-list-menu-items";
import MenuDrawer from "../ui/menu/menu-drawer";
import Drawer from "../ui/drawer";

type Props = {
  list: ListSelect;
};

const ListDrawer: React.FC<Props> = ({ list }) => {
  const { shareDialog, menuItems } = useListMenuItems({ list });

  return (
    <>
      {shareDialog}
      <Drawer.Root modal={false}>
        <Drawer.Trigger asChild>
          <IconButton size="1" variant="ghost">
            <EllipsisIcon className="size-3 opacity-90" />
          </IconButton>
        </Drawer.Trigger>

        <Drawer.Content>
          <MenuDrawer menuItems={menuItems} />
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
};

export default ListDrawer;
