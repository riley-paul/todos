import { useIsMobile } from "@/app/hooks/use-is-mobile";
import { Dialog, DropdownMenu } from "@radix-ui/themes";
import React from "react";
import type { MenuItem } from "./menu.types";
import MenuDrawer from "./menu-drawer";
import MenuDropdown from "./menu-dropdown";
import { cn } from "@/lib/client/utils";
import MenuDrawerContent from "./menu-drawer-content";

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
      <Dialog.Root>
        <Dialog.Trigger>{children}</Dialog.Trigger>
        <MenuDrawerContent>
          <MenuDrawer menuItems={menuItems} />
        </MenuDrawerContent>
      </Dialog.Root>
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
