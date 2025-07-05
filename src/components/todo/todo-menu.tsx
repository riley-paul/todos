import { DropdownMenu, IconButton } from "@radix-ui/themes";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { qLists } from "@/lib/client/queries";
import { useParams } from "@tanstack/react-router";
import useTodoActions from "./use-todo-actions";
import { useAtom } from "jotai";
import { selectedTodoIdAtom } from "./todos.store";
import {
  CornerDownRightIcon,
  DeleteIcon,
  Edit2Icon,
  EllipsisIcon,
} from "lucide-react";
import type { MenuItem } from "../ui/menu/types";
import MenuDropdown from "../ui/menu/menu-dropdown";

const TodoMenu: React.FC<{ todoId: string }> = ({ todoId }) => {
  const { handleDelete, handleEdit, handleMove } = useTodoActions();
  const [_, setSelectedTodoId] = useAtom(selectedTodoIdAtom);

  const { listId } = useParams({ strict: false });
  const { data: lists = [] } = useQuery(qLists);

  const moveMenuItems: MenuItem[] = [
    {
      type: "item",
      key: "move-inbox",
      text: "Inbox",
      onClick: () => handleMove(null),
      hide: !listId,
    },
    ...lists.map(
      (list): MenuItem => ({
        type: "item",
        key: `move-${list.id}`,
        text: list.name,
        onClick: () => handleMove(list.id),
        hide: list.id === listId,
      }),
    ),
  ];

  const menuItems: MenuItem[] = [
    {
      type: "item",
      key: "edit",
      text: "Edit",
      icon: <Edit2Icon className="size-4 opacity-70" />,
      onClick: handleEdit,
    },
    {
      type: "item",
      key: "move",
      text: "Move",
      icon: <CornerDownRightIcon className="size-4 opacity-70" />,
      children: moveMenuItems,
    },
    {
      type: "separator",
    },
    {
      type: "item",
      key: "delete",
      text: "Delete",
      icon: <DeleteIcon className="size-4 opacity-70" />,
      color: "red",
      onClick: handleDelete,
    },
  ];

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
