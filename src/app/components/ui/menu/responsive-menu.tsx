import { useIsMobile } from "@/app/hooks/use-is-mobile";
import { DropdownMenu } from "@radix-ui/themes";
import React from "react";
import Drawer from "../drawer";
import type { MenuItem } from "./types";
import MenuDrawer from "./menu-drawer";
import MenuDropdown from "./menu-dropdown";
import { cn } from "@/lib/client/utils";

type Props = React.PropsWithChildren<{
  menuItems: MenuItem[];
  dropdownProps?: DropdownMenu.ContentProps;
}>;

const ResponsiveMenu: React.FC<Props> = ({
  children,
  menuItems,
  dropdownProps,
}) => {
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
      <DropdownMenu.Content
        {...dropdownProps}
        className={cn("min-w-32", dropdownProps?.className)}
      >
        <MenuDropdown menuItems={menuItems} />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default ResponsiveMenu;
