import React from "react";
import type { MenuItem } from "./types";
import { Button, Separator, type ButtonProps } from "@radix-ui/themes";
import { ChevronRightIcon } from "lucide-react";
import Drawer from "../drawer";

type Props = {
  menuItems: MenuItem[];
};

const MenuDrawer: React.FC<Props> = ({ menuItems }) => {
  return menuItems
    .filter(({ hide }) => !hide)
    .map((item, index) => {
      if (item.type === "separator") {
        return (
          <Separator
            size="4"
            className="mx-2 my-1 w-auto"
            key={`sep-${index}`}
          />
        );
      }

      if (item.type === "custom") {
        return item.component;
      }

      const buttonProps: ButtonProps = {
        key: item.key,
        onClick: item.onClick,
        disabled: item.disabled,
        color: item.color,
        variant: "ghost",
        radius: "large",
        className: "m-0 justify-start py-2 px-2 gap-0.5",
      };

      if (item.children) {
        return (
          <Drawer.NestedRoot key={item.key}>
            <Drawer.Trigger asChild>
              <Button {...buttonProps}>
                {item.icon}
                <span className="ml-2">{item.text}</span>
                <ChevronRightIcon className="ml-auto size-4 opacity-70" />
              </Button>
            </Drawer.Trigger>
            <Drawer.Content>
              <MenuDrawer menuItems={item.children} />
            </Drawer.Content>
          </Drawer.NestedRoot>
        );
      }

      return (
        <Drawer.Close key={item.key} asChild>
          <Button {...buttonProps}>
            {item.icon}
            <span className="ml-2">{item.text}</span>
          </Button>
        </Drawer.Close>
      );
    });
};

export default MenuDrawer;
