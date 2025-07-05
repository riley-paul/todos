import { DropdownMenu, IconButton } from "@radix-ui/themes";
import React from "react";
import useTodoActions from "./use-todo-menu-items";
import { useAtom } from "jotai";
import { selectedTodoIdAtom } from "./todos.store";
import { EllipsisIcon } from "lucide-react";
import MenuDropdown from "../ui/menu/menu-dropdown";

const TodoMenu: React.FC<{ todoId: string }> = ({ todoId }) => {
  const { menuItems } = useTodoActions();
  const [_, setSelectedTodoId] = useAtom(selectedTodoIdAtom);

  return (
    <DropdownMenu.Root
      onOpenChange={(isOpen) => setSelectedTodoId(isOpen ? todoId : null)}
    >
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
