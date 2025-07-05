import { DropdownMenu } from "@radix-ui/themes";
import React from "react";
import type { MenuItem } from "./types";
import { Link } from "@tanstack/react-router";

type Props = {
  menuItems: MenuItem[];
};

const MenuDropdown: React.FC<Props> = ({ menuItems }) => {
  return menuItems
    .filter(({ hide }) => !hide)
    .map((item, index) => {
      if (item.type === "separator") {
        return <DropdownMenu.Separator key={`sep-${index}`} />;
      }

      if (item.type === "item") {
        const itemProps = {
          key: item.key,
          onClick: item.onClick,
          disabled: item.disabled,
          color: item.color,
        };

        if (item.children) {
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

        if (item.linkOptions) {
          return (
            <DropdownMenu.Item {...itemProps} asChild>
              <Link {...item.linkOptions}>
                {item.icon}
                <span>{item.text}</span>
              </Link>
            </DropdownMenu.Item>
          );
        }

        if (item.anchorOptions) {
          return (
            <DropdownMenu.Item {...itemProps} asChild>
              <a {...item.anchorOptions}>
                {item.icon}
                <span>{item.text}</span>
              </a>
            </DropdownMenu.Item>
          );
        }

        return (
          <DropdownMenu.Item {...itemProps}>
            {item.icon}
            <span>{item.text}</span>
          </DropdownMenu.Item>
        );
      }
    });
};

export default MenuDropdown;
