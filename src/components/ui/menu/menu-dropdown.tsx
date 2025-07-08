import { DropdownMenu } from "@radix-ui/themes";
import React from "react";
import type { BaseMenuItem, MenuItem } from "./types";
import { Link } from "@tanstack/react-router";

type Props = {
  menuItems: MenuItem[];
};

const getItemProps = ({ key, disabled, color }: BaseMenuItem) => ({
  key,
  disabled,
  color,
});

const MenuDropdown: React.FC<Props> = ({ menuItems }) => {
  return menuItems
    .filter(({ hide }) => !hide)
    .map((item, index) => {
      switch (item.type) {
        case "custom":
          return item.component;
        case "separator":
          return <DropdownMenu.Separator key={`sep-${index}`} />;
        case "item": {
          const itemProps = getItemProps(item);
          return (
            <DropdownMenu.Item {...itemProps} onClick={item.onClick}>
              {item.icon}
              <span>{item.text}</span>
            </DropdownMenu.Item>
          );
        }
        case "anchor": {
          const itemProps = getItemProps(item);
          return (
            <DropdownMenu.Item {...itemProps} asChild>
              <a {...item.anchorOptions}>
                {item.icon}
                <span>{item.text}</span>
              </a>
            </DropdownMenu.Item>
          );
        }
        case "link": {
          const itemProps = getItemProps(item);
          return (
            <DropdownMenu.Item {...itemProps} asChild>
              <Link {...item.linkOptions}>
                {item.icon}
                <span>{item.text}</span>
              </Link>
            </DropdownMenu.Item>
          );
        }
        case "parent": {
          const itemProps = getItemProps(item);
          return (
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger {...itemProps}>
                {item.icon}
                <span>{item.text}</span>
              </DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                <MenuDropdown menuItems={item.children} />
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
          );
        }
      }
    });
};

export default MenuDropdown;
