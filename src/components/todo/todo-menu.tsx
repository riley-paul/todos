import { DropdownMenu, IconButton } from "@radix-ui/themes";
import React from "react";
import useTodoActions from "./use-todo-menu-items";
import { EllipsisIcon } from "lucide-react";
import MenuDropdown from "../ui/menu/menu-dropdown";

const TodoMenu: React.FC<{ todoId: string }> = ({ todoId }) => {
  const { menuItems } = useTodoActions(todoId);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton size="2" variant="ghost">
          <EllipsisIcon className="size-4" />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="min-w-48">
        <MenuDropdown menuItems={menuItems} />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default TodoMenu;
