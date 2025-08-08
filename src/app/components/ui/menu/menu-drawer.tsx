import React from "react";
import type { BaseMenuItem, MenuItem } from "./types";
import { Button, Separator, type ButtonProps } from "@radix-ui/themes";
import { ChevronRightIcon } from "lucide-react";
import Drawer from "../drawer";
import { Link } from "@tanstack/react-router";

type Props = {
  menuItems: MenuItem[];
};

const getButtonProps = (item: BaseMenuItem): ButtonProps => ({
  disabled: item.disabled,
  color: item.color,
  variant: "ghost",
  radius: "large",
  className: "m-0 justify-start py-2 px-2 gap-0.5",
});

const MenuDrawer: React.FC<Props> = ({ menuItems }) => {
  return menuItems
    .filter(({ hide }) => !hide)
    .map((item, index) => {
      switch (item.type) {
        case "custom":
          return item.component;
        case "separator":
          return (
            <Separator
              key={`sep-${index}`}
              size="4"
              className="mx-2 my-1 w-auto"
            />
          );
        case "item": {
          const buttonProps = getButtonProps(item);
          return (
            <Drawer.Close key={item.key} asChild>
              <Button {...buttonProps} onClick={item.onClick}>
                {item.icon}
                <span className="ml-2 w-full text-left">{item.text}</span>
              </Button>
            </Drawer.Close>
          );
        }
        case "anchor": {
          const buttonProps = getButtonProps(item);
          return (
            <Drawer.Close key={item.key} asChild>
              <Button {...buttonProps} asChild>
                <a {...item.anchorOptions}>
                  {item.icon}
                  <span className="ml-2 w-full text-left">{item.text}</span>
                </a>
              </Button>
            </Drawer.Close>
          );
        }
        case "link": {
          const buttonProps = getButtonProps(item);
          return (
            <Drawer.Close key={item.key} asChild>
              <Button {...buttonProps} asChild>
                <Link {...item.linkOptions}>
                  {item.icon}
                  <span className="ml-2 w-full text-left">{item.text}</span>
                </Link>
              </Button>
            </Drawer.Close>
          );
        }
        case "parent": {
          const buttonProps = getButtonProps(item);
          return (
            <Drawer.NestedRoot key={item.key}>
              <Drawer.Trigger asChild>
                <Button {...buttonProps}>
                  {item.icon}
                  <span className="ml-2 w-full text-left">{item.text}</span>
                  <ChevronRightIcon className="ml-auto size-4 opacity-70" />
                </Button>
              </Drawer.Trigger>
              <Drawer.Content>
                <MenuDrawer menuItems={item.children} />
              </Drawer.Content>
            </Drawer.NestedRoot>
          );
        }
      }
    });
};

export default MenuDrawer;
