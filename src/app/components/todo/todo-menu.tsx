import { IconButton } from "@radix-ui/themes";
import React from "react";
import {
  CornerDownRightIcon,
  DeleteIcon,
  Edit2Icon,
  EllipsisIcon,
} from "lucide-react";
import useMutations from "@/app/hooks/use-mutations";
import { qLists } from "@/lib/client/queries";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useAtom } from "jotai";
import type { MenuItem } from "../ui/menu/types";
import { editingTodoIdAtom } from "./todos.store";
import ResponsiveMenu from "../ui/menu/responsive-menu";

const TodoMenu: React.FC<{ todoId: string }> = ({ todoId }) => {
  const { deleteTodo, moveTodo } = useMutations();

  const { listId } = useParams({ strict: false });
  const { data: lists = [] } = useQuery(qLists);

  const [_, setEditingTodoId] = useAtom(editingTodoIdAtom);

  const handleMove = (targetListId: string | null) => {
    moveTodo.mutate({ id: todoId, data: { listId: targetListId } });
  };

  const handleDelete = () => {
    deleteTodo.mutate({ id: todoId });
  };

  const handleEdit = () => {
    setEditingTodoId(todoId);
  };

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
      type: "parent",
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
    <ResponsiveMenu
      menuItems={menuItems}
      dropdownProps={{ className: "min-w-48", align: "end" }}
    >
      <IconButton size="2" variant="ghost" className="m-0">
        <EllipsisIcon className="size-4" />
      </IconButton>
    </ResponsiveMenu>
  );
};

export default TodoMenu;
