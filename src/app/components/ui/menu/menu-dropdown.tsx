import { DropdownMenu } from "@radix-ui/themes";
import React from "react";
import type { BaseMenuItem, MenuItem } from "./types";
import { Link } from "@tanstack/react-router";

type Props = {
  menuItems: MenuItem[];
};

const getItemProps = ({ disabled, color }: BaseMenuItem) => ({
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
            <DropdownMenu.Item
              {...itemProps}
              key={item.key}
              onClick={item.onClick}
            >
              {item.icon}
              <span className="w-full">{item.text}</span>
            </DropdownMenu.Item>
          );
        }
        case "anchor": {
          const itemProps = getItemProps(item);
          return (
            <DropdownMenu.Item {...itemProps} key={item.key} asChild>
              <a {...item.anchorOptions}>
                {item.icon}
                <span className="w-full">{item.text}</span>
              </a>
            </DropdownMenu.Item>
          );
        }
        case "link": {
          const itemProps = getItemProps(item);
          return (
            <DropdownMenu.Item {...itemProps} key={item.key} asChild>
              <Link {...item.linkOptions}>
                {item.icon}
                <span className="w-full">{item.text}</span>
              </Link>
            </DropdownMenu.Item>
          );
        }
        case "parent": {
          const itemProps = getItemProps(item);
          return (
            <DropdownMenu.Sub key={item.key}>
              <DropdownMenu.SubTrigger {...itemProps}>
                {item.icon}
                <span className="w-full">{item.text}</span>
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
