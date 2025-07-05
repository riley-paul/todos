import React from "react";
import Drawer from "@/components/ui/drawer";
import useTodoActions from "./use-todo-menu-items";
import MenuDrawer from "../ui/menu/menu-drawer";
import { IconButton } from "@radix-ui/themes";
import { EllipsisIcon } from "lucide-react";

type Props = {
  todoId: string;
};

const TodoDrawer: React.FC<Props> = ({ todoId }) => {
  const { menuItems } = useTodoActions(todoId);

  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <IconButton size="2" variant="ghost">
          <EllipsisIcon className="size-4" />
        </IconButton>
      </Drawer.Trigger>
      <Drawer.Content>
        <MenuDrawer menuItems={menuItems} />
      </Drawer.Content>
    </Drawer.Root>
  );
};

export default TodoDrawer;
