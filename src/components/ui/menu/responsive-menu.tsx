import { useIsMobile } from "@/hooks/use-is-mobile";
import { DropdownMenu } from "@radix-ui/themes";
import type { ClassValue } from "clsx";
import React from "react";
import Drawer from "../drawer";
import type { MenuItem } from "./types";
import MenuDrawer from "./menu-drawer";
import MenuDropdown from "./menu-dropdown";

type Props = React.PropsWithChildren<{
  menuItems: MenuItem[];
  dropdownProps?: DropdownMenu.RootProps;
  contentClassName?: ClassValue;
}>;

const ResponsiveMenu: React.FC<Props> = ({ children, menuItems }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer.Root>
        <Drawer.Trigger asChild>{children}</Drawer.Trigger>
        <Drawer.Content>
          <MenuDrawer menuItems={menuItems} />
        </Drawer.Content>
      </Drawer.Root>
    );
  }

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger>{children}</DropdownMenu.Trigger>
      <DropdownMenu.Content className="min-w-32">
        <MenuDropdown menuItems={menuItems} />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default ResponsiveMenu;
