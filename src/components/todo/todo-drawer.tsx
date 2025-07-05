import React from "react";
import Drawer from "@/components/ui/drawer";
import { useAtom } from "jotai";
import { selectedTodoIdAtom } from "./todos.store";
import useTodoActions from "./use-todo-menu-items";
import { useIsMobile } from "@/hooks/use-is-mobile";
import MenuDrawer from "../ui/menu/menu-drawer";

const TodoDrawer: React.FC = () => {
  const { menuItems } = useTodoActions();
  const [selectedTodoId, setSelectedTodoId] = useAtom(selectedTodoIdAtom);

  const isMobile = useIsMobile();

  return (
    <Drawer.Root
      open={!!selectedTodoId && isMobile}
      onOpenChange={(isOpen) => {
        if (!isOpen) setSelectedTodoId(null);
      }}
    >
      <Drawer.Content>
        <MenuDrawer menuItems={menuItems} />
      </Drawer.Content>
    </Drawer.Root>
  );
};

export default TodoDrawer;
