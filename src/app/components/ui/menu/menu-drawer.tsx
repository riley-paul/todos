import React from "react";
import type { BaseMenuItem, MenuItem } from "./menu.types";
import { Button, Dialog, Separator, type ButtonProps } from "@radix-ui/themes";
import { ChevronRightIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import MenuDrawerContent from "./menu-drawer-content";

type Props = {
  menuItems: MenuItem[];
};

const getButtonProps = (item: BaseMenuItem): ButtonProps => ({
  disabled: item.disabled,
  color: item.color || "gray",
  variant: "ghost",
  radius: "large",
  size: "3",
  className: "-mx-3 my-0 justify-start py-2 px-3 gap-0.5 rounded-3",
});

const MenuDialog: React.FC<Props> = ({ menuItems }) => {
  return menuItems
    .filter(({ hide }) => !hide)
    .map((item, index) => {
      switch (item.type) {
        case "custom":
          return item.component;
        case "separator":
          return (
            <Separator key={`sep-${index}`} size="4" className="my-2 w-auto" />
          );
        case "item": {
          const buttonProps = getButtonProps(item);
          return (
            <Dialog.Close key={item.key}>
              <Button {...buttonProps} onClick={item.onClick}>
                {item.icon}
                <span className="ml-2 w-full text-left">{item.text}</span>
              </Button>
            </Dialog.Close>
          );
        }
        case "anchor": {
          const buttonProps = getButtonProps(item);
          return (
            <Dialog.Close key={item.key}>
              <Button {...buttonProps} asChild>
                <a {...item.anchorOptions}>
                  {item.icon}
                  <span className="ml-2 w-full text-left">{item.text}</span>
                </a>
              </Button>
            </Dialog.Close>
          );
        }
        case "link": {
          const buttonProps = getButtonProps(item);
          return (
            <Dialog.Close key={item.key}>
              <Button {...buttonProps} asChild>
                <Link {...item.linkOptions}>
                  {item.icon}
                  <span className="ml-2 w-full text-left">{item.text}</span>
                </Link>
              </Button>
            </Dialog.Close>
          );
        }
        case "parent": {
          const buttonProps = getButtonProps(item);
          return (
            <Dialog.Root key={item.key}>
              <Dialog.Trigger>
                <Button {...buttonProps}>
                  {item.icon}
                  <span className="ml-2 w-full text-left">{item.text}</span>
                  <ChevronRightIcon className="ml-auto size-4 opacity-70" />
                </Button>
              </Dialog.Trigger>
              <MenuDrawerContent>
                <MenuDialog menuItems={item.children} />
              </MenuDrawerContent>
            </Dialog.Root>
          );
        }
      }
    });
};

export default MenuDialog;
