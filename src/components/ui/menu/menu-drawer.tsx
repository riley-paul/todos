import React from "react";
import type { MenuItem } from "./types";
import { Button, Separator } from "@radix-ui/themes";

type Props = {
  menuItems: MenuItem[];
};

const MenuDrawer: React.FC<Props> = ({ menuItems }) => {
  return menuItems.map((item, index) => {
    if (item.type === "separator") {
      return <Separator size="4" className="mx-3 my-1" key={`sep-${index}`} />;
    }

    return (
      <Button
        key={item.key}
        onClick={item.onClick}
        disabled={item.disabled}
        color={item.color}
        variant="ghost"
        radius="large"
        className="m-0 justify-start py-2 px-3 gap-0.5"
      >
        {item.icon}
        <span className="ml-2">{item.text}</span>
      </Button>
    );
  });
};

export default MenuDrawer;
