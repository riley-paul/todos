import { DropdownMenu } from "@radix-ui/themes";
import React from "react";
import type { MenuItem } from "./types";

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
        if (item.children) {
          return (
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger
                key={item.key}
                onClick={item.onClick}
                disabled={item.disabled}
              >
                {item.icon}
                <span>{item.text}</span>
              </DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                <MenuDropdown menuItems={item.children} />
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
          );
        }

        return (
          <DropdownMenu.Item
            key={item.key}
            onClick={item.onClick}
            disabled={item.disabled}
            color={item.color}
          >
            {item.icon}
            <span>{item.text}</span>
          </DropdownMenu.Item>
        );
      }
    });
};

export default MenuDropdown;
