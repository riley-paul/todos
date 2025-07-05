import useMutations from "@/hooks/use-mutations";
import { useAtom } from "jotai";
import { editingTodoIdAtom } from "./todos.store";
import { Edit2Icon, CornerDownRightIcon, DeleteIcon } from "lucide-react";
import type { MenuItem } from "../ui/menu/types";
import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { qLists } from "@/lib/client/queries";

export default function useTodoActions(todoId: string) {
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

  return { menuItems };
}
